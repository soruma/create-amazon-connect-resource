#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { stringToBooleanStrict } from '@parsekit/string-to-boolean';
import { CreateAmazonConnectResourceStack } from '../lib/create-amazon-connect-resource-stack';

const app = new cdk.App();

const connectInstanceAlias = app.node.tryGetContext('connectInstanceAlias');
const isCreateHierarchyStr = app.node.tryGetContext('isCreateHierarchy');
const isCreateHierarchy = isCreateHierarchyStr ? stringToBooleanStrict(isCreateHierarchyStr) : false;

new CreateAmazonConnectResourceStack(app, `AmazonConnectResourceStack-${connectInstanceAlias}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  connectInstanceAlias,
  isCreateHierarchy
});
