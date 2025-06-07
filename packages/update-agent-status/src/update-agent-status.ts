import {
  AgentStatusSummary,
  AgentStatusType,
  ConnectClient,
  ListAgentStatusesCommand,
  UpdateAgentStatusCommand,
} from '@aws-sdk/client-connect';

import { UpdateAgentStatusParameter } from './update-agent-status-parameter-builder';

/**
 * Update agent statuses in AWS Connect.
 */
export class UpdateAgentStatus {
  private parameter: UpdateAgentStatusParameter;
  private client: ConnectClient;

  /**
   * Initializes the UpdateAgentStatus class with the given parameters and sets up the ConnectClient instance.
   * @param parameter An instance of UpdateAgentStatusParameter containing configuration details.
   */
  constructor(parameter: UpdateAgentStatusParameter) {
    this.parameter = parameter;
    this.client = new ConnectClient({ credentials: parameter.credentials });
  }

  /**
   * Orchestrates the update process to modify agent statuses in AWS Connect.
   */
  async update(): Promise<void> {
    const output = await this.client.send(new ListAgentStatusesCommand({ InstanceId: this.parameter.instanceId }));

    const summaryList = output.AgentStatusSummaryList;
    if (!summaryList || summaryList.length === 0) {
      throw new Error(`No agent statuses found for instance "${this.parameter.instanceId}".`);
    }
    const routableId = this.getAgentStatusId(summaryList, AgentStatusType.ROUTABLE) ?? '';
    const offlineId = this.getAgentStatusId(summaryList, AgentStatusType.OFFLINE) ?? '';

    if (this.parameter.routableName) {
      if (!routableId) {
        throw new Error(`Routable status not found (type=${AgentStatusType.ROUTABLE}).`);
      }
      this.updateStatus(routableId, this.parameter.routableName, this.parameter.routableDescription);
    }
    if (this.parameter.offlineName) {
      if (!offlineId) {
        throw new Error(`Routable status not found (type=${AgentStatusType.OFFLINE}).`);
      }
      this.updateStatus(offlineId, this.parameter.offlineName, this.parameter.offlineDescription);
    }
  }

  /**
   * Helper function to retrieve the ID of a specific agent status based on its type.
   * @param list - The list of agent status summaries to search through.
   * @param type - The type of agent status to search for.
   * @returns The ID of the agent status if found, otherwise undefined.
   */
  private getAgentStatusId(list: AgentStatusSummary[], type: AgentStatusType): string | undefined {
    const summary = list.find((s) => s.Type === type);
    return summary?.Id;
  }

  /**
   * Updates the agent status with the provided name and description.
   * @param statusId - The unique identifier of the agent status to be updated.
   * @param name - The new name for the agent status.
   * @param discription - The new description for the agent status.
   */
  private async updateStatus(statusId: string, name: string, discription: string): Promise<void> {
    await this.client.send(
      new UpdateAgentStatusCommand({
        InstanceId: this.parameter.instanceId,
        AgentStatusId: statusId,
        Name: name,
        Description: discription,
      }),
    );
  }
}
