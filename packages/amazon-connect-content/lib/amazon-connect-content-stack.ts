import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { createHierarchy } from './createHierarchy';
import { createHoursOfOperation } from './createHoursOfOperation';
import { createQueue } from './createQueue';

interface AmazonConnectContentStackProps extends cdk.StackProps {
  /**
   * Amazon Connect instance ARN
   */
  connectInstanceArn: string;

  /**
   * Create sample Amazon Connect organization hierarchies
   */
  createHierarchy: boolean;
}

export class AmazonConnectContentStack extends cdk.Stack {
  private readonly props: AmazonConnectContentStackProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentStackProps) {
    super(scope, id, props);

    this.props = props;

    const hoursOfOperations = createHoursOfOperation(this, this.props.connectInstanceArn);
    createQueue(this, this.props.connectInstanceArn, hoursOfOperations);

    if (this.props.createHierarchy) {
      createHierarchy(this, this.props.connectInstanceArn);
    }
  }
}
