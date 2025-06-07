import { Construct } from 'constructs';

/**
 * Retrieves a string-based context variable from the CDK application.
 * @param app The CDK construct used to retrieve the context variable.
 * @param key The context variable name to retrieve.
 * @param options An optional object containing a default value to return if the context variable is not found.
 * @returns The context variable value or the default value if not found.
 */
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
