import { describe, it, expect, vi } from 'vitest';
import type { Construct } from 'constructs';

import { getBooleanContext } from '../lib/get-boolean-context';

describe('getBooleanContext', () => {
  it('returns context when context value is truthy', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue(true) },
    } as unknown as Construct;

    const result = getBooleanContext(fakeApp, 'featureEnabled', { default: false });
    expect(fakeApp.node.tryGetContext).toHaveBeenCalledWith('featureEnabled');
    expect(result).toBe(true);
  });

  it('falls back to default when context is undefined', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue(undefined) },
    } as unknown as Construct;

    const result = getBooleanContext(fakeApp, 'useCache', { default: true });
    expect(result).toBe(true);
  });

  it('falls back to default when context is falsy (false)', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue(false) },
    } as unknown as Construct;

    const result = getBooleanContext(fakeApp, 'verboseLogging', { default: false });
    expect(result).toBe(false);
  });

  it('throws an error when context is missing and no default provided', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue(undefined) },
    } as unknown as Construct;

    expect(() => getBooleanContext(fakeApp, 'mandatoryFlag'))
      .toThrowError('The mandatoryFlag is required');
  });
});
