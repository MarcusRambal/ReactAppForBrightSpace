// src/features/evaluaciones/data/dataSources/IEvaluacionSource.ts

import { EvaluacionEntity } from "../../domain/entities/EvaluacionEntity";
import { PreguntaEntity } from "../../domain/entities/PreguntaEntity";
import { RespuestaEntity } from "../../domain/entities/RespuestaEntity";

export interface IEvaluacionSource {
  createEvaluacion(
    idCategoria: string,
    tipo: string,
    fechaCreacion: string,
    fechaFinalizacion: string,
    nom: string,
    esPrivada: boolean
  ): Promise<string>;

  getEvaluacionesByProfe(idCategoria: string): Promise<EvaluacionEntity[]>;

  getPreguntas(): Promise<PreguntaEntity[]>;

  createRespuestas(respuestas: RespuestaEntity[]): Promise<void>;

  yaEvaluo(
    idEvaluacion: string,
    idEvaluador: string,
    idEvaluado: string
  ): Promise<boolean>;

  getNotasPorEvaluado(
    idEvaluacion: string,
    idEvaluado: string,
    tipo: string
  ): Promise<string[]>;

  updatePrivacidad(
    idEvaluacion: string,
    esPrivada: boolean
  ): Promise<void>;
}