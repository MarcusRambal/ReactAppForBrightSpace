// src/features/reportes/presentation/context/ReporteController.ts

import { ReporteService } from "../../domain/services/ReporteService";
import { IReporteSource } from "../../data/dataSources/IReporteSource";

import { ReportePromedioPersonalPorCategoriaModel } from "../../data/models/ReportePromedioPersonalPorCategoriaModel";
import { ReporteGrupalPorCategoriaModel } from "../../data/models/ReporteGrupalPorCategoriaModel";

export class ReporteController {
    private reporteService: ReporteService;
    private reporteSource: IReporteSource;

    constructor(
        reporteService: ReporteService,
        reporteSource: IReporteSource
    ) {
        this.reporteService = reporteService;
        this.reporteSource = reporteSource;
    }

    // ==============================
    // 🔄 PERSONAL POR EVALUACIÓN
    // ==============================
    async generarReportePersonalPorEvaluacion({
        idEvaluacion,
        idEstudiante,
    }: {
        idEvaluacion: string;
        idEstudiante: string;
    }): Promise<void> {
        try {
            await this.reporteService.upsertReportePersonalPorEvaluacion({
                idEvaluacion,
                idEstudiante,
            });
        } catch (e) {
            console.error("Error generando reporte personal por evaluación:", e);
        }
    }

    // ==============================
    // 🔄 PERSONAL POR CATEGORÍA
    // ==============================
    async generarReportePersonalPorCategoria({
        idCategoria,
        idEstudiante,
    }: {
        idCategoria: string;
        idEstudiante: string;
    }): Promise<void> {
        try {
            await this.reporteService.upsertReportePersonalPorCategoria({
                idCategoria,
                idEstudiante,
            });
        } catch (e) {
            console.error("Error generando reporte personal por categoría:", e);
        }
    }

    // ==============================
    // 🔄 PROMEDIO PERSONAL
    // ==============================
    async generarReportePromedioPersonal({
        idCategoria,
        idEstudiante,
        idCurso,
    }: {
        idCategoria: string;
        idEstudiante: string;
        idCurso: string;
    }): Promise<void> {
        try {
            await this.reporteService.upsertReportePromedioPersonalPorCategoria({
                idCategoria,
                idEstudiante,
                idCurso,
            });
        } catch (e) {
            console.error("Error generando promedio personal:", e);
        }
    }

    // ==============================
    // 🔄 GRUPAL POR EVALUACIÓN
    // ==============================
    async generarReporteGrupalPorEvaluacion({
        idEvaluacion,
        idCategoria,
        nombreGrupo,
    }: {
        idEvaluacion: string;
        idCategoria: string;
        nombreGrupo: string;
    }): Promise<void> {
        try {
            await this.reporteService.upsertReporteGrupalPorEvaluacion({
                idEvaluacion,
                idCategoria,
                nombreGrupo,
            });
        } catch (e) {
            console.error("Error generando reporte grupal por evaluación:", e);
        }
    }

    // ==============================
    // 🔄 GRUPAL POR CATEGORÍA
    // ==============================
    async generarReporteGrupalPorCategoria({
        idCategoria,
        nombreGrupo,
        idCurso,
    }: {
        idCategoria: string;
        nombreGrupo: string;
        idCurso: string;
    }): Promise<void> {
        try {
            await this.reporteService.upsertReporteGrupalPorCategoria({
                idCategoria,
                nombreGrupo,
                idCurso,
            });
        } catch (e) {
            console.error("Error generando reporte grupal por categoría:", e);
        }
    }

    // ==============================
    // 🚀 MÉTODO COMPLETO
    // ==============================
    async generarTodo({
        idEvaluacion,
        idCategoria,
        idEstudiante,
        nombreGrupo,
        idCurso,
    }: {
        idEvaluacion: string;
        idCategoria: string;
        idEstudiante: string;
        nombreGrupo: string;
        idCurso: string;
    }): Promise<void> {
        try {
            await this.generarReportePersonalPorEvaluacion({
                idEvaluacion,
                idEstudiante,
            });

            await this.generarReportePersonalPorCategoria({
                idCategoria,
                idEstudiante,
            });

            await this.generarReportePromedioPersonal({
                idCategoria,
                idEstudiante,
                idCurso,
            });

            await this.generarReporteGrupalPorEvaluacion({
                idEvaluacion,
                idCategoria,
                nombreGrupo,
            });

            await this.generarReporteGrupalPorCategoria({
                idCategoria,
                nombreGrupo,
                idCurso,
            });
        } catch (e) {
            console.error("Error generando todos los reportes:", e);
        }
    }

