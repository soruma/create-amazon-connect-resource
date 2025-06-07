import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import { ConnectClient } from '@aws-sdk/client-connect';

import { UpdateAgentStatusParameterBuilder } from '../src/update-agent-status-parameter-builder';

describe('UpdateAgentStatusParameterBuilder', () => {
  let sendMock: MockInstance;

  beforeEach(() => {
    sendMock = vi.spyOn(ConnectClient.prototype, 'send');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parameters when instanceId is provided directly', async () => {
    const builder = new UpdateAgentStatusParameterBuilder({
      instanceId: 'inst-123',
      routableName: 'Online',
      routableDescription: 'User can take calls',
      offlineName: 'Offline',
      offlineDescription: 'User is not available',
    });
    const params = await builder.build();
    expect(params).toEqual({
      instanceId: 'inst-123',
      routableName: 'Online',
      routableDescription: 'User can take calls',
      offlineName: 'Offline',
      offlineDescription: 'User is not available',
      credentials: expect.any(Function),
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('resolves instanceAlias to instanceId via ListInstancesCommand', async () => {
    sendMock.mockResolvedValueOnce({
      InstanceSummaryList: [{ InstanceAlias: 'alias-1', Id: 'resolved-id-1' }],
    });

    const builder = new UpdateAgentStatusParameterBuilder({
      instanceAlias: 'alias-1',
      routableName: 'Online',
      routableDescription: 'desc1',
      offlineName: 'Offline',
      offlineDescription: 'desc2',
    });
    const params = await builder.build();
    expect(params.instanceId).toBe('resolved-id-1');
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('throws "Invalid Connect instance." when neither instanceId nor alias given', async () => {
    const builder = new UpdateAgentStatusParameterBuilder({
      routableName: 'Online',
      routableDescription: 'desc1',
      offlineName: 'Offline',
      offlineDescription: 'desc2',
    });
    await expect(builder.build()).rejects.toThrow('Invalid Connect instance.');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('throws "Invalid Connect instance." when alias lookup returns no match', async () => {
    sendMock.mockResolvedValueOnce({ InstanceSummaryList: [] });

    const builder = new UpdateAgentStatusParameterBuilder({
      instanceAlias: 'alias-x',
      routableName: 'Online',
      routableDescription: 'desc1',
      offlineName: 'Offline',
      offlineDescription: 'desc2',
    });
    await expect(builder.build()).rejects.toThrow('Invalid Connect instance.');
    expect(sendMock).toHaveBeenCalled();
  });

  it('throws "Invalid status." when neither routableName nor offlineName is provided', async () => {
    const builder = new UpdateAgentStatusParameterBuilder({
      instanceId: 'inst-123',
    });
    await expect(builder.build()).rejects.toThrow('Invalid status.');
  });

  it('throws "Invalid status." when routableName and offlineName are identical', async () => {
    const builder = new UpdateAgentStatusParameterBuilder({
      instanceId: 'inst-123',
      routableName: 'SameName',
      offlineName: 'SameName',
    });
    await expect(builder.build()).rejects.toThrow('Invalid status.');
  });
});
