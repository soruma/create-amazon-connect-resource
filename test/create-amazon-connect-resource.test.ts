import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CreateAmazonConnectResourceStack } from '../lib/create-amazon-connect-resource-stack';

describe('CreateAmazonConnectResourceStack', () => {
  describe('Matches the snapshot', () => {
    test('Create data storage and hierarchy', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
        identityManagementType: 'CONNECT_MANAGED',
        createDataStorageBucket: true,
        businessHoursTimeZone: 'UTC',
        createHierarchy: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    test('Create data storage, not create hierarchy', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
        identityManagementType: 'CONNECT_MANAGED',
        createDataStorageBucket: true,
        businessHoursTimeZone: 'UTC',
        createHierarchy: false,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    test('Create hierarchy, not create data storage', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
        identityManagementType: 'CONNECT_MANAGED',
        createDataStorageBucket: false,
        businessHoursTimeZone: 'UTC',
        createHierarchy: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    test('Not create data storage and hierarchy', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
        identityManagementType: 'CONNECT_MANAGED',
        createDataStorageBucket: false,
        businessHoursTimeZone: 'UTC',
        createHierarchy: false,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });
  });

  test('Identity management is Directory service', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
        identityManagementType: 'EXISTING_DIRECTORY',
        directoryId: 'd-0000000000',
        createDataStorageBucket: true,
        businessHoursTimeZone: 'UTC',
        createHierarchy: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
  });
});
