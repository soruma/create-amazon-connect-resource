#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { getBooleanContext, getStringContext } from 'get-cdk-context-parameter';
import { IdentityManagementType } from '../lib/amazon-connect-construct';
import { AmazonConnectStack } from '../lib/amazon-connect-stack';

const app = new cdk.App();

const connectInstanceAlias = getStringContext(app, 'connectInstanceAlias');
const createDataStorageBucket = getBooleanContext(app, 'createDataStorageBucket', { default: true });

const inboundCalls = getBooleanContext(app, 'inboundCalls', { default: true });
const outboundCalls = getBooleanContext(app, 'outboundCalls', { default: true });
const contactflowLogs = getBooleanContext(app, 'contactflowLogs', { default: true });
const autoResolveBestVoices = getBooleanContext(app, 'autoResolveBestVoices', { default: true });
const contactLens = getBooleanContext(app, 'contactLens', { default: true });
const earlyMedia = getBooleanContext(app, 'earlyMedia', { default: true });

const identityManagementType = getStringContext(app, 'identityManagementType', {
  default: 'CONNECT_MANAGED',
}) as IdentityManagementType;
const directoryId = app.node.tryGetContext('directoryId');

if (connectInstanceAlias === undefined) {
  throw new Error('Please argument a context for "connectInstanceAlias"');
}

new AmazonConnectStack(app, `AmazonConnectStack-${connectInstanceAlias}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  connectInstanceAlias,
  attributes: {
    inboundCalls,
    outboundCalls,
    contactflowLogs,
    autoResolveBestVoices,
    contactLens,
    earlyMedia,
  },
  identityManagementType,
  directoryId,
  createDataStorageBucket,
});
