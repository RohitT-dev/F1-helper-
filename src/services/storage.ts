import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createRecordStore } from '../domain/records';

/** Generated setups, cached on the phone so repeat lookups cost nothing. */
export const recordStore = createRecordStore(AsyncStorage);

const KEY_NAME = 'anthropic_api_key';

/** The API key lives in the iOS Keychain / Android Keystore, not in plain storage. */
export const apiKeyStore = {
  async get(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEY_NAME);
    } catch {
      return null;
    }
  },
  async set(key: string): Promise<void> {
    await SecureStore.setItemAsync(KEY_NAME, key.trim());
  },
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(KEY_NAME);
  },
};
