import { ReportePromedioPersonalPorCategoria } from "../../domain/entities/reportePromedioPersonalPorCategoria";

export class ReportePromedioPersonalPorCategoriaModel {
  constructor(
    public idReportePromedioPersonal: string,
    public idEstudiante: string,
    public idCategoria: string,
    public nota: string,
    public idCurso: string
  ) {}

  static fromJson(json: any): ReportePromedioPersonalPorCategoriaModel {
    return new ReportePromedioPersonalPorCategoriaModel(
      json.idReportePromedioPersonal,
      json.idEstudiante,
      json.idCategoria,
      json.nota,
      json.idCurso
    );
  }

  toJson(): any {
    return {
      idReportePromedioPersonal: this.idReportePromedioPersonal,
      idEstudiante: this.idEstudiante,
      idCategoria: this.idCategoria,
      nota: this.nota,
      idCurso: this.idCurso,
    };
  }

  toEntity(): ReportePromedioPersonalPorCategoria {
    return {
      idReportePromedioPersonal: this.idReportePromedioPersonal,
      idEstudiante: this.idEstudiante,
      idCategoria: this.idCategoria,
      nota: this.nota,
      idCurso: this.idCurso,
    };
  }

  static fromEntity(entity: ReportePromedioPersonalPorCategoria) {
    return new ReportePromedioPersonalPorCategoriaModel(
      entity.idReportePromedioPersonal,
      entity.idEstudiante,
      entity.idCategoria,
      entity.nota,
      entity.idCurso
    );
  }
}