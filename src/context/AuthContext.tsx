"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ["/leaderboard", "/submit-score", "/"];
const authPages = ["/login", "/register", "/confirm-signup"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  useEffect(() => {
    if (accessToken) {
      if (authPages.includes(pathname)) {
        router.replace("/leaderboard");
      }
    } else {
      if (protectedRoutes.includes(pathname)) {
        router.replace("/login");
      }
    }
  }, [accessToken, pathname, router]);

  function login(token: string) {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    router.push("/leaderboard");
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    router.push("/login");
  }

  const value = {
    accessToken,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
