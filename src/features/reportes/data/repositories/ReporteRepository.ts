// src/features/reportes/data/repositories/ReporteRepository.ts

import { IReporteRepository } from "../../domain/repositories/IReporteRepository";
import { IReporteSource } from "../dataSources/IReporteSource";

import { ReporteGrupalPorCategoria } from "../../domain/entities/reporteGrupalPorCategoria";
import { ReporteGrupalPorEvaluacion } from "../../domain/entities/reporteGrupalPorEvaluacion";
import { ReportePersonalPorCategoria } from "../../domain/entities/reportePersonalPorCategoria";
import { ReportePersonalPorEvaluacion } from "../../domain/entities/reportePersonalPorEvaluacion";
import { ReportePromedioPersonalPorCategoria } from "../../domain/entities/reportePromedioPersonalPorCategoria";

export class ReporteRepository implements IReporteRepository {
    constructor(private reporteSource: IReporteSource) { }

    // ==========================
    // CREATE
    // ==========================

    async createReporteGrupalPorCategoria(
        idCategoria: string,
        idGrupo: string,
        nota: string,
        idCurso: string
    ): Promise<void> {
        await this.reporteSource.createReporteGrupalPorCategoria({
            idCategoria,
            idGrupo,
            nota,
            idCurso,
        });
    }

    async createReporteGrupalPorEvaluacion(
        idEvaluacion: string,
        idGrupo: string,
        nota: string
    ): Promise<void> {
        await this.reporteSource.createReporteGrupalPorEvaluacion({
            idEvaluacion,
            idGrupo,
            nota,
        });
    }

    async createReportePersonalPorCategoria(
        idCategoria: string,
        idEstudiante: string,
        notaPuntualidad: string,
        notaContribucion: string,
        notaActitud: string,
        notaCompromiso: string
    ): Promise<void> {
        await this.reporteSource.createReportePersonalPorCategoria({
            idCategoria,
            idEstudiante,
            notaPuntualidad,
            notaContribucion,
            notaActitud,
            notaCompromiso,
        });
    }

    async createReportePersonalPorEvaluacion(
        idEvaluacion: string,
        idEstudiante: string,
        notaPuntualidad: string,
        notaContribucion: string,
        notaActitud: string,
        notaCompromiso: string
    ): Promise<void> {
        await this.reporteSource.createReportePersonalPorEvaluacion({
            idEvaluacion,
            idEstudiante,
            notaPuntualidad,
            notaContribucion,
            notaActitud,
            notaCompromiso,
        });
    }

    async createReportePromedioPersonalPorCategoria(
        idCategoria: string,
        idEstudiante: string,
        nota: string,
        idCurso: string
    ): Promise<void> {
        await this.reporteSource.createReportePromedioPersonalPorCategoria({
            idCategoria,
            idEstudiante,
            nota,
            idCurso,
        });
    }

    // ==========================
    // GET INDIVIDUALES
    // ==========================

    async getReportePersonalPorCategoriaEntity(
        idEstudiante: string,
        idCategoria: string
    ): Promise<ReportePersonalPorCategoria> {
        const model =
            await this.reporteSource.getReportePersonalPorCategoria({
                idEstudiante,
                idCategoria,
            });

        return model.toEntity();
    }

    async getReportePersonalPorEvaluacionEntity(
        idEstudiante: string,
        idEvaluacion: string
    ): Promise<ReportePersonalPorEvaluacion> {
        const model =
            await this.reporteSource.getReportePersonalPorEvaluacion({
                idEstudiante,
                idEvaluacion,
            });

        return model.toEntity();
    }

    async getReporteGrupalPorCategoria(
        idCategoria: string,
        idGrupo: string
    ): Promise<ReporteGrupalPorCategoria> {
        const model =
            await this.reporteSource.getReporteGrupalPorCategoria(
                idCategoria,
                idGrupo
            );

        return model.toEntity();
    }

    async getReporteGrupalPorEvaluacion(
        idEvaluacion: string,
        idGrupo: string
    ): Promise<ReporteGrupalPorEvaluacion> {
        const model =
            await this.reporteSource.getReporteGrupalPorEvaluacion(
                idEvaluacion,
                idGrupo
            );

        return model.toEntity();
    }

