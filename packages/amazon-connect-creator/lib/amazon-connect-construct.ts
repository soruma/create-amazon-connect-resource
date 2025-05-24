import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { Construct } from 'constructs';

import * as connect from 'aws-cdk-lib/aws-connect';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';

export type IdentityManagementType = 'SAML' | 'CONNECT_MANAGED' | 'EXISTING_DIRECTORY';

interface AmazonConnectConstructProps {
  /**
   * Amazon Connect instance alias
   */
  connectInstanceAlias: string;

  /**
   * Mandatory element which enables inbound calls on new instance.
   */
  inboundCalls: boolean;

  /**
   * Mandatory element which enables outbound calls on new instance.
   */
  outboundCalls: boolean;

  /**
   * Boolean flag which enables CONTACTFLOW_LOGS on an instance.
   */
  contactflowLogs: boolean;

  /**
   * Boolean flag which enables AUTO_RESOLVE_BEST_VOICES on an instance.
   */
  autoResolveBestVoices: boolean;

  /**
   * The identity management type.
   */
  identityManagementType: IdentityManagementType;

  /**
   * The identifier for the directory.
   */
  directoryId?: string;

  /**
   * Amazon connect data storage
   */
  dataStorageBucket?: s3.Bucket;

  /**
   * business hours time zone
   */
  businessHoursTimeZone: string;
}

export class AmazonConnectConstruct extends Construct {
  private readonly props: AmazonConnectConstructProps;
  readonly connectInstance: connect.CfnInstance;

  constructor(scope: Construct, id: string, props: AmazonConnectConstructProps) {
    super(scope, id);

    this.props = props;

    this.connectInstance = new connect.CfnInstance(this, id, {
      attributes: {
        inboundCalls: this.props.inboundCalls,
        outboundCalls: this.props.outboundCalls,
        contactflowLogs: this.props.contactflowLogs,
        autoResolveBestVoices: this.props.autoResolveBestVoices,
      },
      identityManagementType: this.props.identityManagementType,
      instanceAlias: this.props.connectInstanceAlias,
      directoryId: this.props.directoryId,
    });

    if (this.props.dataStorageBucket !== undefined) {
      this.props.dataStorageBucket.grantWrite(new iam.ServicePrincipal('connect.amazonaws.com'));

      this.createInstanceStorageConfig();
    }

    this.createBusinessHours();
  }

  createInstanceStorageConfig() {
    if (this.props.dataStorageBucket === undefined) return;

    const encriptionKey = kms.Key.fromLookup(this, 'EncryptKeyLookup', {
      aliasName: 'alias/aws/connect',
    });

    new connect.CfnInstanceStorageConfig(this, 'CallRecordingsStorageConfig', {
      instanceArn: this.connectInstance.attrArn,
      resourceType: 'CALL_RECORDINGS',
      storageType: 'S3',
      s3Config: {
        bucketName: this.props.dataStorageBucket.bucketName,
        bucketPrefix: 'CallRecordings',
        encryptionConfig: {
          encryptionType: 'KMS',
          keyId: encriptionKey.keyArn,
        },
      },
    });

    new connect.CfnInstanceStorageConfig(this, 'ChatTranscriptsStorageConfig', {
      instanceArn: this.connectInstance.attrArn,
      resourceType: 'CHAT_TRANSCRIPTS',
      storageType: 'S3',
      s3Config: {
        bucketName: this.props.dataStorageBucket.bucketName,
        bucketPrefix: 'ChatTranscripts',
        encryptionConfig: {
          encryptionType: 'KMS',
          keyId: encriptionKey.keyArn,
        },
      },
    });
  }

  createBusinessHours(): connect.CfnHoursOfOperation {
    const data = readFileSync(path.join(__dirname, '..', 'config', 'business_hours.json'), { encoding: 'utf8' });
    const config = JSON.parse(data) as connect.CfnHoursOfOperation.HoursOfOperationConfigProperty[];

    return new connect.CfnHoursOfOperation(this, 'HoursOfOperation', {
      instanceArn: this.connectInstance.attrArn,
      name: 'Business Hour',
      config,
      timeZone: this.props.businessHoursTimeZone,
    });
  }
}
