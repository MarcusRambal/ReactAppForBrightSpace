//src/features/auth/presentation/context/authContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { AuthUser } from "../../domain/entities/authUser";
import { IAuthRepository } from "../../domain/repositories/IauthRepository";

export type AuthContextType = {
  loggedUser: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  emailToVerify: string;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  validate: (email: string, validationCode: string) => Promise<boolean>;
  getLoggedUser: () => Promise<any | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const di = useDI();

  const authRepo = useMemo(() => di.resolve<IAuthRepository>(TOKENS.AuthRepo), [di]);

  const [loggedUser, setLoggedUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState<string>("");
  const [isWaitingForValidation, setIsWaitingForValidation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    authRepo.getCurrentUser()
      .then((user) => {
        setLoggedUser(user);
        setIsLoggedIn(!!user);
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    clearError();
    try {
      setLoading(true);

      console.log("🔥 AUTH CONTEXT: login start");

      await authRepo.login(email, password);

      console.log("🔥 AUTH CONTEXT: login OK, llamando getCurrentUser");

      const user = await authRepo.getCurrentUser();

      console.log("👤 USER FROM API:", user);

      setLoggedUser(user);
      setIsLoggedIn(!!user);
      console.log("📌 isLoggedIn:", !!user);
    } catch (err: any) {
      console.log("❌ LOGIN ERROR:", err);
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const signup = async (name: string, email: string, password: string) => {
    clearError();
    try {
      setLoading(true);
      await authRepo.signup(name, email, password);
      setEmailToVerify(email);

    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    clearError();
    try {
      setLoading(true);
      await authRepo.logout();
      setLoggedUser(null); // 🔥 IMPORTANTE
      setIsLoggedIn(false);
    } catch (err: any) {
      setError(err?.message ?? "Logout failed");
    } finally {
      setLoading(false);
    }
  };


  const validate = async (email: string, validationCode: string) => {
    clearError();
    try {
      await authRepo.validate(email, validationCode);
      await authRepo.addUser(email);
      setIsWaitingForValidation(false);
      setEmailToVerify("");
    } catch (err: any) {
      return err?.message ?? "Validation failed";
    }
    return null;
  }

  const getLoggedUser = async () => {
    try {
      return await authRepo.getCurrentUser();
    } catch (err) {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ loggedUser, isLoggedIn, loading, error,emailToVerify,  clearError, login, signup, logout, validate, getLoggedUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}