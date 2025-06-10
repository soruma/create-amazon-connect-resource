import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { CfnHoursOfOperation } from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { parse as JSONCParse } from 'jsonc-parser';

/**
 * Configuration for hours of operation
 */
export interface HoursOfOperationConfig {
  /**
   * Hours of operation id
   */
  readonly id: string;

  /**
   * Hours of operation name
   */
  readonly name: string;

  /**
   * Hours of operation description
   */
  readonly description: string;

  /**
   * Hours of operation timezone
   */
  readonly timeZone: string;

  /**
   * Hours of operation configuration
   */
  readonly config: CfnHoursOfOperation.HoursOfOperationConfigProperty[];

  /**
   * Amazon Connect hours of operation ARN
   */
  hoursOfOperationArn: string;
}

/**
 * Creates hours of operation resources based on the provided configuration
 * @param {Construct} scope - The CDK Construct scope
 * @param {string} connectInstanceArn - The Amazon Connect instance ARN
 * @returns {HoursOfOperationConfig[]} An array of hours of operation configurations
 */
export const createHoursOfOperation = (scope: Construct, connectInstanceArn: string): HoursOfOperationConfig[] => {
  const data = readFileSync(path.join(__dirname, '..', 'config', 'hours-of-operations.jsonc'), { encoding: 'utf8' });
  const configs = JSONCParse(data) as HoursOfOperationConfig[];

  for (const config of configs) {
    const hoursOfOperation = new CfnHoursOfOperation(scope, `HoursOfOperation${config.id}`, {
      instanceArn: connectInstanceArn,
      ...config,
    });
    config.hoursOfOperationArn = hoursOfOperation.attrHoursOfOperationArn;
  }

  return configs;
};
