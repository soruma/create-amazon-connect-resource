import { Construct } from 'constructs';

export const getBooleanContext = (app: Construct, key: string, options?: { default: boolean }): boolean => {
  const context = app.node.tryGetContext(key);
  if (context) {
    return context;
  }

  if (!options) {
    throw new Error(`The ${key} is required`);
  }

  return options.default;
};