    // =====================================================
    // 📥 GETS
    // =====================================================

    async getReportePersonalPorEvaluacion({
        idEvaluacion,
        idEstudiante,
    }: {
        idEvaluacion: string;
        idEstudiante: string;
    }) {
        try {
            return await this.reporteSource.getReportePersonalPorEvaluacion({
                idEvaluacion,
                idEstudiante,
            });
        } catch (e) {
            console.error("Error obteniendo reporte personal por evaluación:", e);
            return null;
        }
    }

    async getReportePersonalPorCategoria({
        idCategoria,
        idEstudiante,
    }: {
        idCategoria: string;
        idEstudiante: string;
    }) {
        try {
            return await this.reporteSource.getReportePersonalPorCategoria({
                idCategoria,
                idEstudiante,
            });
        } catch (e) {
            console.error("Error obteniendo reporte personal por categoría:", e);
            return null;
        }
    }

    async getReportePromedioPersonal({
        idCategoria,
        idEstudiante,
    }: {
        idCategoria: string;
        idEstudiante: string;
    }) {
        try {
            return await this.reporteSource.getReportePromedioPersonalPorCategoria(
                idCategoria,
                idEstudiante
            );
        } catch (e) {
            console.error("Error obteniendo promedio personal:", e);
            return null;
        }
    }

    async getReporteGrupalPorEvaluacion({
        idEvaluacion,
        idGrupo,
    }: {
        idEvaluacion: string;
        idGrupo: string;
    }) {
        try {
            return await this.reporteSource.getReporteGrupalPorEvaluacion(
                idEvaluacion,
                idGrupo
            );
        } catch (e) {
            console.error("Error obteniendo reporte grupal por evaluación:", e);
            return null;
        }
    }

    async getReporteGrupalPorCategoria({
        idCategoria,
        idGrupo,
    }: {
        idCategoria: string;
        idGrupo: string;
    }) {
        try {
            return await this.reporteSource.getReporteGrupalPorCategoria(
                idCategoria,
                idGrupo
            );
        } catch (e) {
            console.error("Error obteniendo reporte grupal por categoría:", e);
            return null;
        }
    }

    async getReportesGrupalesPorCategoria(idCategoria: string) {
        try {
            return await this.reporteSource.getReportesGrupalesPorCategoria(
                idCategoria
            );
        } catch (e) {
            console.error("Error obteniendo reportes grupales por categoría:", e);
            return [];
        }
    }

    async getReportesGrupalesPorEvaluacion(idEvaluacion: string) {
        try {
            return await this.reporteSource.getReportesGrupalesPorEvaluacion(
                idEvaluacion
            );
        } catch (e) {
            console.error("Error obteniendo reportes grupales por evaluación:", e);
            return [];
        }
    }

    async getReportesPersonalesPorCategoria(idCategoria: string) {
        try {
            return await this.reporteSource.getReportesPersonalPorCategoria(
                idCategoria
            );
        } catch (e) {
            console.error("Error obteniendo reportes personales:", e);
            return [];
        }
    }

    async getReportesPersonalesPorEvaluacion(idEvaluacion: string) {
        try {
            return await this.reporteSource.getReportesPersonalPorEvaluacion(
                idEvaluacion
            );
        } catch (e) {
            console.error("Error obteniendo reportes personales:", e);
            return [];
        }
    }

    async getReportesPromedioPersonal(idCurso: string) {
        try {
            return await this.reporteSource.getReportesPromedioPersonalCategoriaTodos(
                idCurso
            );
        } catch (e) {
            console.error("Error obteniendo promedios:", e);
            return [];
        }
    }

    async getEstudiantesBajoRendimiento(
        idCurso: string
    ): Promise<ReportePromedioPersonalPorCategoriaModel[]> {
        try {
            return await this.reporteService.obtenerEstudiantesBajoRendimiento(
                idCurso
            );
        } catch (e) {
            console.error("Error estudiantes bajo rendimiento:", e);
            return [];
        }
    }

    async getGruposBajoRendimiento(
        idCurso: string
    ): Promise<ReporteGrupalPorCategoriaModel[]> {
        try {
            return await this.reporteService.obtenerGruposBajoRendimiento(
                idCurso
            );
        } catch (e) {
            console.error("Error grupos bajo rendimiento:", e);
            return [];
        }
    }
}