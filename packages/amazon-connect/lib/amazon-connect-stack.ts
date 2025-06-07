import * as cdk from 'aws-cdk-lib';
import * as connect from 'aws-cdk-lib/aws-connect';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { AmazonConnectConstruct, IdentityManagementType } from './amazon-connect-construct';

interface AmazonConnectStackProps extends cdk.StackProps {
  /**
   * Amazon Connect instance alias
   */
  connectInstanceAlias: string;

  /**
   * Whether to store call and chat records in storage
   */
  createDataStorageBucket: boolean;

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
}

export class AmazonConnectStack extends cdk.Stack {
  private props: AmazonConnectStackProps;

  constructor(scope: Construct, id: string, props: AmazonConnectStackProps) {
    super(scope, id, props);

    this.props = props;

    let dataStorageBucket: s3.Bucket | undefined;

    if (this.props.createDataStorageBucket) {
      dataStorageBucket = new s3.Bucket(this, 'DataStorageBucket', {
        bucketName: `amazon-connect-${this.props.connectInstanceAlias}`,
        encryption: s3.BucketEncryption.S3_MANAGED,
      });
    }

    const amazonConnect = new AmazonConnectConstruct(this, 'AmazonConnectConstruct', {
      connectInstanceAlias: this.props.connectInstanceAlias,
      attributes: this.props.attributes,
      identityManagementType: this.props.identityManagementType,
      directoryId: this.props.directoryId,
      dataStorageBucket,
    });

    new cdk.CfnOutput(this, 'AmazonConnectInstanceArn', {
      exportName: `AmazonConnectInstanceArn-${this.props.connectInstanceAlias}`,
      value: amazonConnect.connectInstance.attrArn,
    });
  }
}
