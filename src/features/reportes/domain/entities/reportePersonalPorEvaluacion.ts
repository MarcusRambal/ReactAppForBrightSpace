//src/features/reportes/domain/entities/reportePersonalPorEvaluacion.ts
export interface ReportePersonalPorEvaluacion {
  idReportePersonal: string;
  idEvaluacion: string;
  idEstudiante: string;
  notaPuntualidad: string;
  notaContribucion: string;
  notaActitud: string;
  notaCompromiso: string;
}