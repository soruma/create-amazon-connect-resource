import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { Construct } from 'constructs';
import { AmazonConnectConstruct } from './amazon-connect-construct';

interface CreateAmazonConnectResourceStackProps extends cdk.StackProps {
  connectInstanceAlias: string;
  isCreateHierarchy: boolean;
}

export class CreateAmazonConnectResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CreateAmazonConnectResourceStackProps) {
    super(scope, id, props);

    const recordingBucket = new s3.Bucket(this, 'RecordingBucket', {
      bucketName: props.connectInstanceAlias,
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    new AmazonConnectConstruct(this, 'AmazonConnectConstruct', {
      connectInstanceAlias: props.connectInstanceAlias,
      recordingBucket,
      isCreateHierarchy: props.isCreateHierarchy,
    });
  }
}
