import { ReportePersonalPorCategoria } from "../../domain/entities/reportePersonalPorCategoria";

export class ReportePersonalPorCategoriaModel {
  constructor(
    public idReportePersonal: string,
    public idCategoria: string,
    public idEstudiante: string,
    public notaPuntualidad: string,
    public notaContribucion: string,
    public notaActitud: string,
    public notaCompromiso: string
  ) {}

  static fromJson(json: any): ReportePersonalPorCategoriaModel {
    return new ReportePersonalPorCategoriaModel(
      json.idReportePersonal,
      json.idCategoria,
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
      idCategoria: this.idCategoria,
      idEstudiante: this.idEstudiante,
      notaPuntualidad: this.notaPuntualidad,
      notaContribucion: this.notaContribucion,
      notaActitud: this.notaActitud,
      notaCompromiso: this.notaCompromiso,
    };
  }

  toEntity(): ReportePersonalPorCategoria {
    return {
      idReportePersonal: this.idReportePersonal,
      idCategoria: this.idCategoria,
      idEstudiante: this.idEstudiante,
      notaPuntualidad: this.notaPuntualidad,
      notaContribucion: this.notaContribucion,
      notaActitud: this.notaActitud,
      notaCompromiso: this.notaCompromiso,
    };
  }

  static fromEntity(entity: ReportePersonalPorCategoria) {
    return new ReportePersonalPorCategoriaModel(
      entity.idReportePersonal,
      entity.idCategoria,
      entity.idEstudiante,
      entity.notaPuntualidad,
      entity.notaContribucion,
      entity.notaActitud,
      entity.notaCompromiso
    );
  }
}