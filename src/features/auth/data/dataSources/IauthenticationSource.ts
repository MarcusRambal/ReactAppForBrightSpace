//src/features/auth/data/dataSources/IauthenticationSource.ts
import { AuthUser } from "../../domain/entities/authUser";

export interface IauthSource {
  login(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  logOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  validate(email: string, validationCode: string): Promise<boolean>;
  addUser(email: string): Promise<void>;
  refreshToken(): Promise<boolean>;
  verifyToken(): Promise<boolean>;
}