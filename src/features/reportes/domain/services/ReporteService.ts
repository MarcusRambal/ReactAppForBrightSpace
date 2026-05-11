// src/features/reportes/domain/services/ReporteService.ts

import { IReporteSource } from "../../data/dataSources/IReporteSource";
import { IEvaluacionSource } from "@/src/features/evaluaciones/data/dataSources/IEvaluacionSource";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

import { ReportePromedioPersonalPorCategoriaModel } from "../../data/models/ReportePromedioPersonalPorCategoriaModel";
import { ReporteGrupalPorCategoriaModel } from "../../data/models/ReporteGrupalPorCategoriaModel";

export class ReporteService {
    constructor(
        private evaluacionSource: IEvaluacionSource,
        private reporteSource: IReporteSource,
        private cursoRepository: ICursoRepository
    ) { }

    // ==============================
    // 🔢 PROMEDIO
    // ==============================

    calcularPromedio(notas: string[]): number {
        if (!notas.length) return 0;
        const numeros = notas.map((e) => parseFloat(e) || 0);
        return numeros.reduce((a, b) => a + b, 0) / numeros.length;
    }

    // ==============================
    // 📊 PROMEDIOS POR EVALUACION
    // ==============================

    async obtenerPromediosPorEvaluacion({
        idEvaluacion,
        idEstudiante,
    }: {
        idEvaluacion: string;
        idEstudiante: string;
    }): Promise<Record<string, string>> {

        const tipos = ["Puntualidad", "Contribuciones", "Actitud", "Compromiso"];
        const promedios: Record<string, string> = {};

        for (const tipo of tipos) {
            const notas = await this.evaluacionSource.getNotasPorEvaluado(
                idEvaluacion,
                idEstudiante,
                tipo
            );

            promedios[tipo] = this.calcularPromedio(notas).toString();
        }

        return promedios;
    }
    // ==============================
    // 📊 PROMEDIOS POR CATEGORIA
    // ==============================

    async obtenerPromediosPorCategoria(params: {
        idCategoria: string;
        idEstudiante: string;
    }): Promise<Record<string, string>> {
        const { idCategoria, idEstudiante } = params;

        const evaluaciones =
            await this.evaluacionSource.getEvaluacionesByProfe(idCategoria);

        if (!evaluaciones.length) {
            return {
                Puntualidad: "0",
                Contribuciones: "0",
                Actitud: "0",
                Compromiso: "0",
            };
        }

        const p: number[] = [];
        const c: number[] = [];
        const a: number[] = [];
        const co: number[] = [];

        for (const evalItem of evaluaciones) {
            const idEval = String(evalItem.id);

            try {
                const reporte =
                    await this.reporteSource.getReportePersonalPorEvaluacion({
                        idEstudiante,
                        idEvaluacion: idEval,
                    });

                p.push(parseFloat(reporte.notaPuntualidad) || 0);
                c.push(parseFloat(reporte.notaContribucion) || 0);
                a.push(parseFloat(reporte.notaActitud) || 0);
                co.push(parseFloat(reporte.notaCompromiso) || 0);
            } catch {
                continue;
            }
        }

        const promedio = (lista: number[]) =>
            lista.length
                ? lista.reduce((a, b) => a + b, 0) / lista.length
                : 0;

        return {
            Puntualidad: promedio(p).toString(),
            Contribuciones: promedio(c).toString(),
            Actitud: promedio(a).toString(),
            Compromiso: promedio(co).toString(),
        };
    }

    // ==============================
    // 🔁 UPSERT PERSONAL EVALUACION
    // ==============================

