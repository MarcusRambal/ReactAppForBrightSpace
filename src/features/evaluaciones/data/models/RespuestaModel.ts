// src/features/evaluaciones/data/models/RespuestaModel.ts

import { RespuestaEntity } from "../../domain/entities/RespuestaEntity";

export class RespuestaModel implements RespuestaEntity {
  id?: string;
  idEvaluacion: string;
  idEvaluador: string;
  idEvaluado: string;
  idPregunta: string;
  tipo: string;
  valorComentario: string;

  constructor(
    id: string | undefined,
    idEvaluacion: string,
    idEvaluador: string,
    idEvaluado: string,
    idPregunta: string,
    tipo: string,
    valorComentario: string
  ) {
    this.id = id;
    this.idEvaluacion = idEvaluacion;
    this.idEvaluador = idEvaluador;
    this.idEvaluado = idEvaluado;
    this.idPregunta = idPregunta;
    this.tipo = tipo;
    this.valorComentario = valorComentario;
  }

  static fromJson(json: any): RespuestaModel {
    return new RespuestaModel(
      json["idRespuesta"]?.toString(),
      json["idEvaluacion"]?.toString() ?? "",
      json["idEvaluador"]?.toString() ?? "",
      json["idEvaluado"]?.toString() ?? "",
      json["idPregunta"]?.toString() ?? "",
      json["tipo"]?.toString() ?? "",
      json["valor_comentario"]?.toString() ?? ""
    );
  }

  toJson(): any {
    return {
      ...(this.id && { idRespuesta: this.id }),
      idEvaluacion: this.idEvaluacion,
      idEvaluador: this.idEvaluador,
      idEvaluado: this.idEvaluado,
      idPregunta: this.idPregunta,
      tipo: this.tipo,
      valor_comentario: this.valorComentario,
    };
  }
}