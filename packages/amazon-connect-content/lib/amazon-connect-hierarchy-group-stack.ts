import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { parse as JSONCParse } from 'jsonc-parser';

/**
 * Creates a hierarchy group in Amazon Connect.
 */
interface HierarchyGroup {
  name: string;
  children?: HierarchyGroup[];
}

/**
 * This stack creates user hierarchy groups for Amazon Connect.
 */
interface AmazonConnectHierarchyGroupProps {
  /**
   * Amazon Connect instance ARN
   */
  connectInstanceArn: string;
}

/**
 * Creates a hierarchy group in Amazon Connect.
 */
export class AmazonConnectHierarchyGroupStack extends cdk.NestedStack {
  private props: AmazonConnectHierarchyGroupProps;

  constructor(scope: Construct, id: string, props: AmazonConnectHierarchyGroupProps) {
    super(scope, id);

    this.props = props;

    const data = readFileSync(path.join(__dirname, '..', 'config', 'user-hierarchy-groups.jsonc'), {
      encoding: 'utf8',
    });
    const config = JSONCParse(data) as HierarchyGroup[];

    config.forEach((group, idx) => {
      this.createHierarchyGroup(group, undefined, `Root${idx}`);
    });
  }

  /**
   * Creates a hierarchy group in Amazon Connect.
   * @param group The hierarchy group to create.
   * @param parentGroupArn The ARN of the parent group, if any.
   * @param uniqueId The unique identifier for the hierarchy group.
   */
  private createHierarchyGroup(group: HierarchyGroup, parentGroupArn: string | undefined, uniqueId: string) {
    const groupId = `${uniqueId}_${group.name.replace(/\s+/g, '')}`;

    const hierarchyGroup = new connect.CfnUserHierarchyGroup(this, groupId, {
      instanceArn: this.props.connectInstanceArn,
      name: group.name,
      parentGroupArn: parentGroupArn,
    });

    if (group.children) {
      group.children.forEach((child, idx) => {
        this.createHierarchyGroup(child, hierarchyGroup.attrUserHierarchyGroupArn, `${groupId}_${idx}`);
      });
    }
  }
}
