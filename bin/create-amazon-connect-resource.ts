#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CreateAmazonConnectResourceStack } from '../lib/create-amazon-connect-resource-stack';

const app = new cdk.App();

const connectInstanceAlias = app.node.tryGetContext('connectInstanceAlias');

new CreateAmazonConnectResourceStack(app, `AmazonConnectResourceStack-${connectInstanceAlias}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  connectInstanceAlias,
});
