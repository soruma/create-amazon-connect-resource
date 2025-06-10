import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { CfnContactFlowModule, CfnQueue } from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { parse as JSONCParse } from 'jsonc-parser';

import { HoursOfOperationConfig } from './createHoursOfOperation';

/**
 * Configuration for hours of operation
 */
export interface ContactFlowConfig {
  /**
   * Contact flow id
   */
  readonly id: string;

  readonly file: string;
}

/**
 * Creates contact flow configurations based on the provided configuration
 * @param {Construct} scope - The CDK Construct scope
 * @param {string} connectInstanceArn - The Amazon Connect instance ARN
 * @returns {ContactFlowConfig[]} An array of contact flow configurations
 */
export const createContactFlow = (
  scope: Construct,
  connectInstanceArn: string,
): ContactFlowConfig[] => {
  const data = readFileSync(path.join(__dirname, '..', 'config', 'contact-flows.jsonc'), { encoding: 'utf8' });
  const configs = JSONCParse(data) as ContactFlowConfig[];

  for (const config of configs) {
    if (config)

    const queue = new CfnContactFlowModule(scope, `Queue${config.id}`, {
      instanceArn: connectInstanceArn,
      ...config
    });
  }

  return configs;
};
