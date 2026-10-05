/**
 * Typed wrapper around localStorage.
 * All keys are namespaced with "snailbet:" to avoid collisions.
 */

const NS = "snailbet";

export const StorageKeys = {
  USERS: `${NS}:users`,
  SESSION: `${NS}:session`,
  bets: (userId: string) => `${NS}:bets:${userId}`,
} as const;

export function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("[Storage] Failed to write:", key, err);
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("[Storage] Failed to remove:", key, err);
  }
}
