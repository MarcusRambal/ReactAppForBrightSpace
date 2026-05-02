// src/features/reportes/data/dataSources/IReporteSource.ts

import { ReporteGrupalPorCategoriaModel } from "../models/ReporteGrupalPorCategoriaModel";
import { ReporteGrupalPorEvaluacionModel } from "../models/ReporteGrupalPorEvaluacionModel";
import { ReportePersonalPorCategoriaModel } from "../models/ReportePersonalPorCategoriaModel";
import { ReportePersonalPorEvaluacionModel } from "../models/ReportePersonalPorEvaluacionModel";
import { ReportePromedioPersonalPorCategoriaModel } from "../models/ReportePromedioPersonalPorCategoriaModel";

export interface IReporteSource {

  // CREATE
  createReporteGrupalPorEvaluacion(params: {
    idEvaluacion: string;
    idGrupo: string;
    nota: string;
  }): Promise<void>;

  createReporteGrupalPorCategoria(params: {
    idCategoria: string;
    idGrupo: string;
    nota: string;
    idCurso: string;
  }): Promise<void>;

  createReportePersonalPorEvaluacion(params: {
    idEvaluacion: string;
    idEstudiante: string;
    notaPuntualidad: string;
    notaContribucion: string;
    notaActitud: string;
    notaCompromiso: string;
  }): Promise<void>;

  createReportePersonalPorCategoria(params: {
    idCategoria: string;
    idEstudiante: string;
    notaPuntualidad: string;
    notaContribucion: string;
    notaActitud: string;
    notaCompromiso: string;
  }): Promise<void>;

  createReportePromedioPersonalPorCategoria(params: {
    idCategoria: string;
    idEstudiante: string;
    nota: string;
    idCurso: string;
  }): Promise<void>;

  // UPDATE
  updateReporteGrupalPorEvaluacion(params: {
    idReporteGrupal: string;
    idEvaluacion: string;
    idGrupo: string;
    nota: string;
  }): Promise<void>;

  updateReporteGrupalPorCategoria(params: {
    idReporteGrupal: string;
    idCategoria: string;
    idGrupo: string;
    idCurso: string;
    nota: string;
  }): Promise<void>;

  updateReportePersonalPorEvaluacion(params: {
    idReportePersonal: string;
    idEvaluacion: string;
    idEstudiante: string;
    notaPuntualidad: string;
    notaContribucion: string;
    notaActitud: string;
    notaCompromiso: string;
  }): Promise<void>;

  updateReportePersonalPorCategoria(params: {
    idReportePersonal: string;
    idCategoria: string;
    idEstudiante: string;
    notaPuntualidad: string;
    notaContribucion: string;
    notaActitud: string;
    notaCompromiso: string;
  }): Promise<void>;

  updateReportePromedioPersonalPorCategoria(params: {
    idReportePromedioPersonal: string;
    idCategoria: string;
    idEstudiante: string;
    nota: string;
    idCurso: string;
  }): Promise<void>;

  // GET
  getReportesPromedioPersonalCategoriaTodos(idCurso: string): Promise<ReportePromedioPersonalPorCategoriaModel[]>;

  getReportesGrupalesTodos(idCurso: string): Promise<ReporteGrupalPorCategoriaModel[]>;

  getReportePersonalPorEvaluacion(params: {
    idEstudiante: string;
    idEvaluacion: string;
  }): Promise<ReportePersonalPorEvaluacionModel>;

  getReportePersonalPorCategoria(params: {
    idEstudiante: string;
    idCategoria: string;
  }): Promise<ReportePersonalPorCategoriaModel>;

  getReportesPersonalPorEvaluacion(idEvaluacion: string): Promise<ReportePersonalPorEvaluacionModel[]>;

  getReportesPersonalPorCategoria(idCategoria: string): Promise<ReportePersonalPorCategoriaModel[]>;

  getReportesGrupalesPorCategoria(idCategoria: string): Promise<ReporteGrupalPorCategoriaModel[]>;

  getReportesGrupalesPorEvaluacion(idEvaluacion: string): Promise<ReporteGrupalPorEvaluacionModel[]>;

  getReporteGrupalPorCategoria(idCategoria: string, idGrupo: string): Promise<ReporteGrupalPorCategoriaModel>;

  getReporteGrupalPorEvaluacion(idEvaluacion: string, idGrupo: string): Promise<ReporteGrupalPorEvaluacionModel>;

  getReportePromedioPersonalPorCategoria(idCategoria: string, idEstudiante: string): Promise<ReportePromedioPersonalPorCategoriaModel>;
}