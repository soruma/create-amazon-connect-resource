import { Construct } from 'constructs';

export const getStringContext = (app: Construct, key: string, options?: { default: string }): string => {
  const context = app.node.tryGetContext(key);
  if (context) {
    return context;
  }

  if (!options) {
    throw new Error(`The ${key} is required`);
  }

  return options.default;
};
