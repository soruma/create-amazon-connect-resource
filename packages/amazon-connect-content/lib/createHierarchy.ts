import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { CfnUserHierarchyStructure } from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { parse as JSONCParse } from 'jsonc-parser';

import { AmazonConnectHierarchyGroupStack } from './amazon-connect-hierarchy-group-stack';

/**
 * Creates a hierarchy group in Amazon Connect.
 * @param {Construct} scope - The CDK Construct scope
 * @param {string} connectInstanceArn - The Amazon Connect instance ARN
 */
export const createHierarchy = (scope: Construct, connectInstanceArn: string) => {
  const data = readFileSync(path.join(__dirname, '..', 'config', 'hierarchy-structure.jsonc'), { encoding: 'utf8' });
  const userHierarchyStructure = JSONCParse(data) as CfnUserHierarchyStructure.UserHierarchyStructureProperty;

  new CfnUserHierarchyStructure(scope, 'DepartmentUserHierarchyStructure', {
    instanceArn: connectInstanceArn,
    userHierarchyStructure,
  });

  new AmazonConnectHierarchyGroupStack(scope, 'AmazonConnectHierarchyGroupStack', {
    connectInstanceArn: connectInstanceArn,
  });
};
