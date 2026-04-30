import { GrupoIntegranteEntity } from "../../domain/entities/GrupoIntegranteEntity";

export class GrupoIntegranteModel implements GrupoIntegranteEntity {
  constructor(
    public idGrupo: string,
    public idCat: string,
    public nombre: string,
    public correo: string
  ) {}

  static fromJson(json: any): GrupoIntegranteModel {
    return new GrupoIntegranteModel(
      json["idGrupo"]?.toString() ?? "",
      json["idCat"]?.toString() ?? "",
      json["nombre"]?.toString() ?? "",
      json["Correo"]?.toString() ?? "" // Ojo aquí con la mayúscula de la BD
    );
  }

  toJson(): any {
    return {
      idGrupo: this.idGrupo,
      idCat: this.idCat,
      nombre: this.nombre,
      Correo: this.correo,
    };
  }
}