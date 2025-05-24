import * as cdk from 'aws-cdk-lib';

export const getBooleanContext = (app: cdk.App, key: string, options?: { default: boolean }): boolean => {
  const context = app.node.tryGetContext(key);
  if (context) {
    return context;
  }

  if (!options) {
    throw new Error(`The ${key} is required`);
  }

  return options.default;
}
