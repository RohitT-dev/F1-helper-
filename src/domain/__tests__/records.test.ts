import { beforeEach, describe, expect, it } from 'vitest';
import { createRecordStore, type KeyValueStore, type SetupRecord } from '../records';
import { SETTING_BY_KEY, SETTING_KEYS } from '../settings';
import type { Setup } from '../normalize';

class MemoryStore implements KeyValueStore {
  data = new Map<string, string>();
  async getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  async setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  async removeItem(key: string) {
    this.data.delete(key);
  }
  async getAllKeys() {
    return [...this.data.keys()];
  }
  async multiGet(keys: readonly string[]) {
    return keys.map((k) => [k, this.data.get(k) ?? null] as const);
  }
  async multiRemove(keys: readonly string[]) {
    keys.forEach((k) => this.data.delete(k));
  }
}

function makeSetup(): Setup {
  const settings = {} as Setup['settings'];
  for (const key of SETTING_KEYS) {
    settings[key] = { value: SETTING_BY_KEY[key].min, why: `why ${key}` };
  }
  return { summary: 'sum', drivingTips: ['tip'], settings };
}

function makeRecord(over: Partial<SetupRecord> = {}): SetupRecord {
  return {
    id: 'ferrari__monza__dry',
    teamId: 'ferrari',
    trackId: 'monza',
    weather: 'dry',
    createdAt: '2026-11-09T10:00:00.000Z',
    model: 'claude-opus-5-5',
    setup: makeSetup(),
    ...over,
  };
}

describe('record store', () => {
  let kv: MemoryStore;
  beforeEach(() => {
    kv = new MemoryStore();
  });

  it('returns null for an unknown id', async () => {
    expect(await createRecordStore(kv).get('ferrari__monza__dry')).toBeNull();
  });

  it('saves and reads back a record', async () => {
    const store = createRecordStore(kv);
    const record = makeRecord();
    await store.save(record);
    expect(await store.get(record.id)).toEqual(record);
  });

  it('lists newest first and ignores unrelated keys', async () => {
    const store = createRecordStore(kv);
    await kv.setItem('something-else', 'x');
    await store.save(makeRecord({ id: 'ferrari__monza__dry', createdAt: '2026-11-01T00:00:00.000Z' }));
    await store.save(
      makeRecord({ id: 'mclaren__spa__dry', teamId: 'mclaren', trackId: 'spa', createdAt: '2026-11-05T00:00:00.000Z' }),
    );
    const list = await store.list();
    expect(list.map((r) => r.id)).toEqual(['mclaren__spa__dry', 'ferrari__monza__dry']);
  });

  it('treats corrupt or out-of-date entries as missing instead of crashing', async () => {
    const store = createRecordStore(kv);
    await store.save(makeRecord());
    const key = [...kv.data.keys()][0];
    kv.data.set(key, '{not json');
    expect(await store.get('ferrari__monza__dry')).toBeNull();
    kv.data.set(key, JSON.stringify({ id: 'ferrari__monza__dry' }));
    expect(await store.get('ferrari__monza__dry')).toBeNull();
    expect(await store.list()).toEqual([]);
  });

  it('removes one record and clears all', async () => {
    const store = createRecordStore(kv);
    await store.save(makeRecord());
    await store.save(makeRecord({ id: 'mclaren__spa__dry', teamId: 'mclaren', trackId: 'spa' }));
    await store.remove('ferrari__monza__dry');
    expect((await store.list()).map((r) => r.id)).toEqual(['mclaren__spa__dry']);
    await kv.setItem('keep-me', 'x');
    await store.clear();
    expect(await store.list()).toEqual([]);
    expect(await kv.getItem('keep-me')).toBe('x');
  });
});
