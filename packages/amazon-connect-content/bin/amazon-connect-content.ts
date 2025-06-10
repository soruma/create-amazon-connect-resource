#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getBooleanContext, getStringContext } from 'get-cdk-context-parameter';
import { AmazonConnectContentStack } from '../lib/amazon-connect-content-stack';

const app = new cdk.App();

const connectInstanceAlias = getStringContext(app, 'connectInstanceAlias');
const createHierarchy = getBooleanContext(app, 'createHierarchy', { default: false });

if (connectInstanceAlias === undefined) {
  throw new Error('Please argument a context for "connectInstanceAlias"');
}

const connectInstanceArn = cdk.Fn.importValue(`AmazonConnectInstanceArn-${connectInstanceAlias}`);

new AmazonConnectContentStack(app, 'AmazonConnectContentStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  connectInstanceArn,
  createHierarchy,
});
