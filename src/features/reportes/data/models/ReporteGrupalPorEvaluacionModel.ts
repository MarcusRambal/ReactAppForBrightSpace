import { ReporteGrupalPorEvaluacion } from "../../domain/entities/reporteGrupalPorEvaluacion";

export class ReporteGrupalPorEvaluacionModel {
  constructor(
    public idReporteGrupal: string,
    public idEvaluacion: string,
    public idGrupo: string,
    public nota: string
  ) {}

  static fromJson(json: any): ReporteGrupalPorEvaluacionModel {
    return new ReporteGrupalPorEvaluacionModel(
      json.idReporteGrupal,
      json.idEvaluacion,
      json.idGrupo,
      json.nota
    );
  }

  toJson(): any {
    return {
      idReporteGrupal: this.idReporteGrupal,
      idEvaluacion: this.idEvaluacion,
      idGrupo: this.idGrupo,
      nota: this.nota,
    };
  }

  toEntity(): ReporteGrupalPorEvaluacion {
    return {
      idReporteGrupal: this.idReporteGrupal,
      idEvaluacion: this.idEvaluacion,
      idGrupo: this.idGrupo,
      nota: this.nota,
    };
  }

  static fromEntity(entity: ReporteGrupalPorEvaluacion) {
    return new ReporteGrupalPorEvaluacionModel(
      entity.idReporteGrupal,
      entity.idEvaluacion,
      entity.idGrupo,
      entity.nota
    );
  }
}