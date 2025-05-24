import * as cdk from 'aws-cdk-lib';

import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';

interface AmazonConnectContentHierarchyGroupProps {
  /**
   * Amazon Connect instance ARN
   */
  connectInstanceArn: string;
}

export class AmazonConnectContentHierarchyGroupStack extends cdk.NestedStack {
  private props: AmazonConnectContentHierarchyGroupProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentHierarchyGroupProps) {
    super(scope, id);

    this.props = props;

    const salesDepartment = new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentContactUserHierarchyGroup', {
      instanceArn: this.props.connectInstanceArn,
      name: 'Sales department',
    });

    new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentTeam1ContactUserHierarchyGroup', {
      instanceArn: this.props.connectInstanceArn,
      name: 'Team 1',
      parentGroupArn: salesDepartment.attrUserHierarchyGroupArn,
    });

    new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentTeam2ContactUserHierarchyGroup', {
      instanceArn: this.props.connectInstanceArn,
      name: 'Team 2',
      parentGroupArn: salesDepartment.attrUserHierarchyGroupArn,
    });

    const supportDepartment = new connect.CfnUserHierarchyGroup(this, 'SupportDepartmentContactUserHierarchyGroup', {
      instanceArn: this.props.connectInstanceArn,
      name: 'Support department',
    });

    new connect.CfnUserHierarchyGroup(this, 'SupportDepartmentTeam1ContactUserHierarchyGroup', {
      instanceArn: this.props.connectInstanceArn,
      name: 'Team 1',
      parentGroupArn: supportDepartment.attrUserHierarchyGroupArn,
    });
  }
}
