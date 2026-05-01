import { GrupoIntegranteEntity } from "../../domain/entities/GrupoIntegranteEntity";

export interface IGrupoSource {
  getGruposPorCategoria(idCat: string): Promise<GrupoIntegranteEntity[]>;
  createCategoria(idCurso: string, nombreCat: string): Promise<string>;
  createGruposBatch(loteEstudiantes: any[]): Promise<void>;
}