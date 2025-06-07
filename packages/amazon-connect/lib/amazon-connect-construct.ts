import * as connect from 'aws-cdk-lib/aws-connect';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export type IdentityManagementType = 'SAML' | 'CONNECT_MANAGED' | 'EXISTING_DIRECTORY';

interface AmazonConnectConstructProps {
  /**
   * Amazon Connect instance alias
   */
  connectInstanceAlias: string;

  /**
   * This is a preview release for Amazon Connect.
   */
  attributes: connect.CfnInstance.AttributesProperty;

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
}

export class AmazonConnectConstruct extends Construct {
  private readonly props: AmazonConnectConstructProps;
  readonly connectInstance: connect.CfnInstance;

  constructor(scope: Construct, id: string, props: AmazonConnectConstructProps) {
    super(scope, id);

    this.props = props;

    this.connectInstance = new connect.CfnInstance(this, id, {
      attributes: this.props.attributes,
      identityManagementType: this.props.identityManagementType,
      instanceAlias: this.props.connectInstanceAlias,
      directoryId: this.props.directoryId,
    });

    if (this.props.dataStorageBucket !== undefined) {
      this.props.dataStorageBucket.grantWrite(new iam.ServicePrincipal('connect.amazonaws.com'));

      this.createInstanceStorageConfig();
    }
  }

  /**
   * Retrieves the storage configuration for call recordings and chat transcripts.
   */
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
}
