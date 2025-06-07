import type { Construct } from 'constructs';
import { describe, expect, it, vi } from 'vitest';
import { getStringContext } from '../lib/get-string-context';

describe('getStringContext', () => {
  it('returns the context value when it is a non-empty string', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue('hello-world') },
    } as unknown as Construct;

    const result = getStringContext(fakeApp, 'myKey', { default: 'fallback' });
    expect(fakeApp.node.tryGetContext).toHaveBeenCalledWith('myKey');
    expect(result).toBe('hello-world');
  });

  it('falls back to default when context is undefined', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue(undefined) },
    } as unknown as Construct;

    const result = getStringContext(fakeApp, 'missingKey', { default: 'default-val' });
    expect(fakeApp.node.tryGetContext).toHaveBeenCalledWith('missingKey');
    expect(result).toBe('default-val');
  });

  it('falls back to default when context is empty string', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue('') },
    } as unknown as Construct;

    const result = getStringContext(fakeApp, 'emptyKey', { default: 'default-val' });
    expect(fakeApp.node.tryGetContext).toHaveBeenCalledWith('emptyKey');
    expect(result).toBe('default-val');
  });

  it('throws an error when context is undefined and no default is provided', () => {
    const fakeApp = {
      node: { tryGetContext: vi.fn().mockReturnValue(undefined) },
    } as unknown as Construct;

    expect(() => getStringContext(fakeApp, 'requiredKey')).toThrowError('The requiredKey is required');
  });
});
