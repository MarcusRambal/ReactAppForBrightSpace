// src/features/evaluaciones/data/dataSources/evaluacionSourceService.ts

import { IEvaluacionSource } from "./IEvaluacionSource";
import { EvaluacionEntity } from "../../domain/entities/EvaluacionEntity";
import { PreguntaEntity } from "../../domain/entities/PreguntaEntity";
import { RespuestaEntity } from "../../domain/entities/RespuestaEntity";

import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";

import { AuthenticatioSourceService } from "@/src/features/auth/data/dataSources/authenticationSourceService";

export class EvaluacionSourceService implements IEvaluacionSource {
    private readonly projectId: string;
    private readonly baseUrl: string;
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

    // 🔑 Obtener token
    private async getValidToken(): Promise<string> {
        return await this.authService.getValidToken();
    }

    // -------------------------------
    // CREATE EVALUACION
    // -------------------------------
    async createEvaluacion(
        idCategoria: string,
        tipo: string,
        fechaCreacion: string,
        fechaFinalizacion: string,
        nom: string,
        esPrivada: boolean
    ): Promise<string> {
        const token = await this.getValidToken();

        const idEvaluacion = Date.now().toString();

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/insert`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "evaluacion",
                    records: [
                        {
                            idEvaluacion,
                            idCategoria,
                            tipo: esPrivada ? "Privada" : tipo,
                            fechaCreacion,
                            fechaFinalizacion,
                            nom,
                        },
                    ],
                }),
            }
        );

        if (response.status === 200 || response.status === 201) {
            return idEvaluacion;
        }

        const body = await response.text();
        throw new Error("Error al crear evaluación: " + body);
    }

    // -------------------------------
    // GET EVALUACIONES
    // -------------------------------
    async getEvaluacionesByProfe(
        idCategoria: string
    ): Promise<EvaluacionEntity[]> {
        const token = await this.getValidToken();

        const url = `${this.baseUrl}/database/${this.projectId}/read?tableName=evaluacion&idCategoria=${idCategoria}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();

            return data.map((e: any) => ({
                id: String(e.idEvaluacion ?? e.id ?? ""),
                idCategoria: String(e.idCategoria ?? ""),
                tipo: String(e.tipo ?? ""),
                nom: String(e.nom ?? ""),
                fechaCreacion: new Date(e.fechaCreacion),
                fechaFinalizacion: new Date(e.fechaFinalizacion),
                esPrivada: e.tipo === "Privada",
            }));
        }

        const body = await response.text();
        throw new Error("Error al obtener evaluaciones: " + body);
    }

    // -------------------------------
    // CREATE RESPUESTAS
    // -------------------------------
    async createRespuestas(respuestas: RespuestaEntity[]): Promise<void> {
        const token = await this.getValidToken();

        const records = respuestas.map((r) => ({
            idRespuesta:
                Date.now().toString() +
                r.idPregunta +
                r.idEvaluacion +
                r.idEvaluado +
                r.idEvaluador,
            idEvaluacion: r.idEvaluacion,
            idEvaluador: r.idEvaluador,
            idEvaluado: r.idEvaluado,
            idPregunta: r.idPregunta,
            tipo: r.tipo,
            valor_comentario: r.valorComentario,
        }));

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/insert`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "respuesta",
                    records,
                }),
            }
        );

        if (response.status !== 200 && response.status !== 201) {
            const body = await response.text();
            throw new Error("Error al crear respuestas: " + body);
        }
    }

    // -------------------------------
    // YA EVALUO
    // -------------------------------
    async yaEvaluo(
        idEvaluacion: string,
        idEvaluador: string,
        idEvaluado: string
    ): Promise<boolean> {
        const token = await this.getValidToken();

        const userId = await this.prefs.retrieveData<string>("userId");
        if (!userId) throw new Error("Usuario no autenticado");

        idEvaluador = userId;

        const url = `${this.baseUrl}/database/${this.projectId}/read?tableName=respuesta&idEvaluacion=${idEvaluacion}&idEvaluador=${idEvaluador}&idEvaluado=${idEvaluado}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();

            if (Array.isArray(data)) {
                return data.length > 0;
            }

            if (data?.data && Array.isArray(data.data)) {
                return data.data.length > 0;
            }

            return false;
        }

        const body = await response.text();
        throw new Error("Error al validar evaluación: " + body);
    }

    // -------------------------------
    // GET PREGUNTAS
    // -------------------------------
    async getPreguntas(): Promise<PreguntaEntity[]> {
        const token = await this.getValidToken();

        const url = `${this.baseUrl}/database/${this.projectId}/read?tableName=Pregunta`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();

            return data.map((e: any) => ({
                idPregunta: String(e.idPregunta),
                tipo: String(e.tipo),
                pregunta: String(e.pregunta),
            }));
        }

        const body = await response.text();
        throw new Error("Error al obtener preguntas: " + body);
    }

    // -------------------------------
    // GET NOTAS
    // -------------------------------
    async getNotasPorEvaluado(
        idEvaluacion: string,
        idEvaluado: string,
        tipo: string
    ): Promise<string[]> {
        const token = await this.getValidToken();

        const url = `${this.baseUrl}/database/${this.projectId}/read?tableName=respuesta&idEvaluacion=${idEvaluacion}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const records = await response.json();

            const filtradas = records.filter((e: any) => {
                const dbEvaluado = (e.idEvaluado ?? "").toLowerCase().trim();
                const dbTipo = (e.tipo ?? "").toLowerCase().trim();
                const miTipo = tipo.toLowerCase().trim();

                return (
                    dbEvaluado === idEvaluado.toLowerCase().trim() &&
                    dbTipo.includes(miTipo)
                );
            });

            return filtradas.map((e: any) =>
                String(e.valor_comentario ?? "")
            );
        }

        return [];
    }

    // -------------------------------
    // UPDATE PRIVACIDAD
    // -------------------------------
    async updatePrivacidad(
        idEvaluacion: string,
        esPrivada: boolean
    ): Promise<void> {
        const token = await this.getValidToken();

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/update`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableName: "evaluacion",
                    idColumn: "idEvaluacion",
                    idValue: idEvaluacion,
                    updates: {
                        tipo: esPrivada ? "Privada" : "General",
                    },
                }),
            }
        );

        if (response.status !== 200 && response.status !== 201) {
            const body = await response.text();
            throw new Error("Error al actualizar privacidad: " + body);
        }
    }
}