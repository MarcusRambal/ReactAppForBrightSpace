import { IGrupoSource } from "./IGrupoSource";
import { GrupoIntegranteModel } from "../models/GrupoIntegranteModel";
import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { AuthenticatioSourceService } from "@/src/features/auth/data/dataSources/authenticationSourceService";

export class GrupoSourceService implements IGrupoSource {
  private readonly baseUrl: string;
  private readonly projectId: string;
  private prefs: ILocalPreferences;
  private authService: AuthenticatioSourceService;

  constructor(
    prefs: ILocalPreferences,
    authService: AuthenticatioSourceService,
    projectId = process.env.EXPO_PUBLIC_ROBLE_PROJECT_ID
  ) {
    if (!projectId) {
      throw new Error("Missing EXPO_PUBLIC_ROBLE_PROJECT_ID env var");
    }

    this.projectId = projectId;
    this.baseUrl = "https://roble-api.openlab.uninorte.edu.co";
    this.prefs = prefs;
    this.authService = authService;
  }

  private async getValidToken(): Promise<string> {
    return await this.authService.getValidToken();
  }

  async getGruposPorCategoria(idCat: string): Promise<GrupoIntegranteModel[]> {
    const token = await this.getValidToken();

    const response = await fetch(
      `${this.baseUrl}/database/${this.projectId}/read?tableName=Grupos&idCat=${idCat}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.map((item: any) => GrupoIntegranteModel.fromJson(item));
    }

    throw new Error("Error al obtener los grupos de la categoría");
  }

  async createCategoria(idCurso: string, nombreCat: string): Promise<string> {
    const token = await this.getValidToken();
    const idCat = Date.now().toString() + Math.floor(Math.random() * 1000).toString();

    const response = await fetch(`${this.baseUrl}/database/${this.projectId}/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tableName: "Categoria",
        records: [{ idcat: idCat, idCurso: idCurso, nombre: nombreCat }],
      }),
    });

    if (response.status === 200 || response.status === 201) return idCat;
    throw new Error("Error creando categoría");
  }

  async createGruposBatch(loteEstudiantes: any[]): Promise<void> {
    const token = await this.getValidToken();
    const response = await fetch(`${this.baseUrl}/database/${this.projectId}/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tableName: "Grupos",
        records: loteEstudiantes,
      }),
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error insertando grupos en Roble");
    }
  }
}