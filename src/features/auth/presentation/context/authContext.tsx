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
  name: string;
  password: string;
  isWaitingForValidation: boolean;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<Boolean>;
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
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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

      let user = await authRepo.getCurrentUser();

      console.log("👤 USER FROM API:", user);

      // Si el usuario no existe en BD, crear el usuario
      if (!user) {
        console.log("👤 Usuario no encontrado en BD, creando...");
        try {
          await authRepo.addUser(email);
          console.log("✅ Usuario creado en BD");
          // Volver a obtener el usuario después de crearlo
          user = await authRepo.getCurrentUser();
          console.log("👤 USER DESPUÉS DE CREAR:", user);
        } catch (err: any) {
          console.error("⚠️ Error al crear usuario, pero continúa:", err);
        }
      }

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
 const signup = async (name: string, email: string, password: string): Promise<boolean> => {
  clearError();
  setLoading(true); 

  try {
    await authRepo.signup(name, email, password);
    setEmailToVerify(email);
    setName(name);
    setPassword(password);
    setIsWaitingForValidation(true);
    return true; 
  } catch (err: any) {
    setError(err?.message ?? "Signup failed");
    return false;
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


  const validate = async (email: string, validationCode: string): Promise<boolean> => {
    clearError();
    try {
      await authRepo.validate(email, validationCode);
      setIsWaitingForValidation(false);
      setEmailToVerify("");
      return true;
    } catch (err: any) {
      setError(err?.message ?? "Validation failed");
      return false;
    }
  }

  const getLoggedUser = async () => {
    try {
      return await authRepo.getCurrentUser();
    } catch (err) {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ loggedUser, isLoggedIn, loading, error, emailToVerify, name, password, isWaitingForValidation, clearError, login, signup, logout, validate, getLoggedUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}