import { afterEach, describe, expect, it } from 'vitest';
import { CliBuilder } from '../src/cli';

describe('CliBuilder', () => {
  const originalArgv = process.argv;

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('parses minimal options (--instance-id)', () => {
    process.argv = ['node', 'update-agent-status', '--instance-id', 'i-123'];
    const { args, options } = new CliBuilder().build();

    expect(args).toEqual([]);
    expect(options.instanceId).toBe('i-123');
    expect(options.instanceAlias).toBeUndefined();

    expect(options.region).toBeUndefined();
    expect(options.profile).toBeUndefined();
  });

  it('parses alias, region, and profile flags', () => {
    process.argv = [
      'node',
      'update-agent-status',
      '--instance-alias',
      'alias1',
      '--region',
      'us-east-1',
      '--profile',
      'devProfile',
    ];
    const { args, options } = new CliBuilder().build();

    expect(args).toEqual([]);
    expect(options.instanceAlias).toBe('alias1');
    expect(options.region).toBe('us-east-1');
    expect(options.profile).toBe('devProfile');
    expect(options.instanceId).toBeUndefined();
  });

  it('parses status names and descriptions', () => {
    process.argv = [
      'node',
      'update-agent-status',
      '--routable-name',
      'Available',
      '--routable-description',
      'Ready to serve',
      '--offline-name',
      'Offline',
      '--offline-description',
      'Not available',
    ];
    const { options } = new CliBuilder().build();

    expect(options.routableName).toBe('Available');
    expect(options.routableDescription).toBe('Ready to serve');
    expect(options.offlineName).toBe('Offline');
    expect(options.offlineDescription).toBe('Not available');
  });

  it('captures positional arguments before flags', () => {
    process.argv = ['node', 'update-agent-status', 'firstPos', 'secondPos', '--instance-id', 'i-456'];
    const { args, options } = new CliBuilder().build();

    expect(args).toEqual(['firstPos', 'secondPos']);
    expect(options.instanceId).toBe('i-456');
  });
});
