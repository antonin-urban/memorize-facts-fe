import * as SecureStore from 'expo-secure-store';

export async function saveValueInSecureStore(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFromSecureStore(key: string): Promise<string> {
  const result = await SecureStore.getItemAsync(key);
  return result;
}

export enum SYNC_SECURE_STORE_KEYS {
  LOGIN = 'SYNC_LOGIN',
  PASSWORD = 'SYNC_PASSWORD',
  ENABLED = 'SYNC_ENABLED',
}

export enum SYNC_SECURE_STORE_STATUS {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export async function checkSyncStatusInSecureStore(): Promise<boolean> {
  const statusFromStorage = await getValueFromSecureStore(SYNC_SECURE_STORE_KEYS.ENABLED);
  const loginFromStorage = await getValueFromSecureStore(SYNC_SECURE_STORE_KEYS.LOGIN);
  const passwordFromStorage = await getValueFromSecureStore(SYNC_SECURE_STORE_KEYS.PASSWORD);

  console.log('statusFromStorage', statusFromStorage);
  console.log('loginFromStorage', loginFromStorage);
  console.log('passwordFromStorage', passwordFromStorage);

  if (statusFromStorage === SYNC_SECURE_STORE_STATUS.ENABLED && loginFromStorage && passwordFromStorage) {
    return true;
  }
  return false;
}

export async function setSyncStatusInSecureStore(status: SYNC_SECURE_STORE_STATUS): Promise<void> {
  await SecureStore.setItemAsync(SYNC_SECURE_STORE_KEYS.ENABLED, status);
}

export async function setSyncLoginInSecureStore(login: string, password: string): Promise<void> {
  await SecureStore.setItemAsync(SYNC_SECURE_STORE_KEYS.LOGIN, login);
  return SecureStore.setItemAsync(SYNC_SECURE_STORE_KEYS.PASSWORD, password);
}

export async function destroyLoginInSecureStore(): Promise<void> {
  await SecureStore.deleteItemAsync(SYNC_SECURE_STORE_KEYS.LOGIN);
  return SecureStore.deleteItemAsync(SYNC_SECURE_STORE_KEYS.PASSWORD);
}

export async function getLoginFromSecureStore(): Promise<[string, string]> {
  const login = await getValueFromSecureStore(SYNC_SECURE_STORE_KEYS.LOGIN);
  const password = await getValueFromSecureStore(SYNC_SECURE_STORE_KEYS.PASSWORD);
  return [login, password];
}
