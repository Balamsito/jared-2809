import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { UserSession } from "../types/user.types";
import { getSession, logout as logoutService, updateBalance } from "../services/auth.service";

interface AuthContextValue {
  session: UserSession | null;
  isLoading: boolean;
  refreshSession: () => void;
  logout: () => void;
  addBalance: (amountCents: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    // Rehydrate session on mount (handles page refresh)
    refreshSession();
    setIsLoading(false);
  }, [refreshSession]);

  const logout = useCallback(() => {
    logoutService();
    setSession(null);
  }, []);

  const addBalance = useCallback((amountCents: number) => {
    const current = getSession();
    if (!current) return;
    const newBalance = current.balance + amountCents;
    updateBalance(newBalance);
    setSession({ ...current, balance: newBalance });
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, refreshSession, logout, addBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

