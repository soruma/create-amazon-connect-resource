import * as cdk from 'aws-cdk-lib';
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
      inboundCalls: this.props.inboundCalls,
      outboundCalls: this.props.outboundCalls,
      contactflowLogs: this.props.contactflowLogs,
      autoResolveBestVoices: this.props.autoResolveBestVoices,
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