    async getReportePromedioPersonalPorCategoria(
        idCategoria: string,
        idEstudiante: string
    ): Promise<ReportePromedioPersonalPorCategoria> {
        const model =
            await this.reporteSource.getReportePromedioPersonalPorCategoria(
                idCategoria,
                idEstudiante
            );

        return model.toEntity();
    }

    // ==========================
    // LISTAS
    // ==========================

    async getReportesGrupalesPorCategoria(
        idCategoria: string
    ): Promise<ReporteGrupalPorCategoria[]> {
        const models =
            await this.reporteSource.getReportesGrupalesPorCategoria(
                idCategoria
            );

        return models.map((e) => e.toEntity());
    }

    async getReportesGrupalesPorEvaluacion(
        idEvaluacion: string
    ): Promise<ReporteGrupalPorEvaluacion[]> {
        const models =
            await this.reporteSource.getReportesGrupalesPorEvaluacion(
                idEvaluacion
            );

        return models.map((e) => e.toEntity());
    }

    async getReportesGrupalesTodos(
        idCurso: string
    ): Promise<ReporteGrupalPorCategoria[]> {
        const models =
            await this.reporteSource.getReportesGrupalesTodos(idCurso);

        return models.map((e) => e.toEntity());
    }

    async getReportesPersonalPorCategoriaEntity(
        idCategoria: string
    ): Promise<ReportePersonalPorCategoria[]> {
        const models =
            await this.reporteSource.getReportesPersonalPorCategoria(
                idCategoria
            );

        return models.map((e) => e.toEntity());
    }

    async getReportesPersonalPorEvaluacionEntity(
        idEvaluacion: string
    ): Promise<ReportePersonalPorEvaluacion[]> {
        const models =
            await this.reporteSource.getReportesPersonalPorEvaluacion(
                idEvaluacion
            );

        return models.map((e) => e.toEntity());
    }

    async getReportesPromedioPersonalCategoriaTodos(
        idCurso: string
    ): Promise<ReportePromedioPersonalPorCategoria[]> {
        const models =
            await this.reporteSource.getReportesPromedioPersonalCategoriaTodos(
                idCurso
            );

        return models.map((e) => e.toEntity());
    }

    // ==========================
    // UPDATE
    // ==========================

    async updateReporteGrupalPorCategoria(
        idReporteGrupal: string,
        idCategoria: string,
        idGrupo: string,
        nota: string,
        idCurso: string
    ): Promise<void> {
        await this.reporteSource.updateReporteGrupalPorCategoria({
            idReporteGrupal,
            idCategoria,
            idGrupo,
            nota,
            idCurso,
        });
    }

    async updateReporteGrupalPorEvaluacion(
        idReporteGrupal: string,
        idEvaluacion: string,
        idGrupo: string,
        nota: string
    ): Promise<void> {
        await this.reporteSource.updateReporteGrupalPorEvaluacion({
            idReporteGrupal,
            idEvaluacion,
            idGrupo,
            nota,
        });
    }

    async updateReportePersonalPorCategoria(
        idReportePersonal: string,
        idCategoria: string,
        idEstudiante: string,
        notaPuntualidad: string,
        notaContribucion: string,
        notaActitud: string,
        notaCompromiso: string
    ): Promise<void> {
        await this.reporteSource.updateReportePersonalPorCategoria({
            idReportePersonal,
            idCategoria,
            idEstudiante,
            notaPuntualidad,
            notaContribucion,
            notaActitud,
            notaCompromiso,
        });
    }

    async updateReportePersonalPorEvaluacion(
        idReportePersonal: string,
        idEvaluacion: string,
        idEstudiante: string,
        notaPuntualidad: string,
        notaContribucion: string,
        notaActitud: string,
        notaCompromiso: string
    ): Promise<void> {
        await this.reporteSource.updateReportePersonalPorEvaluacion({
            idReportePersonal,
            idEvaluacion,
            idEstudiante,
            notaPuntualidad,
            notaContribucion,
            notaActitud,
            notaCompromiso,
        });
    }

    async updateReportePromedioPersonalPorCategoria(
        idReportePromedioPersonal: string,
        idEstudiante: string,
        idCategoria: string,
        nota: string,
        idCurso: string
    ): Promise<void> {
        await this.reporteSource.updateReportePromedioPersonalPorCategoria({
            idReportePromedioPersonal,
            idEstudiante,
            idCategoria,
            nota,
            idCurso,
        });
    }
}