// src/features/cursos/domain/repositories/ICursoRepository.ts

import { CursoCurso } from "../entities/CursoCurso";
import { CursoMatriculado } from "../entities/CursoMatriculado";

export interface ICursoRepository {
  createCurso(idCurso: string, nom: string): Promise<void>;

  updateCurso(curso: CursoCurso, nomNuevo: string): Promise<void>;

  deleteCurso(idCurso: string): Promise<void>;

  getCursosByProfe(): Promise<CursoCurso[]>;

  getCursosByEstudiante(emailEstudiante: string): Promise<CursoMatriculado[]>;

  vaciarContenidoCurso(idCurso: string): Promise<void>;

  getCompanerosDeGrupo(idCat: string, nombreGrupo: string): Promise<string[]>;

  getCategoriasByCurso(idCurso: string): Promise<any[]>;

  getDatosDeGruposPorCategoria(idCat: string): Promise<any[]>;
}