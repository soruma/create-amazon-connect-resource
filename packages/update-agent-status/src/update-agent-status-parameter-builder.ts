import { ConnectClient, ListInstancesCommand } from '@aws-sdk/client-connect';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { fromEnv, fromIni } from '@aws-sdk/credential-providers';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';

/**
 * Defines the structure for storing agent status update parameters.
 */
export interface UpdateAgentStatusParameter {
  instanceId: string;
  routableName: string;
  routableDescription: string;
  offlineName: string;
  offlineDescription: string;
  credentials: AwsCredentialIdentityProvider;
}

/**
 * Constructs and validates parameters for updating agent statuses in AWS Connect.
 * Defines the structure for storing agent status update parameters.
 * Validates and constructs the UpdateAgentStatusParameter object.
 */
export class UpdateAgentStatusParameterBuilder {
  private options: { [k: string]: string };
  private credentials: AwsCredentialIdentityProvider;

  /**
   * Initializes the builder with the provided options.
   * @param options A dictionary containing key-value pairs for configuring the agent status update parameters.
   */
  constructor(options: { [k: string]: string }) {
    this.options = options;
  }

  /**
   * Builds and validates the parameters required for updating agent statuses in AWS Connect.
   * @returns An UpdateAgentStatusParameter object containing validated instance and status information.
   */
  async build(): Promise<UpdateAgentStatusParameter> {
    this.credentials = await this.getCredentials();
    const [validInstance, instanceId] = await this.validationConnectInstance();
    if (!validInstance) {
      throw new Error('Invalid Connect instance.');
    }
    const [validStatus, routableName, routableDescription, offlineName, offlineDescription] = this.validationStatus();
    if (!validStatus) {
      throw new Error('Invalid status.');
    }

    return {
      instanceId,
      routableName,
      routableDescription,
      offlineName,
      offlineDescription,
      credentials: this.credentials,
    };
  }

  /**
   * Validates the Connect instance ID or searches for it using the instance alias.
   * This function ensures that a valid Connect instance ID is provided or retrieved.
   * It validates the provided instanceAlias or instanceId and retrieves the Connect instance ID if necessary.
   * @returns A tuple where the first element is a boolean indicating success, and the second element is the Connect instance ID or undefined if not found.
   */
  private async validationConnectInstance(): Promise<[boolean, string | undefined]> {
    if (this.options.instanceAlias === undefined && this.options.instanceId === undefined) {
      console.error('Either instanceAlias or instanceId is required.');
      return [false, undefined];
    }
    if (this.options.instanceId !== undefined) {
      return [true, this.options.instanceId];
    }

    const connectInstanceId = await this.searchConnectInstanceId();
    if (connectInstanceId) {
      return [true, connectInstanceId];
    }
    return [false, undefined];
  }

  /**
   * Retrieves AWS credentials for authenticating API requests.
   * @returns A promise that resolves to an AwsCredentialIdentityProvider containing the AWS credentials.
   */
  private async getCredentials(): Promise<AwsCredentialIdentityProvider> {
    try {
      const credentials = fromEnv();

      // Check credentials
      const client = new STSClient({ credentials });
      await client.send(new GetCallerIdentityCommand());

      return credentials;
    } catch {
      return fromIni({ profile: this.options.profile });
    }
  }

  /**
   * Validates the Connect instance ID or searches for it using the instance alias.
   * @returns The ID of the Connect instance if found, otherwise undefined.
   */
  private async searchConnectInstanceId(): Promise<string | undefined> {
    const client = new ConnectClient({ credentials: this.credentials });
    const output = await client.send(new ListInstancesCommand());

    const instanceSummaryList = (() => {
      if (output.InstanceSummaryList) {
        return output.InstanceSummaryList;
      }
      throw new Error('Amazon Connect instance is notiong.');
    })();
    for (const instanceSummary of instanceSummaryList) {
      if (instanceSummary.InstanceAlias === this.options.instanceAlias) {
        return instanceSummary.Id;
      }
    }

    return undefined;
  }

  /**
   * Validates the status names and descriptions.
   */
  private validationStatus(): [
    boolean,
    string | undefined,
    string | undefined,
    string | undefined,
    string | undefined,
  ] {
    if (this.options.routableName === undefined && this.options.offlineName === undefined) {
      console.error('Either routable-name or offline-name is required.');
      return [false, undefined, undefined, undefined, undefined];
    }
    if (this.options.routableName === this.options.offlineName) {
      console.error('routable-name and offline-name must be different names.');
      return [false, undefined, undefined, undefined, undefined];
    }
    const [routableName, routableDescription] = this.options.routableName
      ? [this.options.routableName, this.options.routableDescription]
      : [undefined, undefined];

    const [offlineName, offlineDescription] = this.options.offlineName
      ? [this.options.offlineName, this.options.offlineDescription]
      : [undefined, undefined];

    return [true, routableName, routableDescription, offlineName, offlineDescription];
  }
}
