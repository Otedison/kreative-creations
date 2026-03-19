"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL as string) || '/api';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_BASE}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.ok) setIsAdmin(true);
    }).catch(() => {
      setIsAdmin(false);
    }).finally(() => setIsLoading(false));
  }, []);

  const signIn = async (password: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Login failed' }));
        return { error: err.message || 'Login failed' };
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      setIsAdmin(true);
      return {};
    } catch (err) {
      return { error: 'Login failed' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
