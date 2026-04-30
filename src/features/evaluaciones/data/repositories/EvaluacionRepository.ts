// src/features/evaluaciones/data/repositories/EvaluacionRepository.ts

import { IEvaluacionRepository } from "../../domain/repositories/IEvaluacionRepository";
import { IEvaluacionSource } from "../dataSources/IEvaluacionSource";

import { EvaluacionEntity } from "../../domain/entities/EvaluacionEntity";
import { PreguntaEntity } from "../../domain/entities/PreguntaEntity";
import { RespuestaEntity } from "../../domain/entities/RespuestaEntity";

export class EvaluacionRepository implements IEvaluacionRepository {

  private source: IEvaluacionSource;

  constructor(source: IEvaluacionSource) {
    this.source = source;
  }

  async createEvaluacion(
    idCategoria: string,
    tipo: string,
    fechaCreacion: string,
    fechaFinalizacion: string,
    nom: string,
    esPrivada: boolean
  ): Promise<void> {
    await this.source.createEvaluacion(
      idCategoria,
      tipo,
      fechaCreacion,
      fechaFinalizacion,
      nom,
      esPrivada
    );
  }

  async getEvaluacionesByProfe(
    idCategoria: string
  ): Promise<EvaluacionEntity[]> {
    return await this.source.getEvaluacionesByProfe(idCategoria);
  }

  async createRespuestas(
    respuestas: RespuestaEntity[]
  ): Promise<void> {
    await this.source.createRespuestas(respuestas);
  }

  async yaEvaluo(
    idEvaluacion: string,
    idEvaluador: string,
    idEvaluado: string
  ): Promise<boolean> {
    return await this.source.yaEvaluo(
      idEvaluacion,
      idEvaluador,
      idEvaluado
    );
  }

  async getPreguntas(): Promise<PreguntaEntity[]> {
    return await this.source.getPreguntas();
  }

  async getNotasPorEvaluado(
    idEvaluacion: string,
    idEvaluado: string,
    tipo: string
  ): Promise<string[]> {
    return await this.source.getNotasPorEvaluado(
      idEvaluacion,
      idEvaluado,
      tipo
    );
  }

  async updatePrivacidad(
    idEvaluacion: string,
    esPrivada: boolean
  ): Promise<void> {
    await this.source.updatePrivacidad(
      idEvaluacion,
      esPrivada
    );
  }
}