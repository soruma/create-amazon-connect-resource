#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { stringToBooleanStrict } from '@parsekit/string-to-boolean';
import { CreateAmazonConnectResourceStack } from '../lib/create-amazon-connect-resource-stack';

const app = new cdk.App();

const connectInstanceAlias = app.node.tryGetContext('connectInstanceAlias');
const createDataStorageBucketStr = app.node.tryGetContext('createDataStorageBucket');
const createDataStorageBucket = createDataStorageBucketStr ? stringToBooleanStrict(createDataStorageBucketStr) : true;
const createHierarchyStr = app.node.tryGetContext('createHierarchy');
const createHierarchy = createHierarchyStr ? stringToBooleanStrict(createHierarchyStr) : false;

if (connectInstanceAlias === undefined) {
  throw new Error('Please argument a context for "connectInstanceAlias"');
}

new CreateAmazonConnectResourceStack(app, `AmazonConnectResourceStack-${connectInstanceAlias}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  connectInstanceAlias,
  createDataStorageBucket,
  createHierarchy,
});
