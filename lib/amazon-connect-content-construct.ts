import * as cdk from 'aws-cdk-lib';

import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { AmazonConnectContentHierarchyGroupStack } from './amazon-connect-content-hierarchy-group-stack';

interface AmazonConnectContentConstructProps {
  connectInstanceArn: string;
  createHierarchy: boolean;
}

export class AmazonConnectContentConstruct extends Construct {
  private props: AmazonConnectContentConstructProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentConstructProps) {
    super(scope, id);

    this.props = props;

    if (this.props.createHierarchy) {
      this.createHierarchy(this.props.connectInstanceArn);
    }
  }

  createHierarchy(connectInstanceArn: string) {
    new connect.CfnUserHierarchyStructure(this, 'DepartmentUserHierarchyStructure', {
      instanceArn: connectInstanceArn,
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
