import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { test as baseTest, describe, expect, it } from 'vitest';

import { AmazonConnectContentStack } from '../lib/amazon-connect-content-stack';
import { AmazonConnectHierarchyGroupStack } from '../lib/amazon-connect-hierarchy-group-stack';

const test = baseTest.extend<{
  app: cdk.App;
}>({
  // biome-ignore lint: lint/correctness/noEmptyPattern
  app: ({}, use) => use(new cdk.App()),
});

describe('AmazonConnectContentStack', () => {
  describe('Matches the snapshot', () => {
    test('Create hierarchy', ({ app }) => {
      const stack = new AmazonConnectContentStack(app, 'AmazonConnectContentStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceArn: 'arn:aws:connect:us-east-1:000000000000:instance/00000000-0000-0000-0000-000000000000',
        createHierarchy: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();

      const hierarchyGroupStackNodes = stack.node.children.filter(
        (child) => child instanceof AmazonConnectHierarchyGroupStack,
      );

      for (const child of hierarchyGroupStackNodes) {
        expect(Template.fromStack(child as AmazonConnectHierarchyGroupStack).toJSON()).toMatchSnapshot();
      }
    });

    test('Not create hierarchy', () => {
      const app = new cdk.App();

      const stack = new AmazonConnectContentStack(app, 'AmazonConnectContentStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceArn: 'arn:aws:connect:us-east-1:000000000000:instance/00000000-0000-0000-0000-000000000000',
        createHierarchy: false,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });
  });
});
