//src/features/evaluaciones/domain/entities/EvaluacionEntity.ts
export interface EvaluacionEntity {
  id: string;
  idCategoria: string;
  tipo: string;
  nom: string;
  fechaCreacion: Date;
  fechaFinalizacion: Date;
  esPrivada: boolean;
}