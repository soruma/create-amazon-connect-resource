import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { Construct } from 'constructs';
import { AmazonConnectConstruct } from './amazon-connect-construct';
import { AmazonConnectContentConstruct } from './amazon-connect-content-construct';

interface CreateAmazonConnectResourceStackProps extends cdk.StackProps {
  connectInstanceAlias: string;
  createDataStorageBucket: boolean;
  createBusinessHours: boolean;
  createHierarchy: boolean;
  businessHoursTimeZone: string;
}

export class CreateAmazonConnectResourceStack extends cdk.Stack {
  private props: CreateAmazonConnectResourceStackProps;

  constructor(scope: Construct, id: string, props: CreateAmazonConnectResourceStackProps) {
    super(scope, id, props);

    this.props = props;

    let dataStorageBucket: s3.Bucket | undefined;
    
    if (this.props.createDataStorageBucket) {
      dataStorageBucket = new s3.Bucket(this, 'DataStorageBucket', {
        bucketName: `connect-${this.props.connectInstanceAlias}`,
        encryption: s3.BucketEncryption.S3_MANAGED
      });
    }

    const amazonConnect = new AmazonConnectConstruct(this, 'AmazonConnectConstruct', {
      connectInstanceAlias: this.props.connectInstanceAlias,
      dataStorageBucket,
      createBusinessHours: this.props.createBusinessHours,
      businessHoursTimeZone: this.props.businessHoursTimeZone
    });

    new AmazonConnectContentConstruct(this, 'AmazonConnectContentConstruct', {
      connectInstanceArn: amazonConnect.connectInstance.attrArn,
      createHierarchy: props.createHierarchy
    });
  }
}
