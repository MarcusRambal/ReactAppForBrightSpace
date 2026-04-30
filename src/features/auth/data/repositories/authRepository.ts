//src/features/auth/data/repositories/authRepository.ts
import { AuthUser } from "../../domain/entities/authUser";
import { IAuthRepository } from "../../domain/repositories/IauthRepository";
import { AuthenticatioSourceService } from "../dataSources/authenticationSourceService";

export class AuthRepository implements IAuthRepository {
  private dataSource: AuthenticatioSourceService;

  constructor(dataSource: AuthenticatioSourceService) {
    this.dataSource = dataSource;
  }

  async login(email: string, password: string): Promise<void> {
    return this.dataSource.login(email, password);
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    return this.dataSource.signUp(name, email, password);
  }

  async logout(): Promise<void> {
    return this.dataSource.logOut();
  }

  async getCurrentUser(): Promise<AuthUser | null> { 
    return this.dataSource.getCurrentUser();
  }

  async validate(email: string, validationCode: string): Promise<boolean> {
    return this.dataSource.validate(email, validationCode);
  }

  async addUser(email: string): Promise<void> {
    return this.dataSource.addUser(email);
  }
}
