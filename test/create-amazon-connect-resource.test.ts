import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CreateAmazonConnectResourceStack } from '../lib/create-amazon-connect-resource-stack';

describe('CreateAmazonConnectResourceStack', () => {
  test("matches the snapshot", () => {
    const app = new cdk.App();

    const stack = new CreateAmazonConnectResourceStack(app, 'CreateAmazonConnectResourceStack-test', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
      connectInstanceAlias: 'test',
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
