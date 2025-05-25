import * as cdk from 'aws-cdk-lib';
import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';

interface AmazonConnectContentStackProps extends cdk.StackProps {
  /**
   * Amazon Connect instance ARN
   */
  connectInstanceARN: string;
}

export class AmazonConnectContentStack extends cdk.Stack {
  private readonly props: AmazonConnectContentStackProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentStackProps) {
    super(scope, id, props);

    this.props = props;
  }
}
