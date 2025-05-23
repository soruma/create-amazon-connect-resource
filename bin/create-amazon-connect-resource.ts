#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CreateAmazonConnectResourceStack } from '../lib/create-amazon-connect-resource-stack';
import { getBooleanContext, getStringContext } from './utils';
import { IdentityManagementType } from '../lib/amazon-connect-construct';

const app = new cdk.App();

const connectInstanceAlias = getStringContext(app, 'connectInstanceAlias');
const createDataStorageBucket = getBooleanContext(app, 'createDataStorageBucket', { default: true });
const createBusinessHours = getBooleanContext(app, 'createBusinessHours', { default: false });
const businessHoursTimeZone = getStringContext(app, 'businessHoursTimeZone', { default: 'UTC' });
const createHierarchy = getBooleanContext(app, 'createHierarchy', { default: false });

const inboundCalls = getBooleanContext(app, 'inboundCalls', { default: true });
const outboundCalls = getBooleanContext(app, 'outboundCalls', { default: true });
const contactflowLogs = getBooleanContext(app, 'contactflowLogs', { default: true });
const autoResolveBestVoices = getBooleanContext(app, 'autoResolveBestVoices', { default: true });
const identityManagementType = getStringContext(app, 'identityManagementType', { default: 'CONNECT_MANAGED' }) as IdentityManagementType;

if (connectInstanceAlias === undefined) {
  throw new Error('Please argument a context for "connectInstanceAlias"');
}

new CreateAmazonConnectResourceStack(app, `AmazonConnectResourceStack-${connectInstanceAlias}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  connectInstanceAlias,
  inboundCalls,
  outboundCalls,
  contactflowLogs,
  autoResolveBestVoices,
  identityManagementType,
  createDataStorageBucket,
  createBusinessHours,
  businessHoursTimeZone,
  createHierarchy,
});
