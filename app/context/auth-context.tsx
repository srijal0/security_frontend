// banksecure-frontend/app/context/auth-context.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authAPI, User } from "../lib/api";

const TOKEN_KEY = "banksecure_token";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUserAndToken: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authAPI
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const setUserAndToken = (user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUserAndToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}