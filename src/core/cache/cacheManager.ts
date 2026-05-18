import { get, set } from "idb-keyval";

export async function getCachedTranslation(
  key: string
): Promise<string | undefined> {
  return get(key);
}

export async function setCachedTranslation(key: string, value: string) {
  await set(key, value);
}
