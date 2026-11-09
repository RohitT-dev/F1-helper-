import { SETTING_BY_KEY, SETTING_KEYS, type SettingSpec } from './settings';
import type { Setup, SetupEntry, SetupResponse } from './schema';

export type { Setup, SetupEntry } from './schema';

/** Clamps a raw number into the slider range and snaps it to the slider step. */
export function snapToSpec(spec: SettingSpec, raw: number): number {
  const clamped = Math.min(spec.max, Math.max(spec.min, raw));
  const steps = Math.round((clamped - spec.min) / spec.step);
  const snapped = spec.min + steps * spec.step;
  const bounded = Math.min(spec.max, Math.max(spec.min, snapped));
  // toFixed removes floating point noise such as 27.500000000000004
  return Number(bounded.toFixed(spec.decimals));
}

/**
 * Turns Claude's answer into a setup the game can accept. Every value ends up
 * inside the real slider range on a real step. If Claude went out of range we
 * keep its number so the UI can say so.
 */
export function normalizeSetup(response: SetupResponse): Setup {
  const settings = {} as Setup['settings'];

  for (const key of SETTING_KEYS) {
    const spec = SETTING_BY_KEY[key];
    const raw = response.settings[key];
    const entry: SetupEntry = {
      value: snapToSpec(spec, raw.value),
      why: raw.why.trim(),
    };
    if (raw.value < spec.min || raw.value > spec.max) {
      entry.originalValue = raw.value;
    }
    settings[key] = entry;
  }

  return {
    summary: response.summary.trim(),
    drivingTips: response.drivingTips.map((tip) => tip.trim()).filter(Boolean),
    settings,
  };
}
