import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { Construct } from 'constructs';
import { AmazonConnectConstruct } from './amazon-connect-construct';
import { AmazonConnectContentConstruct } from './amazon-connect-content-construct';

interface CreateAmazonConnectResourceStackProps extends cdk.StackProps {
  connectInstanceAlias: string;
  isCreateHierarchy: boolean;
}

export class CreateAmazonConnectResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CreateAmazonConnectResourceStackProps) {
    super(scope, id, props);

    const dataStorageBucket = new s3.Bucket(this, 'DataStorageBucket', {
      bucketName: `connect-${props.connectInstanceAlias}`,
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    const amazonConnect = new AmazonConnectConstruct(this, 'AmazonConnectConstruct', {
      connectInstanceAlias: props.connectInstanceAlias,
      dataStorageBucket,
    });

    new AmazonConnectContentConstruct(this, 'AmazonConnectContentConstruct', {
      connectInstanceArn: amazonConnect.connectInstance.attrArn,
      isCreateHierarchy: props.isCreateHierarchy
    });
  }
}
