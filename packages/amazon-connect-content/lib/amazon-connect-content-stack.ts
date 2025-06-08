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
}

/**
 * Configuration for hours of operation
 */
interface HoursOfOperationConfig {
  /**
   * Hours of operation id
   */
  readonly id: string;

  /**
   * Hours of operation name
   */
  readonly name: string;

  /**
   * Hours of operation description
   */
  readonly description: string;

  /**
   * Hours of operation timezone
   */
  readonly timeZone: string;

  /**
   * Hours of operation configuration
   */
  readonly config: connect.CfnHoursOfOperation.HoursOfOperationConfigProperty[];
}

export class AmazonConnectContentStack extends cdk.Stack {
  private readonly props: AmazonConnectContentStackProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentStackProps) {
    super(scope, id, props);

    this.props = props;

    this.createHoursOfOperation();

    if (this.props.createHierarchy) {
      this.createHierarchy();
    }
  }

  /**
   * Creates hours of operation resources based on the provided configuration
   */
  createHoursOfOperation() {
    const data = readFileSync(path.join(__dirname, '..', 'config', 'hours-of-operations.jsonc'), { encoding: 'utf8' });
    const configs = JSONCParse(data) as HoursOfOperationConfig[];

    for (const config of configs) {
      new connect.CfnHoursOfOperation(this, `HoursOfOperation${config.id}`, {
        instanceArn: this.props.connectInstanceArn,
        ...config,
      });
    }
  }

  /**
   * Creates a hierarchy group in Amazon Connect.
   */
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
