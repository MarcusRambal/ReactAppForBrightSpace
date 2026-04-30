import { GrupoIntegranteEntity } from "../../domain/entities/GrupoIntegranteEntity";

export interface IGrupoSource {
  getGruposPorCategoria(idCat: string): Promise<GrupoIntegranteEntity[]>;
}