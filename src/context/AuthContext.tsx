/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  preferred_username: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored);
    }
    return null;
  });

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("token", JSON.stringify(userData.token.AccessToken));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // React.useEffect(() => {
  //   if (user) {
  //     setAuthToken(user.token.AccessToken);
  //   }
  // }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