    async upsertReportePersonalPorEvaluacion({
        idEvaluacion,
        idEstudiante,
    }: {
        idEvaluacion: string;
        idEstudiante: string;
    }) {
        const promedios = await this.obtenerPromediosPorEvaluacion({
            idEvaluacion,
            idEstudiante,
        });

        const existente =
            await this.reporteSource.getReportePersonalPorEvaluacion({
                idEvaluacion,
                idEstudiante,
            }).catch(() => null);

        if (existente) {
            await this.reporteSource.updateReportePersonalPorEvaluacion({
                idReportePersonal: existente.idReportePersonal,
                idEvaluacion,
                idEstudiante,
                notaPuntualidad: promedios["Puntualidad"],
                notaContribucion: promedios["Contribuciones"],
                notaActitud: promedios["Actitud"],
                notaCompromiso: promedios["Compromiso"],
            });
        } else {
            await this.reporteSource.createReportePersonalPorEvaluacion({
                idEvaluacion,
                idEstudiante,
                notaPuntualidad: promedios["Puntualidad"],
                notaContribucion: promedios["Contribuciones"],
                notaActitud: promedios["Actitud"],
                notaCompromiso: promedios["Compromiso"],
            });
        }
    }

    // ==============================
    // 🔁 UPSERT PERSONAL CATEGORIA
    // ==============================

    async upsertReportePersonalPorCategoria({
        idCategoria,
        idEstudiante,
    }: {
        idCategoria: string;
        idEstudiante: string;
    }) {

        const promedios = await this.obtenerPromediosPorCategoria({
            idCategoria,
            idEstudiante,
        });

        const existente =
            await this.reporteSource.getReportePersonalPorCategoria({
                idCategoria,
                idEstudiante,
            }).catch(() => null);

        if (existente) {
            await this.reporteSource.updateReportePersonalPorCategoria({
                idReportePersonal: existente.idReportePersonal,
                idCategoria,
                idEstudiante,
                notaPuntualidad: promedios["Puntualidad"],
                notaContribucion: promedios["Contribuciones"],
                notaActitud: promedios["Actitud"],
                notaCompromiso: promedios["Compromiso"],
            });
        } else {
            await this.reporteSource.createReportePersonalPorCategoria({
                idCategoria,
                idEstudiante,
                notaPuntualidad: promedios["Puntualidad"],
                notaContribucion: promedios["Contribuciones"],
                notaActitud: promedios["Actitud"],
                notaCompromiso: promedios["Compromiso"],
            });
        }
    }

    // ==============================
    // 🔁 UPSERT GRUPAL EVALUACION
    // ==============================

    async upsertReporteGrupalPorEvaluacion({
        idEvaluacion,
        idCategoria,
        nombreGrupo,
    }: {
        idEvaluacion: string;
        idCategoria: string;
        nombreGrupo: string;
    }) {

        const estudiantes =
            await this.cursoRepository.getCompanerosDeGrupo(
                idCategoria,
                nombreGrupo
            );

        const promedios: number[] = [];

        for (const correo of estudiantes) {
            const reporte =
                await this.reporteSource.getReportePersonalPorEvaluacion({
                    idEstudiante: correo,
                    idEvaluacion,
                }).catch(() => null);

            if (!reporte) continue;

            const p = parseFloat(reporte.notaPuntualidad) || 0;
            const c = parseFloat(reporte.notaContribucion) || 0;
            const a = parseFloat(reporte.notaActitud) || 0;
            const co = parseFloat(reporte.notaCompromiso) || 0;

            promedios.push((p + c + a + co) / 4);
        }

        const promedioGrupo =
            promedios.length === 0
                ? 0
                : promedios.reduce((a, b) => a + b, 0) / promedios.length;

        const existente =
            await this.reporteSource.getReporteGrupalPorEvaluacion(
                idEvaluacion,
                nombreGrupo
            ).catch(() => null);

        if (existente) {
            await this.reporteSource.updateReporteGrupalPorEvaluacion({
                idReporteGrupal: existente.idReporteGrupal,
                idEvaluacion,
                idGrupo: nombreGrupo,
                nota: promedioGrupo.toString(),
            });
        } else {
            await this.reporteSource.createReporteGrupalPorEvaluacion({
                idEvaluacion,
                idGrupo: nombreGrupo,
                nota: promedioGrupo.toString(),
            });
        }
    }

    // ==============================
    // 🔁 UPSERT GRUPAL CATEGORIA
    // ==============================

