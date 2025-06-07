import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { test as baseTest, describe, expect, it } from 'vitest';

import { AmazonConnectStack } from '../lib/amazon-connect-stack';

const test = baseTest.extend<{
  app: cdk.App;
}>({
  // biome-ignore lint: lint/correctness/noEmptyPattern
  app: ({}, use) => use(new cdk.App()),
});

describe('AmazonConnectStack', () => {
  describe('Matches the snapshot', () => {
    test('Create data storage', ({ app }) => {
      const stack = new AmazonConnectStack(app, 'AmazonConnectStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        attributes: {
          inboundCalls: true,
          outboundCalls: true,
          contactflowLogs: true,
          autoResolveBestVoices: true,
        },
        identityManagementType: 'CONNECT_MANAGED',
        createDataStorageBucket: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    it('Not create data storage', () => {
      const app = new cdk.App();

      const stack = new AmazonConnectStack(app, 'AmazonConnectStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        attributes: {
          inboundCalls: true,
          outboundCalls: true,
          contactflowLogs: true,
          autoResolveBestVoices: true,
        },
        identityManagementType: 'CONNECT_MANAGED',
        createDataStorageBucket: false,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    it('Identity management is Directory service', () => {
      const app = new cdk.App();

      const stack = new AmazonConnectStack(app, 'AmazonConnectStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        attributes: {
          inboundCalls: true,
          outboundCalls: true,
          contactflowLogs: true,
          autoResolveBestVoices: true,
        },
        identityManagementType: 'EXISTING_DIRECTORY',
        directoryId: 'd-0000000000',
        createDataStorageBucket: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });
  });
});
