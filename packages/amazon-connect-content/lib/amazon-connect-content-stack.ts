import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { parse as JSONCParse } from 'jsonc-parser';

import { AmazonConnectHierarchyGroupStack } from './amazon-connect-hierarchy-group-stack';

interface AmazonConnectContentStackProps extends cdk.StackProps {
  /**
   * Amazon Connect instance ARN
   */
  connectInstanceArn: string;

  /**
   * Create sample Amazon Connect organization hierarchies
   */
  createHierarchy: boolean;

  /**
   * business hours time zone
   */
  businessHoursTimeZone: string;
}

export class AmazonConnectContentStack extends cdk.Stack {
  private readonly props: AmazonConnectContentStackProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentStackProps) {
    super(scope, id, props);

    this.props = props;

    this.createBusinessHours();

    if (this.props.createHierarchy) {
      this.createHierarchy();
    }
  }

  createBusinessHours(): connect.CfnHoursOfOperation {
    const data = readFileSync(path.join(__dirname, '..', 'config', 'business-hours.jsonc'), { encoding: 'utf8' });
    const config = JSONCParse(data) as connect.CfnHoursOfOperation.HoursOfOperationConfigProperty[];

    return new connect.CfnHoursOfOperation(this, 'HoursOfOperation', {
      instanceArn: this.props.connectInstanceArn,
      name: 'Business Hours',
      description: 'Standard business hours for operations',
      config,
      timeZone: this.props.businessHoursTimeZone,
    });
  }

  createHierarchy() {
    const data = readFileSync(path.join(__dirname, '..', 'config', 'hierarchy-structure.jsonc'), { encoding: 'utf8' });
    const userHierarchyStructure = JSONCParse(data) as connect.CfnUserHierarchyStructure.UserHierarchyStructureProperty;

    new connect.CfnUserHierarchyStructure(this, 'DepartmentUserHierarchyStructure', {
      instanceArn: this.props.connectInstanceArn,
      userHierarchyStructure,
    });

    new AmazonConnectHierarchyGroupStack(this, 'AmazonConnectHierarchyGroupStack', {
      connectInstanceArn: this.props.connectInstanceArn,
    });
  }
}
