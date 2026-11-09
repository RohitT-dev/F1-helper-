import { z } from 'zod';
import { SETTING_KEYS, type SettingKey } from './settings';

/** What Claude returns for each setting: a number and a short reason. */
const ResponseEntrySchema = z.object({
  value: z.number(),
  why: z.string(),
});

const responseShape = Object.fromEntries(
  SETTING_KEYS.map((key) => [key, ResponseEntrySchema]),
) as Record<SettingKey, typeof ResponseEntrySchema>;

/** Shape Claude is asked to produce (sent to the API as a JSON schema). */
export const SetupResponseSchema = z.object({
  summary: z.string(),
  settings: z.object(responseShape),
  drivingTips: z.array(z.string()),
});

export type SetupResponse = z.infer<typeof SetupResponseSchema>;

/** A setting after clamping to the game's slider. */
const SetupEntrySchema = z.object({
  value: z.number(),
  why: z.string(),
  /** Claude's raw number when it fell outside the game's range and was clamped. */
  originalValue: z.number().optional(),
});

const setupShape = Object.fromEntries(
  SETTING_KEYS.map((key) => [key, SetupEntrySchema]),
) as Record<SettingKey, typeof SetupEntrySchema>;

/** The setup the app stores and shows. */
export const SetupSchema = z.object({
  summary: z.string(),
  drivingTips: z.array(z.string()),
  settings: z.object(setupShape),
});

export type SetupEntry = z.infer<typeof SetupEntrySchema>;
export type Setup = z.infer<typeof SetupSchema>;
