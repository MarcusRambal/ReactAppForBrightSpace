import { GrupoIntegranteEntity } from "../entities/GrupoIntegranteEntity";

export interface IGrupoRepository {
  getGruposPorCategoria(idCat: string): Promise<GrupoIntegranteEntity[]>;
}