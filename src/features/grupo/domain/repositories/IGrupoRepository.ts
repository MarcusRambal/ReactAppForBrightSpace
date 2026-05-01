import { GrupoIntegranteEntity } from "../entities/GrupoIntegranteEntity";

export interface IGrupoRepository {
  getGruposPorCategoria(idCat: string): Promise<GrupoIntegranteEntity[]>;
  createCategoria(idCurso: string, nombreCat: string): Promise<string>;
  createGruposBatch(loteEstudiantes: any[]): Promise<void>;
}

