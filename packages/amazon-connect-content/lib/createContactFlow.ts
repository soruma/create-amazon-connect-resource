import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { CfnContactFlow, CfnContactFlowModule } from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';
import { parse as JSONCParse } from 'jsonc-parser';

/**
 * Configuration for contact flow
 */
export interface ContactFlowConfig {
  /**
   * Contact flow id
   */
  readonly id: string;

  readonly file: string;
}

/**
 * Configuration for contact flows
 */
export interface ContactFlowsConfig {
  /**
   * Configuration for module contact flows
   */
  readonly modules: ContactFlowConfig[];

  /**
   * Configuration for contact flows
   */
  readonly contactFlows: ContactFlowConfig[];
}

/**
 * Creates contact flow configurations based on the provided configuration
 * @param {Construct} scope - The CDK Construct scope
 * @param {string} connectInstanceArn - The Amazon Connect instance ARN
 * @returns {ContactFlowsConfig} - The parsed contact flow configuration
 */
export const createContactFlow = (scope: Construct, connectInstanceArn: string): ContactFlowsConfig => {
  const data = readFileSync(path.join(__dirname, '..', 'config', 'contact-flows.jsonc'), { encoding: 'utf8' });
  const config = JSONCParse(data) as ContactFlowsConfig;

  // Add modules
  for (const module of config.modules) {
    const contactFlow = readFileSync(path.join(__dirname, '..', 'config', 'modules', module.file), {
      encoding: 'utf8',
    });
    new CfnContactFlowModule(scope, `ContactFlowModule${module.id}`, {
      instanceArn: connectInstanceArn,
      name: contactFlow.Metadata.name,
      description: contactFlow.Metadata.description,
      content: contactFlow,
    });
  }

  // Add contact flow
  for (const contactFlows of config.contactFlows) {
    const contactFlow = readFileSync(path.join(__dirname, '..', 'config', 'modules', contactFlows.file), {
      encoding: 'utf8',
    });
    new CfnContactFlow(scope, `ContactFlowModule${contactFlows.id}`, {
      instanceArn: connectInstanceArn,
      name: contactFlow.Metadata.name,
      description: contactFlow.Metadata.description,
      type: contactFlow.Metadata.type,
      content: contactFlow,
    });
  }

  return config;
};
