import * as cdk from 'aws-cdk-lib';

import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { AmazonConnectContentHierarchyGroupStack } from './amazon-connect-content-hierarchy-group-stack';

interface AmazonConnectContentConstructProps {
  /**
   * Amazon Connect instance ARN
   */
  connectInstanceArn: string;

  /**
   * Create sample Amazon Connect organization hierarchies
   */
  createHierarchy: boolean;
}

export class AmazonConnectContentConstruct extends Construct {
  private props: AmazonConnectContentConstructProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentConstructProps) {
    super(scope, id);

    this.props = props;

    if (this.props.createHierarchy) {
      this.createHierarchy();
    }
  }

  createHierarchy() {
    new connect.CfnUserHierarchyStructure(this, 'DepartmentUserHierarchyStructure', {
      instanceArn: this.props.connectInstanceArn,
      userHierarchyStructure: {
        levelOne: {
          name: 'Department',
        },
        levelTwo: {
          name: 'Team',
        }
      }
    });

    new AmazonConnectContentHierarchyGroupStack(this, 'AmazonConnectContentHierarchyGroupStack', {
      connectInstanceArn: this.props.connectInstanceArn,
    });
  }
}
