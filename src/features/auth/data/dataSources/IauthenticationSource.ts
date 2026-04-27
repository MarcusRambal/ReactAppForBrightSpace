//src/features/auth/data/dataSources/IauthenticationSource.ts
import { AuthUser } from "../../domain/entities/authUser";

export interface IauthSource {
  login(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  logOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  validate(email: string, validationCode: string): Promise<boolean>;
  refreshToken(): Promise<boolean>;
  verifyToken(): Promise<boolean>;
}