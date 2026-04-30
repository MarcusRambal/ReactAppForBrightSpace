import { EvaluacionEntity } from "../entities/EvaluacionEntity";
import { PreguntaEntity } from "../entities/PreguntaEntity";
import { RespuestaEntity } from "../entities/RespuestaEntity";

export interface IEvaluacionRepository {
  createRespuestas(respuestas: RespuestaEntity[]): Promise<void>;

  yaEvaluo(
    idEvaluacion: string,
    idEvaluador: string,
    idEvaluado: string
  ): Promise<boolean>;

  createEvaluacion(
    idCategoria: string,
    tipo: string,
    fechaCreacion: string,
    fechaFinalizacion: string,
    nom: string,
    esPrivada: boolean
  ): Promise<void>;

  getEvaluacionesByProfe(idCategoria: string): Promise<EvaluacionEntity[]>;

  getPreguntas(): Promise<PreguntaEntity[]>;

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