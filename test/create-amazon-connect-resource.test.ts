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
        isCreateDataStorageBucket: true,
        isCreateHierarchy: true,
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
        isCreateDataStorageBucket: true,
        isCreateHierarchy: false,
      });

      const template = Template.fromStack(stack);
      expect(template.toJSON()).toMatchSnapshot();
    });
  });
});
