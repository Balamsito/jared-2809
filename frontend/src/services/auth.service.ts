import type { User, UserSession } from "../types/user.types";
import { storageGet, storageSet, storageRemove, StorageKeys } from "./storage.service";

interface PasswordRecord {
  salt: string;
  hash: string;
}

function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(salt: string, password: string): Promise<string> {
  const encoded = new TextEncoder().encode(salt + password);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function register(
  email: string,
  displayName: string,
  password: string
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  const users = storageGet<User[]>(StorageKeys.USERS) ?? [];

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "Este email ya esta registrado." };
  }

  const salt = generateSalt();
  const hash = await hashPassword(salt, password);
  const passwordRecord: PasswordRecord = { salt, hash };

  const newUser: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    displayName,
    passwordHash: JSON.stringify(passwordRecord),
    createdAt: new Date().toISOString(),
  };

  storageSet(StorageKeys.USERS, [...users, newUser]);
  return { success: true, user: newUser };
}

export async function login(
  email: string,
  password: string
): Promise<{ success: true; session: UserSession } | { success: false; error: string }> {
  const users = storageGet<User[]>(StorageKeys.USERS) ?? [];
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: "Credenciales incorrectas." };
  }

  let record: PasswordRecord;
  try {
    record = JSON.parse(user.passwordHash) as PasswordRecord;
  } catch {
    return { success: false, error: "Error al verificar credenciales." };
  }

  const hash = await hashPassword(record.salt, password);

  if (hash !== record.hash) {
    return { success: false, error: "Credenciales incorrectas." };
  }

  const session: UserSession = {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    balance: 0,
    isAuthenticated: true,
    loginAt: new Date().toISOString(),
  };

  // Preserve existing balance if user has logged in before
  const existingSession = storageGet<UserSession>(StorageKeys.SESSION);
  if (existingSession && existingSession.userId === user.id) {
    session.balance = existingSession.balance;
  }

  storageSet(StorageKeys.SESSION, session);
  return { success: true, session };
}

export function logout(): void {
  storageRemove(StorageKeys.SESSION);
}

export function getSession(): UserSession | null {
  return storageGet<UserSession>(StorageKeys.SESSION);
}

export function updateBalance(newBalanceCents: number): void {
  const session = storageGet<UserSession>(StorageKeys.SESSION);
  if (!session) return;
  storageSet(StorageKeys.SESSION, { ...session, balance: newBalanceCents });
}
