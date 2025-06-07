import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import {
  AgentStatusSummary,
  AgentStatusType,
  ConnectClient,
  ListAgentStatusesCommand,
  UpdateAgentStatusCommand,
} from '@aws-sdk/client-connect';

import { UpdateAgentStatus } from '../src/update-agent-status';
import type { UpdateAgentStatusParameter } from '../src/update-agent-status-parameter-builder';

describe('UpdateAgentStatus', () => {
  const baseParameter: UpdateAgentStatusParameter = {
    instanceId: 'instance-1',
    routableName: 'Routable',
    routableDescription: 'Routable Desc',
    offlineName: 'Offline',
    offlineDescription: 'Offline Desc',
    credentials: expect.any(Function),
  };

  let sendMock: MockInstance;

  beforeEach(() => {
    sendMock = vi.spyOn(ConnectClient.prototype, 'send');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exits when no agent statuses are returned', async () => {
    sendMock.mockResolvedValueOnce({ AgentStatusSummaryList: [] });
    await expect(new UpdateAgentStatus(baseParameter).update()).rejects.toThrow(
      'No agent statuses found for instance "instance-1".',
    );
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('updates both ROUTABLE and OFFLINE statuses when present', async () => {
    const summaries: AgentStatusSummary[] = [
      { Id: 'r1', Type: AgentStatusType.ROUTABLE, Name: 'old' },
      { Id: 'o1', Type: AgentStatusType.OFFLINE, Name: 'old' },
    ];
    sendMock.mockResolvedValueOnce({ AgentStatusSummaryList: summaries }).mockResolvedValue({});

    const updater = new UpdateAgentStatus(baseParameter);
    await updater.update();

    expect(sendMock).toHaveBeenCalledTimes(3);

    const listCall = sendMock.mock.calls[0][0];
    expect(listCall).toBeInstanceOf(ListAgentStatusesCommand);
    expect((listCall as { [k: string]: string }).input).toEqual({ InstanceId: baseParameter.instanceId });

    const routableCall = sendMock.mock.calls[1][0];
    expect(routableCall).toBeInstanceOf(UpdateAgentStatusCommand);
    expect((routableCall as { [k: string]: string }).input).toEqual({
      InstanceId: baseParameter.instanceId,
      AgentStatusId: 'r1',
      Name: baseParameter.routableName,
      Description: baseParameter.routableDescription,
    });

    const offlineCall = sendMock.mock.calls[2][0];
    expect(offlineCall).toBeInstanceOf(UpdateAgentStatusCommand);
    expect((offlineCall as { [k: string]: string }).input).toEqual({
      InstanceId: baseParameter.instanceId,
      AgentStatusId: 'o1',
      Name: baseParameter.offlineName,
      Description: baseParameter.offlineDescription,
    });
  });

  it('updates only ROUTABLE when offlineName is empty', async () => {
    const param = { ...baseParameter, offlineName: '', offlineDescription: '' };
    const summaries: AgentStatusSummary[] = [
      { Id: 'r1', Type: AgentStatusType.ROUTABLE, Name: 'old' },
      { Id: 'o1', Type: AgentStatusType.OFFLINE, Name: 'old' },
    ];
    sendMock.mockResolvedValueOnce({ AgentStatusSummaryList: summaries }).mockResolvedValue({});

    await new UpdateAgentStatus(param).update();
    expect(sendMock).toHaveBeenCalledTimes(2);

    const updateCall = sendMock.mock.calls[1][0];
    expect(updateCall).toBeInstanceOf(UpdateAgentStatusCommand);
    expect((updateCall as { [k: string]: { [k: string]: string } }).input.AgentStatusId).toBe('r1');
  });

  it('exits when ROUTABLE id is missing but routableName provided', async () => {
    const summaries: AgentStatusSummary[] = [{ Id: 'o1', Type: AgentStatusType.OFFLINE, Name: 'old' }];
    sendMock.mockResolvedValueOnce({ AgentStatusSummaryList: summaries });
    await expect(new UpdateAgentStatus(baseParameter).update()).rejects.toThrow(
      'Routable status not found (type=ROUTABLE).',
    );
  });

  it('exits when OFFLINE id is missing but offlineName provided', async () => {
    const summaries: AgentStatusSummary[] = [{ Id: 'r1', Type: AgentStatusType.ROUTABLE, Name: 'old' }];
    sendMock.mockResolvedValueOnce({ AgentStatusSummaryList: summaries }).mockResolvedValue({});
    await expect(new UpdateAgentStatus(baseParameter).update()).rejects.toThrow(
      'Routable status not found (type=OFFLINE).',
    );
  });
});
