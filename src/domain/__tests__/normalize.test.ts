import { describe, expect, it } from 'vitest';
import { normalizeSetup, snapToSpec } from '../normalize';
import { SETTING_BY_KEY, SETTING_KEYS, type SettingKey } from '../settings';
import type { SetupResponse } from '../schema';

function responseWith(values: Partial<Record<SettingKey, number>>): SetupResponse {
  const settings = {} as SetupResponse['settings'];
  for (const key of SETTING_KEYS) {
    const spec = SETTING_BY_KEY[key];
    settings[key] = { value: values[key] ?? (spec.min + spec.max) / 2, why: `why ${key}` };
  }
  return { summary: 'summary', settings, drivingTips: ['tip one', 'tip two'] };
}

describe('snapToSpec', () => {
  it('snaps to the slider step', () => {
    expect(snapToSpec(SETTING_BY_KEY.frontWing, 27.4)).toBe(27);
    expect(snapToSpec(SETTING_BY_KEY.diffOnThrottle, 92)).toBe(90);
    expect(snapToSpec(SETTING_BY_KEY.diffOnThrottle, 93)).toBe(95);
    expect(snapToSpec(SETTING_BY_KEY.engineBraking, 96)).toBe(100);
  });

  it('snaps decimals without floating point noise', () => {
    expect(snapToSpec(SETTING_BY_KEY.tyrePressureFR, 27.46)).toBe(27.5);
    expect(snapToSpec(SETTING_BY_KEY.frontCamber, -3.37)).toBe(-3.4);
    expect(snapToSpec(SETTING_BY_KEY.frontToe, 0.123)).toBe(0.12);
    expect(snapToSpec(SETTING_BY_KEY.rearCamber, -1.1)).toBe(-1.1);
  });

  it('clamps to the slider range', () => {
    expect(snapToSpec(SETTING_BY_KEY.frontWing, 60)).toBe(50);
    expect(snapToSpec(SETTING_BY_KEY.frontWing, -4)).toBe(0);
    expect(snapToSpec(SETTING_BY_KEY.rearCamber, -2.5)).toBe(-2.2);
    expect(snapToSpec(SETTING_BY_KEY.brakePressure, 70)).toBe(80);
    expect(snapToSpec(SETTING_BY_KEY.tyrePressureRL, 29)).toBe(26.5);
  });
});

describe('normalizeSetup', () => {
  it('keeps in-range values and the explanation text', () => {
    const setup = normalizeSetup(responseWith({ frontWing: 25, rearWing: 24 }));
    expect(setup.settings.frontWing).toEqual({ value: 25, why: 'why frontWing' });
    expect(setup.settings.rearWing.value).toBe(24);
    expect(setup.summary).toBe('summary');
    expect(setup.drivingTips).toEqual(['tip one', 'tip two']);
  });

  it('records the original value only when it had to be clamped into range', () => {
    const setup = normalizeSetup(
      responseWith({ frontWing: 60, rearWing: 23.6, diffOnThrottle: 92 }),
    );
    expect(setup.settings.frontWing.value).toBe(50);
    expect(setup.settings.frontWing.originalValue).toBe(60);
    // snapped but in range: no flag
    expect(setup.settings.rearWing.value).toBe(24);
    expect(setup.settings.rearWing.originalValue).toBeUndefined();
    expect(setup.settings.diffOnThrottle.value).toBe(90);
    expect(setup.settings.diffOnThrottle.originalValue).toBeUndefined();
  });

  it('returns a value for every one of the 21 settings, all inside range', () => {
    const setup = normalizeSetup(responseWith({}));
    expect(Object.keys(setup.settings)).toHaveLength(21);
    for (const key of SETTING_KEYS) {
      const spec = SETTING_BY_KEY[key];
      const { value } = setup.settings[key];
      expect(value).toBeGreaterThanOrEqual(spec.min);
      expect(value).toBeLessThanOrEqual(spec.max);
    }
  });
});
