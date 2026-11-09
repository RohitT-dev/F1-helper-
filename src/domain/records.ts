import { z } from 'zod';
import { WEATHER_IDS } from '../data/weather';
import { SetupSchema } from './schema';

/** The slice of AsyncStorage the record store needs, so tests can use memory. */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<readonly string[]>;
  multiGet(keys: readonly string[]): Promise<readonly (readonly [string, string | null])[]>;
  multiRemove(keys: readonly string[]): Promise<void>;
}

export const RecordSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  trackId: z.string(),
  weather: z.enum(WEATHER_IDS),
  createdAt: z.string(),
  model: z.string(),
  setup: SetupSchema,
});

export type SetupRecord = z.infer<typeof RecordSchema>;

/** Bump the version if the stored shape ever changes: old entries are then ignored. */
const PREFIX = 'f1setup:v1:';

function parseRecord(raw: string | null): SetupRecord | null {
  if (raw === null) return null;
  try {
    const result = RecordSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export interface RecordStore {
  get(id: string): Promise<SetupRecord | null>;
  save(record: SetupRecord): Promise<void>;
  list(): Promise<SetupRecord[]>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

export function createRecordStore(kv: KeyValueStore): RecordStore {
  async function ownKeys(): Promise<string[]> {
    return (await kv.getAllKeys()).filter((key) => key.startsWith(PREFIX));
  }

  return {
    async get(id) {
      return parseRecord(await kv.getItem(PREFIX + id));
    },

    async save(record) {
      await kv.setItem(PREFIX + record.id, JSON.stringify(record));
    },

    async list() {
      const pairs = await kv.multiGet(await ownKeys());
      return pairs
        .map(([, raw]) => parseRecord(raw))
        .filter((record): record is SetupRecord => record !== null)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async remove(id) {
      await kv.removeItem(PREFIX + id);
    },

    async clear() {
      await kv.multiRemove(await ownKeys());
    },
  };
}
