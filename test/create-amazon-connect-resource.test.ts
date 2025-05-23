import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CreateAmazonConnectResourceStack } from '../lib/create-amazon-connect-resource-stack';

describe('CreateAmazonConnectResourceStack', () => {
  describe('Matches the snapshot', () => {
    test('Create data storage and business hour, hierarchy', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        createDataStorageBucket: true,
        createBusinessHours: true,
        businessHoursTimeZone: 'UTC',
        createHierarchy: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    test('Create data storage and business hour, not create hierarchy', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        createDataStorageBucket: true,
        createBusinessHours: true,
        businessHoursTimeZone: 'UTC',
        createHierarchy: false,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    test('Create business hour and hierarchy, not create data storage', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        createDataStorageBucket: false,
        createBusinessHours: true,
        businessHoursTimeZone: 'UTC',
        createHierarchy: true,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });

    test('Not create data storage and hierarchy, business hour', () => {
      const app = new cdk.App();

      const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
        env: {
          account: '000000000000',
          region: 'us-east-1',
        },
        connectInstanceAlias: 'test',
        createDataStorageBucket: false,
        createBusinessHours: false,
        businessHoursTimeZone: 'UTC',
        createHierarchy: false,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });
  });
});
