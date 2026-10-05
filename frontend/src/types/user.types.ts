export interface User {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string; // JSON string: { salt: string; hash: string }
  createdAt: string;
}

export interface UserSession {
  userId: string;
  email: string;
  displayName: string;
  balance: number; // stored in cents (integer) to avoid floating point issues
  isAuthenticated: boolean;
  loginAt: string;
}
