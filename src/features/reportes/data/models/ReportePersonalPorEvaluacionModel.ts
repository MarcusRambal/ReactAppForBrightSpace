import { ReportePersonalPorEvaluacion } from "../../domain/entities/reportePersonalPorEvaluacion";

export class ReportePersonalPorEvaluacionModel {
  constructor(
    public idReportePersonal: string,
    public idEvaluacion: string,
    public idEstudiante: string,
    public notaPuntualidad: string,
    public notaContribucion: string,
    public notaActitud: string,
    public notaCompromiso: string
  ) {}

  static fromJson(json: any): ReportePersonalPorEvaluacionModel {
    return new ReportePersonalPorEvaluacionModel(
      json.idReportePersonal,
      json.idEvaluacion,
      json.idEstudiante,
      json.notaPuntualidad,
      json.notaContribucion,
      json.notaActitud,
      json.notaCompromiso
    );
  }

  toJson(): any {
    return {
      idReportePersonal: this.idReportePersonal,
      idEvaluacion: this.idEvaluacion,
      idEstudiante: this.idEstudiante,
      notaPuntualidad: this.notaPuntualidad,
      notaContribucion: this.notaContribucion,
      notaActitud: this.notaActitud,
      notaCompromiso: this.notaCompromiso,
    };
  }

  toEntity(): ReportePersonalPorEvaluacion {
    return {
      idReportePersonal: this.idReportePersonal,
      idEvaluacion: this.idEvaluacion,
      idEstudiante: this.idEstudiante,
      notaPuntualidad: this.notaPuntualidad,
      notaContribucion: this.notaContribucion,
      notaActitud: this.notaActitud,
      notaCompromiso: this.notaCompromiso,
    };
  }

  static fromEntity(entity: ReportePersonalPorEvaluacion) {
    return new ReportePersonalPorEvaluacionModel(
      entity.idReportePersonal,
      entity.idEvaluacion,
      entity.idEstudiante,
      entity.notaPuntualidad,
      entity.notaContribucion,
      entity.notaActitud,
      entity.notaCompromiso
    );
  }
}