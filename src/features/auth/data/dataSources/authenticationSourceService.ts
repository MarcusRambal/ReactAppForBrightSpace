//src/features/auth/data/dataSources/authenticationSourceService.ts
import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { IauthSource } from "./IauthenticationSource";
import { AuthUser } from "../../domain/entities/authUser";


export class AuthenticatioSourceService implements IauthSource {
  private readonly projectId: string;
  private readonly baseUrl: string;
  private readonly dbUrl: string;

  private prefs: ILocalPreferences;

  constructor(projectId = process.env.EXPO_PUBLIC_ROBLE_PROJECT_ID) {
    if (!projectId) {
      throw new Error("Missing EXPO_PUBLIC_ROBLE_PROJECT_ID env var");
    }
    this.projectId = projectId;
    this.baseUrl = `https://roble-api.openlab.uninorte.edu.co/auth/${this.projectId}`;
    this.dbUrl = `https://roble-api.openlab.uninorte.edu.co/database/${projectId}`;

    this.prefs = LocalPreferencesAsyncStorage.getInstance();
  }

  async login(email: string, password: string): Promise<void> {
    console.log("🌐 LOGIN REQUEST:", email);
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ email, password }),
      });
      console.log("🌐 LOGIN STATUS:", response.status);
      if (response.status === 201) {
        const data = await response.json();
        console.log("🌐 LOGIN RESPONSE:", data);
        const token = data["accessToken"];
        const refreshToken = data["refreshToken"];
        const userId = data["user"]["id"];
        const emailUser = data["user"]["email"];
        console.log("💾 TOKEN + USERID GUARDADOS");
        await this.prefs.storeData("token", token);
        await this.prefs.storeData("refreshToken", refreshToken);
        await this.prefs.storeData("userId", userId);
        await this.prefs.storeData("email", emailUser);

        //console.log("Token:", token, "\nRefresh Token:", refreshToken);
        return Promise.resolve();
      } else {
        const body = await response.json();
        throw new Error(`Login error: ${body.message}`);
      }
    } catch (e: any) {
      console.log("❌ LOGIN FAILED:", e);

      //console.error("Login failed", e);
      throw e;
    }
  }

  async signUp(name: string, email: string, password: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password,
        }),
      });

      if (response.status === 201) {
        // return this.login(email, password);
        console.log("Signup successful");
        return Promise.resolve();
      } else {
        const body = await response.json();
        throw new Error(`Signup error: ${(body.message || []).join(" ")}`);
      }
    } catch (e: any) {
      console.error("Signup failed", e);
      throw e;
    }
  }

  async logOut(): Promise<void> {
    try {
      const token = await this.prefs.retrieveData<string>("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${this.baseUrl}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        await this.prefs.removeData("token");
        await this.prefs.removeData("refreshToken");
        console.log("Logged out successfully");
        return Promise.resolve();
      } else {
        const body = await response.json();
        throw new Error(`Logout error: ${body.message}`);
      }
    } catch (e: any) {
      //console.error("Logout failed", e);
      throw e;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = await this.getValidToken();
      const userId = await this.prefs.retrieveData<string>("userId");
      console.log("🔎 GET USER - token:", token);
      console.log("🔎 GET USER - userId:", userId);

      if (!token || !userId) {
        console.warn("No token or userId found");
        return null;
      }

      const uri = `${this.dbUrl}/read?tableName=Users&userId=${userId}`;
      console.log("🔎 GET USER URL:", uri);
      const response = await fetch(uri, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🔎 GET USER STATUS:", response.status);
      if (response.status === 200) {
        const data = await response.json();
        console.log("🔎 GET USER DATA:", data);
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("User not found in DB");
          return null;
        }

        const user = data[0];

        const mappedUser: AuthUser = {
          email: user.email,
          password: "",
          rol: user.rol ?? "estudiante",
        };
        console.log("RAW USER:", user);

        return mappedUser;
      } else {
        const body = await response.json();
        console.error("getCurrentUser error:", body.message);
        return null;
      }
    } catch (e) {
      console.error("getCurrentUser failed", e);
      return null;
    }
  }
  async validate(email: string, validationCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ email, code: validationCode }),
      });

      if (response.status === 201) {
        return true;
      } else {
        const body = await response.json();
        throw new Error(`Validation error: ${body.message}`);
      }
    } catch (e: any) {
      console.error("Validation failed", e);
      throw e;
    }
  }

  async addUser(email: string): Promise<void> {
    try {
      const token = await this.getValidToken();
      const userId = await this.prefs.retrieveData<string>("userId");
      if (!userId) {
        throw new Error("No userId found");
      }

      const response = await fetch(`${this.dbUrl}/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tableName: "Users",
          records: [
            {
              userId,
              email,
              rol: "estudiante",
            },
          ],
        }),
      });

      if (response.status === 201) {
        console.log("Usuario agregado exitosamente a la tabla Users");
        return;
      }

      const body = await response.json();
      const errorMessage = body?.message ?? `Unexpected status ${response.status}`;
      throw new Error(`AddUser error: ${errorMessage}`);
    } catch (e: any) {
      console.error("Add user failed", e);
      throw e;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken =
        await this.prefs.retrieveData<string>("refreshToken");
      if (!refreshToken) {
        console.warn("Refresh token failed", "No refresh token found");
        return false;
      }
      const response = await fetch(`${this.baseUrl}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.status === 201) {
        const data = await response.json();
        const newToken = data["accessToken"];
        await this.prefs.storeData("token", newToken);
        console.log("Token refreshed successfully");
        return true;
      } else {
        const body = await response.json();
        throw new Error(`Refresh token error: ${body.message}`);
      }
    } catch (e: any) {
      console.error("Refresh token failed", e);
      throw e;
    }
  }
  public async getValidToken(): Promise<string> {
    let token = await this.prefs.retrieveData<string>("token");

    if (!token) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error("No se pudo refrescar");
      token = await this.prefs.retrieveData<string>("token");
    }

    return token!;
  }
  async verifyToken(): Promise<boolean> {
    try {
      const token = await this.prefs.retrieveData<string>("token");
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/verify-token`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log("Token is valid");
        return true;
      } else {
        const body = await response.json();
        console.error(`Token verification error: ${body.message}`);
        return false;
      }
    } catch (e: any) {
      console.error("Verify token failed", e);
      return false;
    }
  }

}