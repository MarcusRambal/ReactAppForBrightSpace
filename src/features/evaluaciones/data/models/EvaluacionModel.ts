// src/features/evaluaciones/data/models/EvaluacionModel.ts

import { EvaluacionEntity } from "../../domain/entities/EvaluacionEntity";

export class EvaluacionModel implements EvaluacionEntity {
  id: string;
  idCategoria: string;
  tipo: string;
  fechaCreacion: Date;
  fechaFinalizacion: Date;
  nom: string;
  esPrivada: boolean;

  constructor(
    id: string,
    idCategoria: string,
    tipo: string,
    fechaCreacion: Date,
    fechaFinalizacion: Date,
    nom: string,
    esPrivada: boolean
  ) {
    this.id = id;
    this.idCategoria = idCategoria;
    this.tipo = tipo;
    this.fechaCreacion = fechaCreacion;
    this.fechaFinalizacion = fechaFinalizacion;
    this.nom = nom;
    this.esPrivada = esPrivada;
  }

  static fromJson(json: any): EvaluacionModel {
    const tipoDb = json["tipo"]?.toString() ?? "General";

    return new EvaluacionModel(
      (json["idEvaluacion"] ?? json["id"] ?? json["_id"]).toString(),
      json["idCategoria"]?.toString() ?? "",
      tipoDb,
      new Date(json["fechaCreacion"]),
      new Date(json["fechaFinalizacion"]),
      json["nom"]?.toString() ?? "",
      tipoDb === "Privada"
    );
  }

  toJson(): any {
    return {
      idEvaluacion: this.id,
      idCategoria: this.idCategoria,
      nom: this.nom,
      tipo: this.esPrivada ? "Privada" : "General",
      fechaCreacion: this.fechaCreacion.toISOString(),
      fechaFinalizacion: this.fechaFinalizacion.toISOString(),
    };
  }
}