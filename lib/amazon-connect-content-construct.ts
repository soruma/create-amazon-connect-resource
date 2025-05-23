import * as cdk from 'aws-cdk-lib';

import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';

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
    })

    const salesDepartment = new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentContactUserHierarchyGroup', {
      instanceArn: connectInstanceArn,
      name: 'Sales department',
    });

    new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentTeam1ContactUserHierarchyGroup', {
      instanceArn: connectInstanceArn,
      name: 'Team 1',
      parentGroupArn: salesDepartment.attrUserHierarchyGroupArn
    });

    new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentTeam2ContactUserHierarchyGroup', {
      instanceArn: connectInstanceArn,
      name: 'Team 2',
      parentGroupArn: salesDepartment.attrUserHierarchyGroupArn
    });

    const supportDepartment = new connect.CfnUserHierarchyGroup(this, 'SupportDepartmentContactUserHierarchyGroup', {
      instanceArn: connectInstanceArn,
      name: 'Support department',
    });

    new connect.CfnUserHierarchyGroup(this, 'SupportDepartmentTeam1ContactUserHierarchyGroup', {
      instanceArn: connectInstanceArn,
      name: 'Team 1',
      parentGroupArn: supportDepartment.attrUserHierarchyGroupArn
    });
  }
}
