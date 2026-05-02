import { ReporteGrupalPorCategoria } from "../../domain/entities/reporteGrupalPorCategoria";

export class ReporteGrupalPorCategoriaModel {
  constructor(
    public idReporteGrupal: string,
    public idCategoria: string,
    public idGrupo: string,
    public nota: string,
    public idCurso: string
  ) {}

  static fromJson(json: any): ReporteGrupalPorCategoriaModel {
    return new ReporteGrupalPorCategoriaModel(
      json.idReporteGrupal,
      json.idCategoria,
      json.idGrupo,
      json.nota,
      json.idCurso
    );
  }

  toJson(): any {
    return {
      idReporteGrupal: this.idReporteGrupal,
      idCategoria: this.idCategoria,
      idGrupo: this.idGrupo,
      nota: this.nota,
      idCurso: this.idCurso,
    };
  }

  toEntity(): ReporteGrupalPorCategoria {
    return {
      idReporteGrupal: this.idReporteGrupal,
      idCategoria: this.idCategoria,
      idGrupo: this.idGrupo,
      nota: this.nota,
      idCurso: this.idCurso,
    };
  }

  static fromEntity(entity: ReporteGrupalPorCategoria) {
    return new ReporteGrupalPorCategoriaModel(
      entity.idReporteGrupal,
      entity.idCategoria,
      entity.idGrupo,
      entity.nota,
      entity.idCurso
    );
  }
}