    async upsertReporteGrupalPorCategoria({
        idCategoria,
        nombreGrupo,
        idCurso,
    }: {
        idCategoria: string;
        nombreGrupo: string;
        idCurso: string;
    }) {

        const evaluaciones =
            await this.evaluacionSource.getEvaluacionesByProfe(idCategoria);

        const notas: number[] = [];

        for (const evalItem of evaluaciones) {
            const reporte =
                await this.reporteSource.getReporteGrupalPorEvaluacion(
                    evalItem.id.toString(),
                    nombreGrupo
                ).catch(() => null);

            if (reporte) {
                notas.push(parseFloat(reporte.nota) || 0);
            }
        }

        const promedio =
            notas.length === 0
                ? 0
                : notas.reduce((a, b) => a + b, 0) / notas.length;

        const existente =
            await this.reporteSource.getReporteGrupalPorCategoria(
                idCategoria,
                nombreGrupo
            ).catch(() => null);

        if (existente) {
            await this.reporteSource.updateReporteGrupalPorCategoria({
                idReporteGrupal: existente.idReporteGrupal,
                idCategoria,
                idGrupo: nombreGrupo,
                nota: promedio.toString(),
                idCurso,
            });
        } else {
            await this.reporteSource.createReporteGrupalPorCategoria({
                idCategoria,
                idGrupo: nombreGrupo,
                nota: promedio.toString(),
                idCurso,
            });
        }
    }

    // ==============================
    // 🔁 UPSERT PROMEDIO PERSONAL
    // ==============================

    async upsertReportePromedioPersonalPorCategoria({
        idCategoria,
        idEstudiante,
        idCurso,
    }: {
        idCategoria: string;
        idEstudiante: string;
        idCurso: string;
    }) {

        const base =
            await this.reporteSource.getReportePersonalPorCategoria({
                idCategoria,
                idEstudiante,
            }).catch(() => null);

        if (!base) return;

        const p = parseFloat(base.notaPuntualidad) || 0;
        const c = parseFloat(base.notaContribucion) || 0;
        const a = parseFloat(base.notaActitud) || 0;
        const co = parseFloat(base.notaCompromiso) || 0;

        const promedio = ((p + c + a + co) / 4).toString();

        const existente =
            await this.reporteSource.getReportePromedioPersonalPorCategoria(
                idCategoria,
                idEstudiante
            ).catch(() => null);

        if (existente) {
            await this.reporteSource.updateReportePromedioPersonalPorCategoria({
                idReportePromedioPersonal: existente.idReportePromedioPersonal,
                idCategoria,
                idEstudiante,
                nota: promedio,
                idCurso,
            });
        } else {
            await this.reporteSource.createReportePromedioPersonalPorCategoria({
                idCategoria,
                idEstudiante,
                nota: promedio,
                idCurso,
            });
        }
    }

    // ==============================
    // 🚀 ORQUESTADOR
    // ==============================

    async generarTodo(params: {
        idEvaluacion: string;
        idCategoria: string;
        idEstudiante: string;
        nombreGrupo: string;
        idCurso: string;
    }) {

        await this.upsertReportePersonalPorEvaluacion(params);
        await this.upsertReportePersonalPorCategoria(params);
        await this.upsertReportePromedioPersonalPorCategoria(params);
        await this.upsertReporteGrupalPorEvaluacion(params);
        await this.upsertReporteGrupalPorCategoria(params);
    }
    // ==============================
    // 🔎 BAJO RENDIMIENTO
    // ==============================

    async obtenerEstudiantesBajoRendimiento(
        idCurso: string
    ): Promise<ReportePromedioPersonalPorCategoriaModel[]> {
        const reportes =
            await this.reporteSource.getReportesPromedioPersonalCategoriaTodos(
                idCurso
            );

        return reportes
            .filter((e) => (parseFloat(e.nota) || 0) < 3.3)
            .sort(
                (a, b) =>
                    (parseFloat(a.nota) || 0) -
                    (parseFloat(b.nota) || 0)
            );
    }

    async obtenerGruposBajoRendimiento(
        idCurso: string
    ): Promise<ReporteGrupalPorCategoriaModel[]> {
        const reportes =
            await this.reporteSource.getReportesGrupalesPorCategoria(idCurso);

        return reportes
            .filter((e) => (parseFloat(e.nota) || 0) < 3.3)
            .sort(
                (a, b) =>
                    (parseFloat(a.nota) || 0) -
                    (parseFloat(b.nota) || 0)
            );
    }
}