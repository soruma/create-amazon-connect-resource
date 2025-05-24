import { Construct } from 'constructs';
import { readFile, readFileSync } from 'fs';
import * as path  from 'path';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as connect from 'aws-cdk-lib/aws-connect';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';

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

    const businessHours = this.createBusinessHours();

    const queue = new connect.CfnQueue(this, 'Queue', {
      instanceArn: this.connectInstance.attrArn,
      name: 'Queue',
      hoursOfOperationArn: businessHours.attrHoursOfOperationArn
    });

    const securityProfile = new connect.CfnSecurityProfile(this, 'SecurityProfile', {
      instanceArn: this.connectInstance.attrArn,
      securityProfileName: 'Administrator',
      description: 'Administrator Group',
      permissions: [
        'RoutingPolicies.Create',
        'RoutingPolicies.Edit',
        'RoutingPolicies.View'
      ]
    })

    const routingProfile = new connect.CfnRoutingProfile(this, 'RoutingProfile', {
      instanceArn: this.connectInstance.attrArn,
      defaultOutboundQueueArn: queue.attrQueueArn,
      name: 'Test Ruting profile',
      description: 'test',
      mediaConcurrencies: [{
        channel: 'VOICE',
        concurrency: 1,
      },{
        channel: 'CHAT',
        concurrency: 2,
      }]
    });

    new connect.CfnUser(this, 'User1', {
      instanceArn: this.connectInstance.attrArn,
      username: 'User1',
      password: '122aJJJJ',
      identityInfo: {
        firstName: 'User',
        lastName: 'Hello',
      },
      phoneConfig: {
        phoneType: 'SOFT_PHONE',
        afterContactWorkTimeLimit: 10,
      },
      routingProfileArn: routingProfile.attrRoutingProfileArn, 
      securityProfileArns: [
        securityProfile.attrSecurityProfileArn
      ]
    });
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

  createBusinessHours(): connect.CfnHoursOfOperation {
    const data = readFileSync(path.join(__dirname, '..', 'config', 'business_hours.json'), { encoding: 'utf8' });
    const config = JSON.parse(data) as connect.CfnHoursOfOperation.HoursOfOperationConfigProperty[];

    return new connect.CfnHoursOfOperation(this, 'HoursOfOperation', {
      instanceArn: this.connectInstance.attrArn,
      name: 'Business Hour',
      config,
      timeZone: this.props.businessHoursTimeZone
    });
  }
}
