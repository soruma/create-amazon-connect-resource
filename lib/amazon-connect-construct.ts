import { Construct } from 'constructs';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as connect from 'aws-cdk-lib/aws-connect';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';

interface AmazonConnectConstructProps {
  connectInstanceAlias: string;
  recordingBucket: s3.Bucket;
}

export class AmazonConnectConstruct extends Construct {
  constructor(scope: Construct, id: string, props: AmazonConnectConstructProps) {
    super(scope, id);

    const encriptionKey = kms.Key.fromLookup(this, 'EncryptKeyLookup', {
      aliasName: 'alias/aws/connect',
    });

    const connectInstance = new connect.CfnInstance(this, id, {
      attributes: {
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
      },
      identityManagementType: 'CONNECT_MANAGED',
      instanceAlias: props.connectInstanceAlias,
    });
    props.recordingBucket.grantWrite(new iam.ServicePrincipal('connect.amazonaws.com'));

    new connect.CfnInstanceStorageConfig(this, 'CallRecordingsStorageConfig', {
      instanceArn: connectInstance.attrArn,
      resourceType: 'CALL_RECORDINGS',
      storageType: 'S3',
      s3Config: {
        bucketName: props.recordingBucket.bucketName,
        bucketPrefix: 'CallRecordings',
        encryptionConfig: {
          encryptionType: 'KMS',
          keyId: encriptionKey.keyArn
        }
      }
    });
  
    new connect.CfnInstanceStorageConfig(this, 'ChatTranscriptsStorageConfig', {
      instanceArn: connectInstance.attrArn,
      resourceType: 'CHAT_TRANSCRIPTS',
      storageType: 'S3',
      s3Config: {
        bucketName: props.recordingBucket.bucketName,
        bucketPrefix: 'ChatTranscripts',
        encryptionConfig: {
          encryptionType: 'KMS',
          keyId: encriptionKey.keyArn
        }
      }
    });
  }
}
