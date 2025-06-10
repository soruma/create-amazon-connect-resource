import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { CfnQueue } from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { parse as JSONCParse } from 'jsonc-parser';

import { HoursOfOperationConfig } from './createHoursOfOperation';

/**
 * Configuration for hours of operation
 */
export interface QueueConfig {
  /**
   * Queue id
   */
  readonly id: string;

  /**
   * Queue name
   */
  readonly name: string;

  /**
   * Queue description
   */
  readonly description: string;

  /**
   * Hours of operation ID
   */
  readonly hoursOfOperationId: string;

  /**
   * Queue ARN
   */
  queueArn: string;
}

/**
 * Creates queue configurations based on the provided configuration
 * @param {Construct} scope - The CDK Construct scope
 * @param {string} connectInstanceArn - The Amazon Connect instance ARN
 * @param {HoursOfOperationConfig[]} hoursOfOperationConfigs - The configuration for hours of operation
 * @returns {QueueConfig[]} An array of queue configurations
 */
export const createQueue = (
  scope: Construct,
  connectInstanceArn: string,
  hoursOfOperationConfigs: HoursOfOperationConfig[],
): QueueConfig[] => {
  const data = readFileSync(path.join(__dirname, '..', 'config', 'queues.jsonc'), { encoding: 'utf8' });
  const configs = JSONCParse(data) as QueueConfig[];

  for (const config of configs) {
    const hoursOfOperationConfig = hoursOfOperationConfigs.find((hoursOfOperation) => {
      return hoursOfOperation.id === config.hoursOfOperationId;
    });

    if (!hoursOfOperationConfig) {
      break;
    }
    const queue = new CfnQueue(scope, `Queue${config.id}`, {
      instanceArn: connectInstanceArn,
      hoursOfOperationArn: hoursOfOperationConfig.hoursOfOperationArn,
      ...config
    });
    config.queueArn = queue.attrQueueArn;
  }

  return configs;
};
