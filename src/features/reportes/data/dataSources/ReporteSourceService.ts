// src/features/reportes/data/dataSources/ReporteSourceService.ts

import { IReporteSource } from "./IReporteSource";

import { ReporteGrupalPorCategoriaModel } from "../models/ReporteGrupalPorCategoriaModel";
import { ReporteGrupalPorEvaluacionModel } from "../models/ReporteGrupalPorEvaluacionModel";
import { ReportePersonalPorCategoriaModel } from "../models/ReportePersonalPorCategoriaModel";
import { ReportePersonalPorEvaluacionModel } from "../models/ReportePersonalPorEvaluacionModel";
import { ReportePromedioPersonalPorCategoriaModel } from "../models/ReportePromedioPersonalPorCategoriaModel";

import { AuthenticatioSourceService } from "@/src/features/auth/data/dataSources/authenticationSourceService";
import { ILocalPreferences } from "@/src/core/iLocalPreferences";

const BASE_URL = "https://roble-api.openlab.uninorte.edu.co";

export class ReporteSourceService implements IReporteSource {
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
    private async getToken(): Promise<string> {
        return await this.authService.getValidToken();
    }
    // ==========================
    // CREATE
    // ==========================

    async createReporteGrupalPorCategoria({
        idCategoria,
        idGrupo,
        nota,
        idCurso,
    }: {
        idCategoria: string;
        idGrupo: string;
        nota: string;
        idCurso: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();
            const id = Date.now() + idCategoria + idGrupo;

            const res = await fetch(
                `${this.baseUrl}/database/${this.projectId}/insert`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tableName: "reporteGrupalPorCategoria",
                        records: [
                            {
                                idReporteGrupalPorCategoria: id,
                                idCategoria,
                                idGrupo,
                                nota,
                                idCurso,
                            },
                        ],
                    }),
                }
            );

            // 🔥 VALIDACIÓN CRÍTICA (equivalente a Flutter)
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error al crear reporteGrupalPorCategoria: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            // 🔥 LOG + PROPAGACIÓN (igual que Flutter con logError + rethrow)
            console.error("Error en createReporteGrupalPorCategoria:", error);
            throw error;
        }
    }

    async createReporteGrupalPorEvaluacion({
        idEvaluacion,
        idGrupo,
        nota,
    }: {
        idEvaluacion: string;
        idGrupo: string;
        nota: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();
            const id = Date.now() + idEvaluacion + idGrupo;

            const res = await fetch(
                `${this.baseUrl}/database/${this.projectId}/insert`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tableName: "reporteGrupalPorEvaluacion",
                        records: [
                            {
                                idReporteGrupalPorEvaluacion: id,
                                idEvaluacion,
                                idGrupo,
                                nota,
                            },
                        ],
                    }),
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error al crear reporteGrupalPorEvaluacion: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error("Error en createReporteGrupalPorEvaluacion:", error);
            throw error;
        }
    }
    async createReportePersonalPorCategoria({
        idCategoria,
        idEstudiante,
        notaPuntualidad,
        notaContribucion,
        notaActitud,
        notaCompromiso,
    }: {
        idCategoria: string;
        idEstudiante: string;
        notaPuntualidad: string;
        notaContribucion: string;
        notaActitud: string;
        notaCompromiso: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();
            const id = Date.now() + idCategoria + idEstudiante;

            const res = await fetch(
                `${this.baseUrl}/database/${this.projectId}/insert`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tableName: "reportePersonalPorCategoria",
                        records: [
                            {
                                idReportePersonalPorCategoria: id,
                                idCategoria,
                                idEstudiante,
                                notaPuntualidad,
                                notaContribucion,
                                notaActitud,
                                notaCompromiso,
                            },
                        ],
                    }),
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error al crear reportePersonalPorCategoria: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error("Error en createReportePersonalPorCategoria:", error);
            throw error;
        }
    }
    async createReportePersonalPorEvaluacion({
        idEvaluacion,
        idEstudiante,
        notaPuntualidad,
        notaContribucion,
        notaActitud,
        notaCompromiso,
    }: {
        idEvaluacion: string;
        idEstudiante: string;
        notaPuntualidad: string;
        notaContribucion: string;
        notaActitud: string;
        notaCompromiso: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();
            const id = Date.now() + idEvaluacion + idEstudiante;

            const res = await fetch(
                `${this.baseUrl}/database/${this.projectId}/insert`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tableName: "reportePersonalPorEvaluacion",
                        records: [
                            {
                                idReportePersonalPorEvaluacion: id,
                                idEvaluacion,
                                idEstudiante,
                                notaPuntualidad,
                                notaContribucion,
                                notaActitud,
                                notaCompromiso,
                            },
                        ],
                    }),
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error al crear reportePersonalPorEvaluacion: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error("Error en createReportePersonalPorEvaluacion:", error);
            throw error;
        }
    }
    async createReportePromedioPersonalPorCategoria({
        idCategoria,
        idEstudiante,
        nota,
        idCurso,
    }: {
        idCategoria: string;
        idEstudiante: string;
        nota: string;
        idCurso: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();
            const id = Date.now() + idCategoria + idEstudiante + idCurso;

            const res = await fetch(
                `${this.baseUrl}/database/${this.projectId}/insert`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tableName: "reportePromedioPersonalPorCategoria",
                        records: [
                            {
                                idReportePromedioPersonalPorCategoria: id,
                                idCategoria,
                                idEstudiante,
                                nota,
                                idCurso,
                            },
                        ],
                    }),
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error al crear reportePromedioPersonalPorCategoria: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error(
                "Error en createReportePromedioPersonalPorCategoria:",
                error
            );
            throw error;
        }
    }


    // ==========================
    // GET INDIVIDUALES
    // ==========================

    async getReportePersonalPorCategoria({
        idEstudiante,
        idCategoria,
    }: {
        idEstudiante: string;
        idCategoria: string;
    }): Promise<ReportePersonalPorCategoriaModel> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reportePersonalPorCategoria&idEstudiante=${idEstudiante}&idCategoria=${idCategoria}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP getReportePersonalPorCategoria: ${res.status}`);
        }
        const data = await res.json();

        if (!data || data.length === 0) {
            throw new Error("No se encontró el registro");
        }

        const e = data[0];

        return ReportePersonalPorCategoriaModel.fromJson({
            idReportePersonal: e.idReportePersonalPorCategoria,
            idCategoria: e.idCategoria,
            idEstudiante: e.idEstudiante,
            notaPuntualidad: e.notaPuntualidad,
            notaContribucion: e.notaContribucion,
            notaActitud: e.notaActitud,
            notaCompromiso: e.notaCompromiso,
        });
    }

    async getReportePersonalPorEvaluacion({
        idEstudiante,
        idEvaluacion,
    }: {
        idEstudiante: string;
        idEvaluacion: string;
    }): Promise<ReportePersonalPorEvaluacionModel> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reportePersonalPorEvaluacion&idEstudiante=${idEstudiante}&idEvaluacion=${idEvaluacion}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP getReportePersonalPorEvaluacion: ${res.status}`);
        }
        const data = await res.json();

        if (!data || data.length === 0) {
            throw new Error("No se encontró el registro");
        }

        const e = data[0];

        return ReportePersonalPorEvaluacionModel.fromJson({
            idReportePersonal: e.idReportePersonalPorEvaluacion,
            idEvaluacion: e.idEvaluacion,
            idEstudiante: e.idEstudiante,
            notaPuntualidad: e.notaPuntualidad,
            notaContribucion: e.notaContribucion,
            notaActitud: e.notaActitud,
            notaCompromiso: e.notaCompromiso,
        });
    }

    async getReporteGrupalPorCategoria(
        idCategoria: string,
        idGrupo: string
    ): Promise<ReporteGrupalPorCategoriaModel> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reporteGrupalPorCategoria&idCategoria=${idCategoria}&idGrupo=${idGrupo}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP getReporteGrupalPorCategoria: ${res.status}`);
        }
        const data = await res.json();

        if (!data || data.length === 0) {
            throw new Error("No se encontró el registro");
        }

        const e = data[0];
        return ReporteGrupalPorCategoriaModel.fromJson({
            idReporteGrupal: e.idReporteGrupalPorCategoria,
            idCategoria: e.idCategoria,
            idGrupo: e.idGrupo,
            nota: e.nota,
            idCurso: e.idCurso,
        });
    }

    async getReporteGrupalPorEvaluacion(
        idEvaluacion: string,
        idGrupo: string
    ): Promise<ReporteGrupalPorEvaluacionModel> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reporteGrupalPorEvaluacion&idEvaluacion=${idEvaluacion}&idGrupo=${idGrupo}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP getReporteGrupalPorEvaluacion: ${res.status}`);
        }
        const data = await res.json();

        if (!data || data.length === 0) {
            throw new Error("No se encontró el registro");
        }

        const e = data[0];
        return ReporteGrupalPorEvaluacionModel.fromJson({
            idReporteGrupal: e.idReporteGrupalPorEvaluacion,
            idEvaluacion: e.idEvaluacion,
            idGrupo: e.idGrupo,
            nota: e.nota,
        });
    }

    async getReportePromedioPersonalPorCategoria(
        idCategoria: string,
        idEstudiante: string
    ): Promise<ReportePromedioPersonalPorCategoriaModel> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reportePromedioPersonalPorCategoria&idCategoria=${idCategoria}&idEstudiante=${idEstudiante}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP getReportePromedioPersonalPorCategoria: ${res.status}`);
        }
        const data = await res.json();

        if (!data || data.length === 0) {
            throw new Error("No se encontró el registro");
        }

        const e = data[0];
        return ReportePromedioPersonalPorCategoriaModel.fromJson({
            idReportePromedioPersonal:
                e.idReportePromedioPersonalPorCategoria,
            idCategoria: e.idCategoria,
            idEstudiante: e.idEstudiante,
            nota: e.nota,
            idCurso: e.idCurso,
        });
    }

    // ==========================
    // LISTAS
    // ==========================

    async getReportesGrupalesPorCategoria(
        idCurso: string
    ): Promise<ReporteGrupalPorCategoriaModel[]> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reporteGrupalPorCategoria&idCurso=${idCurso}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP getReportesGrupalesPorCategoria: ${res.status}`);
        }
        const data = await res.json();
        if (!data || data.length === 0) {
            return [];
        }
        return data.map((e: any) =>
            ReporteGrupalPorCategoriaModel.fromJson({
                idReporteGrupal: e.idReporteGrupalPorCategoria,
                idCategoria: e.idCategoria,
                idGrupo: e.idGrupo,
                nota: e.nota,
                idCurso: e.idCurso,
            })
        );
    }

    async getReportesGrupalesPorEvaluacion(
        idEvaluacion: string
    ): Promise<ReporteGrupalPorEvaluacionModel[]> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reporteGrupalPorEvaluacion&idEvaluacion=${idEvaluacion}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP getReportesGrupalesPorEvaluacion: ${res.status}`);
        }
        const data = await res.json();
        if (!data || data.length === 0) {
            return [];
        }
        return data.map((e: any) =>
            ReporteGrupalPorEvaluacionModel.fromJson({
                idReporteGrupal: e.idReporteGrupalPorEvaluacion,
                idEvaluacion: e.idEvaluacion,
                idGrupo: e.idGrupo,
                nota: e.nota,
            })
        );
    }

    async getReportesPersonalPorEvaluacion(
        idEvaluacion: string
    ): Promise<ReportePersonalPorEvaluacionModel[]> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reportePersonalPorEvaluacion&idEvaluacion=${idEvaluacion}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP en getReportesPersonalPorEvaluacion: ${res.status}`);
        }
        const data = await res.json();
        if (!data || data.length === 0) {
            return [];
        }
        return data.map((e: any) =>
            ReportePersonalPorEvaluacionModel.fromJson({
                idReportePersonal: e.idReportePersonalPorEvaluacion,
                idEvaluacion: e.idEvaluacion,
                idEstudiante: e.idEstudiante,
                notaPuntualidad: e.notaPuntualidad,
                notaContribucion: e.notaContribucion,
                notaActitud: e.notaActitud,
                notaCompromiso: e.notaCompromiso,
            })
        );
    }

    async getReportesPersonalPorCategoria(
        idCategoria: string
    ): Promise<ReportePersonalPorCategoriaModel[]> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reportePersonalPorCategoria&idCategoria=${idCategoria}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP en getReportesPersonalPorCategoria: ${res.status}`);
        }
        const data = await res.json();
        if (!data || data.length === 0) {
            return [];
        }
        return data.map((e: any) =>
            ReportePersonalPorCategoriaModel.fromJson({
                idReportePersonal: e.idReportePersonalPorCategoria,
                idCategoria: e.idCategoria,
                idEstudiante: e.idEstudiante,
                notaPuntualidad: e.notaPuntualidad,
                notaContribucion: e.notaContribucion,
                notaActitud: e.notaActitud,
                notaCompromiso: e.notaCompromiso,
            })
        );
    }

    async getReportesPromedioPersonalCategoriaTodos(
        idCurso: string
    ): Promise<ReportePromedioPersonalPorCategoriaModel[]> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reportePromedioPersonalPorCategoria&idCurso=${idCurso}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Error HTTP en getReportesPromedioPersonalCategoriaTodos: ${res.status}`);
        }
        const data = await res.json();
        if (!data || data.length === 0) {
            return [];
        }
        return data.map((e: any) =>
            ReportePromedioPersonalPorCategoriaModel.fromJson({
                idReportePromedioPersonal:
                    e.idReportePromedioPersonalPorCategoria,
                idCategoria: e.idCategoria,
                idEstudiante: e.idEstudiante,
                nota: e.nota,
                idCurso: e.idCurso,
            })
        );
    }

    async getReportesGrupalesTodos(
        idCurso: string
    ): Promise<ReporteGrupalPorCategoriaModel[]> {
        const token = await this.getToken();

        const res = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=reporteGrupalPorCategoria&idCurso=${idCurso}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
            throw new Error(`Error al obtener reportes: ${res.status}`);
        }

        const data = await res.json();
        if (!data || data.length === 0) {
            return [];
        }
        return data.map((e: any) =>
            ReporteGrupalPorCategoriaModel.fromJson({
                idReporteGrupal: e.idReporteGrupalPorCategoria,
                idCategoria: e.idCategoria,
                idGrupo: e.idGrupo,
                nota: e.nota,
                idCurso: e.idCurso,
            })
        );
    }

    // ==========================
    // UPDATE
    // ==========================

    async updateReporteGrupalPorEvaluacion({
        idEvaluacion,
        idGrupo,
        nota,
    }: {
        idEvaluacion: string;
        idGrupo: string;
        nota: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();

            const reporte = await this.getReporteGrupalPorEvaluacion(
                idEvaluacion,
                idGrupo
            );

            const res = await fetch(`${this.baseUrl}/database/${this.projectId}/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "reporteGrupalPorEvaluacion",
                    idColumn: "idReporteGrupalPorEvaluacion",
                    idValue: reporte.idReporteGrupal,
                    updates: { nota },
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error en updateReporteGrupalPorEvaluacion: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error("Error en updateReporteGrupalPorEvaluacion:", error);
            throw error;
        }
    }

    async updateReporteGrupalPorCategoria({
        idCategoria,
        idGrupo,
        nota,
    }: {
        idCategoria: string;
        idGrupo: string;
        nota: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();

            const reporte = await this.getReporteGrupalPorCategoria(
                idCategoria,
                idGrupo
            );

            const res = await fetch(`${this.baseUrl}/database/${this.projectId}/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "reporteGrupalPorCategoria",
                    idColumn: "idReporteGrupalPorCategoria",
                    idValue: reporte.idReporteGrupal,
                    updates: { nota },
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error en updateReporteGrupalPorCategoria: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error("Error en updateReporteGrupalPorCategoria:", error);
            throw error;
        }
    }
    async updateReportePromedioPersonalPorCategoria({
        idCategoria,
        idEstudiante,
        nota,
    }: {
        idCategoria: string;
        idEstudiante: string;
        nota: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();

            const reporte =
                await this.getReportePromedioPersonalPorCategoria(
                    idCategoria,
                    idEstudiante
                );

            const res = await fetch(`${this.baseUrl}/database/${this.projectId}/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "reportePromedioPersonalPorCategoria",
                    idColumn: "idReportePromedioPersonalPorCategoria",
                    idValue: reporte.idReportePromedioPersonal,
                    updates: { nota },
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error en updateReportePromedioPersonalPorCategoria: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error(
                "Error en updateReportePromedioPersonalPorCategoria:",
                error
            );
            throw error;
        }
    }

    async updateReportePersonalPorEvaluacion({
        idEvaluacion,
        idEstudiante,
        notaPuntualidad,
        notaContribucion,
        notaActitud,
        notaCompromiso,
    }: {
        idEvaluacion: string;
        idEstudiante: string;
        notaPuntualidad: string;
        notaContribucion: string;
        notaActitud: string;
        notaCompromiso: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();

            const reporte = await this.getReportePersonalPorEvaluacion({
                idEvaluacion,
                idEstudiante,
            });

            const res = await fetch(`${this.baseUrl}/database/${this.projectId}/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "reportePersonalPorEvaluacion",
                    idColumn: "idReportePersonalPorEvaluacion",
                    idValue: reporte.idReportePersonal,
                    updates: {
                        notaPuntualidad,
                        notaContribucion,
                        notaActitud,
                        notaCompromiso,
                    },
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error en updateReportePersonalPorEvaluacion: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error("Error en updateReportePersonalPorEvaluacion:", error);
            throw error;
        }
    }

    async updateReportePersonalPorCategoria({
        idCategoria,
        idEstudiante,
        notaPuntualidad,
        notaContribucion,
        notaActitud,
        notaCompromiso,
    }: {
        idCategoria: string;
        idEstudiante: string;
        notaPuntualidad: string;
        notaContribucion: string;
        notaActitud: string;
        notaCompromiso: string;
    }): Promise<void> {
        try {
            const token = await this.getToken();

            const reporte = await this.getReportePersonalPorCategoria({
                idCategoria,
                idEstudiante,
            });

            const res = await fetch(`${this.baseUrl}/database/${this.projectId}/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "reportePersonalPorCategoria",
                    idColumn: "idReportePersonalPorCategoria",
                    idValue: reporte.idReportePersonal,
                    updates: {
                        notaPuntualidad,
                        notaContribucion,
                        notaActitud,
                        notaCompromiso,
                    },
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Error en updateReportePersonalPorCategoria: ${res.status} - ${errorText}`
                );
            }

        } catch (error) {
            console.error("Error en updateReportePersonalPorCategoria:", error);
            throw error;
        }
    }
}