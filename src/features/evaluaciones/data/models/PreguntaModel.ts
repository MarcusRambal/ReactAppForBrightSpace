// src/features/evaluaciones/data/models/PreguntaModel.ts

import { PreguntaEntity } from "../../domain/entities/PreguntaEntity";

export class PreguntaModel implements PreguntaEntity {
  idPregunta: string;
  tipo: string;
  pregunta: string;

  constructor(
    idPregunta: string,
    tipo: string,
    pregunta: string
  ) {
    this.idPregunta = idPregunta;
    this.tipo = tipo;
    this.pregunta = pregunta;
  }

  static fromJson(json: any): PreguntaModel {
    return new PreguntaModel(
      json["idPregunta"]?.toString() ?? "",
      json["tipo"]?.toString() ?? "",
      json["pregunta"]?.toString() ?? ""
    );
  }

  toJson(): any {
    return {
      idPregunta: this.idPregunta,
      tipo: this.tipo,
      pregunta: this.pregunta,
    };
  }

  static fromEntity(entity: PreguntaEntity): PreguntaModel {
    return new PreguntaModel(
      entity.idPregunta,
      entity.tipo,
      entity.pregunta
    );
  }
}