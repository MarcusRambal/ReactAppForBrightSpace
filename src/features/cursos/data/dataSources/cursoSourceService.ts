// src/features/cursos/data/dataSources/cursoSourceService.ts

import { IcursoSource } from "./IcursoSource";
import { CursoCurso, CursoCursoMapper } from "../../domain/entities/CursoCurso";
import { CursoMatriculado, CursoMatriculadoMapper } from "../../domain/entities/CursoMatriculado";
import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { AuthenticatioSourceService } from "@/src/features/auth/data/dataSources/authenticationSourceService";

export class CursoSourceService implements IcursoSource {
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

    // 🔑 Obtener token
    private async getValidToken(): Promise<string> {
        return await this.authService.getValidToken();
    }

    // 🟢 CREATE
    async createCurso(idCurso: string, nom: string): Promise<void> {
        const token = await this.getValidToken();
        const idProfe = await this.prefs.retrieveData<string>("userId");

        if (!idProfe) throw new Error("Usuario no autenticado");

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/insert`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tableName: "Cursos",
                    records: [
                        {
                            idcurso: idCurso,
                            idprofe: idProfe,
                            nom: nom,
                        },
                    ],
                }),
            }
        );

        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Error al crear curso");
        }
    }

    // 🔵 READ (Profesor)
    async getCursosByProfe(): Promise<CursoCurso[]> {
        const token = await this.getValidToken();
        const idProfe = await this.prefs.retrieveData<string>("userId");

        if (!idProfe) throw new Error("Usuario no autenticado");

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=Cursos&idprofe=${idProfe}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            const data = await response.json();
            return data.map((item: any) =>
                CursoCursoMapper.fromJson(item)
            );
        } else {
            const body = await response.json();
            throw new Error(body.message || "Error al obtener cursos en getCursosByProfe en sourceServices");
        }

        throw new Error("Error al obtener cursos");
    }

    // 🟡 UPDATE
    async updateCurso(curso: CursoCurso, nomNuevo: string): Promise<void> {
        const token = await this.getValidToken();

        const readResp = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=Cursos&idcurso=${curso.id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (readResp.status !== 200) {
            throw new Error("Error al buscar curso en UpdateCurso sourceService");
        }

        const cursos = await readResp.json();
        if (!cursos.length) {
            throw new Error("Curso no encontrado en UpdateCurso sourceService");
        }

        const cursoDbId = cursos[0]._id;

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/update`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tableName: "Cursos",
                    idColumn: "_id",
                    idValue: cursoDbId,
                    updates: { nom: nomNuevo },
                }),
            }
        );

        if (response.status !== 200) {
            throw new Error("Error al actualizar curso");
        }
    }

    // 🔴 DELETE
    async deleteCurso(idCurso: string): Promise<void> {
        const token = await this.getValidToken();

        await this.vaciarContenidoCurso(idCurso);

        await this.deleteByPK("Cursos", "idcurso", idCurso, token);
    }

    // 🧹 (simplificado por ahora)
// 🧹 VACIAR CONTENIDO PROTEGIDO
    async vaciarContenidoCurso(idCurso: string): Promise<void> {
        const token = await this.getValidToken();

        // 1. Categorías del curso
        const respCat = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=Categoria&idCurso=${idCurso}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (respCat.status !== 200) return;

        const categorias = await respCat.json();

        // 🔥 PROTECCIÓN CRÍTICA: Si la API no devuelve un arreglo, abortamos el vaciado y pasamos a borrar el curso
        if (!Array.isArray(categorias)) return;

        for (const cat of categorias) {
            const idCat = String(cat.idcat);

            // 2. Grupos
            const respGrupos = await fetch(
                `${this.baseUrl}/database/${this.projectId}/read?tableName=Grupos&idCat=${idCat}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (respGrupos.status === 200) {
                const grupos = await respGrupos.json();
                
                // 🔥 PROTECCIÓN DE GRUPOS
                if (Array.isArray(grupos)) {
                    for (const grupo of grupos) {
                        await this.deleteByPK("Grupos", "idGrupo", grupo.idGrupo, token);
                    }
                }
            }

            // 3. Borrar categoría
            await this.deleteByPK("Categoria", "idcat", idCat, token);
        }
    }
    async getCursosByEstudiante(emailEstudiante: string): Promise<CursoMatriculado[]> {
        const token = await this.getValidToken();

        // 1. Obtener grupos del estudiante
        const respGrupos = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=Grupos&Correo=${emailEstudiante}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (respGrupos.status !== 200) {
            throw new Error("Error al buscar los cursos del estudiante");
        }

        const grupos = await respGrupos.json();
        if (!grupos.length) return [];

        const mapaCursos: Record<string, CursoMatriculado> = {};

        for (const grupo of grupos) {
            const idCat = String(grupo.idCat);
            const nombreGrupo = String(grupo.nombre);

            // 2. Buscar categoría
            const respCat = await fetch(
                `${this.baseUrl}/database/${this.projectId}/read?tableName=Categoria&idcat=${idCat}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (respCat.status !== 200) continue;

            const categoriaJson = await respCat.json();
            if (!categoriaJson.length) continue;

            const idCurso = String(categoriaJson[0].idCurso);
            const nombreCategoria = String(categoriaJson[0].nombre);

            // 3. Si no existe el curso → lo traemos
            if (!mapaCursos[idCurso]) {
                const respCurso = await fetch(
                    `${this.baseUrl}/database/${this.projectId}/read?tableName=Cursos&idcurso=${idCurso}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (respCurso.status === 200) {
                    const cursoJson = await respCurso.json();
                    if (cursoJson.length) {
                        mapaCursos[idCurso] = {
                            curso: CursoCursoMapper.fromJson(cursoJson[0]),
                            grupos: [],
                            evaluacionesPendientes: 0,
                        };
                    }
                }
            }

            // 4. Agregar grupo al curso
            if (mapaCursos[idCurso]) {
                mapaCursos[idCurso].grupos.push({
                    idCat,
                    categoriaNombre: nombreCategoria,
                    grupoNombre: nombreGrupo,
                });
            }
        }

        return Object.values(mapaCursos);
    }
    private async deleteByPK(
        tableName: string,
        pkColumn: string,
        pkValue: string,
        token: string
    ): Promise<void> {
        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tableName,
                    idColumn: pkColumn,
                    idValue: pkValue,
                }),
            }
        );

        if (response.status !== 200) {
            console.error(`Error borrando en ${tableName}`);
        }
    }
    async getCompanerosDeGrupo(
        idCat: string,
        nombreGrupo: string
    ): Promise<string[]> {
        const token = await this.getValidToken();

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=Grupos&idCat=${idCat}&nombre=${nombreGrupo}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            const data = await response.json();

            return data.map((item: any) => item.Correo.toString());
        }

        throw new Error("Error al obtener compañeros");
    }
    async getCategoriasByCurso(
        idCurso: string
    ): Promise<any[]> {
        const token = await this.getValidToken();

        const response = await fetch(
            `${this.baseUrl}/database/${this.projectId}/read?tableName=Categoria&idCurso=${idCurso}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            return await response.json();
        }

        throw new Error("Error al obtener las categorías del curso");
    }
    async getDatosDeGruposPorCategoria(
        idCat: string
    ): Promise<any[]> {
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
            return await response.json();
        }

        throw new Error("Error al obtener los integrantes de la categoría");
    }
}