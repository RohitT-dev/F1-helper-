import { describe, expect, it } from 'vitest';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { SetupResponseSchema } from '../schema';
import { SETTING_KEYS } from '../settings';

function validResponse() {
  return {
    summary: 'Low drag setup.',
    settings: Object.fromEntries(
      SETTING_KEYS.map((k) => [k, { value: 10, why: `why ${k}` }]),
    ),
    drivingTips: ['Brake late.'],
  };
}

describe('SetupResponseSchema', () => {
  it('accepts a complete response', () => {
    expect(SetupResponseSchema.safeParse(validResponse()).success).toBe(true);
  });

  it('rejects a response missing a setting', () => {
    const bad = validResponse();
    delete (bad.settings as Record<string, unknown>).frontWing;
    expect(SetupResponseSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a non-numeric value', () => {
    const bad = validResponse();
    (bad.settings as Record<string, unknown>).frontWing = { value: 'high', why: 'x' };
    expect(SetupResponseSchema.safeParse(bad).success).toBe(false);
  });

  it('converts to a JSON schema the Claude API can use', () => {
    const format = zodOutputFormat(SetupResponseSchema);
    expect(format.type).toBe('json_schema');
    const schema = JSON.stringify(format.schema);
    for (const key of SETTING_KEYS) expect(schema).toContain(key);
  });
});
