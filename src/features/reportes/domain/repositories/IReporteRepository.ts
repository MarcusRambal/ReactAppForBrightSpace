import { ReporteGrupalPorCategoria } from "../entities/reporteGrupalPorCategoria";
import { ReporteGrupalPorEvaluacion } from "../entities/reporteGrupalPorEvaluacion";
import { ReportePersonalPorCategoria } from "../entities/reportePersonalPorCategoria";
import { ReportePersonalPorEvaluacion } from "../entities/reportePersonalPorEvaluacion";
import { ReportePromedioPersonalPorCategoria } from "../entities/reportePromedioPersonalPorCategoria";

export interface IReporteRepository {
  // ========================
  // CREAR
  // ========================
  createReporteGrupalPorEvaluacion(
    idEvaluacion: string,
    idGrupo: string,
    nota: string
  ): Promise<void>;

  createReporteGrupalPorCategoria(
    idCategoria: string,
    idGrupo: string,
    nota: string,
    idCurso: string
  ): Promise<void>;

  createReportePersonalPorEvaluacion(
    idEvaluacion: string,
    idEstudiante: string,
    notaPuntualidad: string,
    notaContribucion: string,
    notaActitud: string,
    notaCompromiso: string
  ): Promise<void>;

  createReportePersonalPorCategoria(
    idCategoria: string,
    idEstudiante: string,
    notaPuntualidad: string,
    notaContribucion: string,
    notaActitud: string,
    notaCompromiso: string
  ): Promise<void>;

  createReportePromedioPersonalPorCategoria(
    idCategoria: string,
    idEstudiante: string,
    nota: string,
    idCurso: string
  ): Promise<void>;

  // ========================
  // ACTUALIZAR
  // ========================
  updateReporteGrupalPorEvaluacion(
    idReporteGrupal: string,
    idEvaluacion: string,
    idGrupo: string,
    nota: string
  ): Promise<void>;

  updateReporteGrupalPorCategoria(
    idReporteGrupal: string,
    idCategoria: string,
    idGrupo: string,
    nota: string,
    idCurso: string
  ): Promise<void>;

  updateReportePersonalPorEvaluacion(
    idReportePersonal: string,
    idEvaluacion: string,
    idEstudiante: string,
    notaPuntualidad: string,
    notaContribucion: string,
    notaActitud: string,
    notaCompromiso: string
  ): Promise<void>;

  updateReportePersonalPorCategoria(
    idReportePersonal: string,
    idCategoria: string,
    idEstudiante: string,
    notaPuntualidad: string,
    notaContribucion: string,
    notaActitud: string,
    notaCompromiso: string
  ): Promise<void>;

  updateReportePromedioPersonalPorCategoria(
    idReportePromedioPersonal: string,
    idEstudiante: string,
    idEvaluacion: string,
    nota: string,
    idCurso: string
  ): Promise<void>;

  // ========================
  // CONSULTAS GENERALES
  // ========================
  getReportesPromedioPersonalCategoriaTodos(
    idCurso: string
  ): Promise<ReportePromedioPersonalPorCategoria[]>;

  getReportesGrupalesTodos(
    idCurso: string
  ): Promise<ReporteGrupalPorCategoria[]>;

  // ========================
  // REPORTES PERSONALES
  // ========================
  getReportePersonalPorEvaluacionEntity(
    idEstudiante: string,
    idEvaluacion: string
  ): Promise<ReportePersonalPorEvaluacion>;

  getReportePersonalPorCategoriaEntity(
    idEstudiante: string,
    idCategoria: string
  ): Promise<ReportePersonalPorCategoria>;

  getReportesPersonalPorEvaluacionEntity(
    idEvaluacion: string
  ): Promise<ReportePersonalPorEvaluacion[]>;

  getReportesPersonalPorCategoriaEntity(
    idCategoria: string
  ): Promise<ReportePersonalPorCategoria[]>;

  // ========================
  // REPORTES GRUPALES
  // ========================
  getReportesGrupalesPorCategoria(
    idCategoria: string
  ): Promise<ReporteGrupalPorCategoria[]>;

  getReportesGrupalesPorEvaluacion(
    idEvaluacion: string
  ): Promise<ReporteGrupalPorEvaluacion[]>;

  getReporteGrupalPorCategoria(
    idCategoria: string,
    idGrupo: string
  ): Promise<ReporteGrupalPorCategoria>;

  getReporteGrupalPorEvaluacion(
    idEvaluacion: string,
    idGrupo: string
  ): Promise<ReporteGrupalPorEvaluacion>;

  // ========================
  // PROMEDIOS
  // ========================
  getReportePromedioPersonalPorCategoria(
    idCategoria: string,
    idEstudiante: string
  ): Promise<ReportePromedioPersonalPorCategoria>;
}