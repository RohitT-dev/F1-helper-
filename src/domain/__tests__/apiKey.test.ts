import { describe, expect, it } from 'vitest';
import { looksLikeAnthropicKey, maskKey } from '../apiKey';

describe('looksLikeAnthropicKey', () => {
  it('accepts a plausible key, ignoring surrounding whitespace', () => {
    expect(looksLikeAnthropicKey('  sk-ant-api03-abcdefghijklmnopqrstuvwxyz0123456789\n')).toBe(true);
  });

  it('rejects other strings', () => {
    expect(looksLikeAnthropicKey('')).toBe(false);
    expect(looksLikeAnthropicKey('sk-abc')).toBe(false);
    expect(looksLikeAnthropicKey('sk-ant-short')).toBe(false);
    expect(looksLikeAnthropicKey('sk-ant-has spaces inside the key value here')).toBe(false);
  });
});

describe('maskKey', () => {
  it('hides the middle of the key', () => {
    const masked = maskKey('sk-ant-api03-abcdefghijklmnopqrstuvwxyzWXYZ');
    expect(masked).toBe('sk-ant-api••••••••WXYZ');
    expect(masked).not.toContain('klmnop');
  });

  it('fully hides very short values', () => {
    expect(maskKey('short')).toBe('••••••••');
  });
});
