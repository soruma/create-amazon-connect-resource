import { Construct } from 'constructs';
import { readFile, readFileSync } from 'fs';
import * as path  from 'path';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as connect from 'aws-cdk-lib/aws-connect';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';

interface AmazonConnectConstructProps {
  /**
   * Amazon Connect instance alias
   */
  connectInstanceAlias: string;

  /**
   * Amazon connect data storage
   */
  dataStorageBucket: s3.Bucket | undefined;

  /**
   * Whether to create business hours
   */
  createBusinessHours: boolean;

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
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
      },
      identityManagementType: 'CONNECT_MANAGED',
      instanceAlias: this.props.connectInstanceAlias,
    });

    if (this.props.dataStorageBucket !== undefined) {
      this.props.dataStorageBucket.grantWrite(new iam.ServicePrincipal('connect.amazonaws.com'));

      this.createInstanceStorageConfig();
    }

    if (this.props.createBusinessHours) {
      this.createBusinessHours();
    }
  }

  createInstanceStorageConfig() {
    if (this.props.dataStorageBucket === undefined) return

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
          keyId: encriptionKey.keyArn
        }
      }
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
          keyId: encriptionKey.keyArn
        }
      }
    });
  }

  createBusinessHours() {
    const data = readFileSync(path.join(__dirname, '..', 'config', 'business_hours.json'), { encoding: 'utf8' });
    const config = JSON.parse(data) as connect.CfnHoursOfOperation.HoursOfOperationConfigProperty[];

    new connect.CfnHoursOfOperation(this, 'HoursOfOperation', {
      instanceArn: this.connectInstance.attrArn,
      name: 'Business Hour',
      config,
      timeZone: this.props.businessHoursTimeZone
    });
  }
}
