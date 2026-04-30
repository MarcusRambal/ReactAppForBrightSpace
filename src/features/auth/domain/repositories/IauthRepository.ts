//src/features/auth/domain/repositories/IauthRepository.ts
import { AuthUser } from "../entities/authUser";

export interface IAuthRepository {
  login(email: string, password: string): Promise<void>;
  signup(name:string, email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  validate(email: string, validationCode: string): Promise<boolean>;
  addUser(email: string): Promise<void>;
}