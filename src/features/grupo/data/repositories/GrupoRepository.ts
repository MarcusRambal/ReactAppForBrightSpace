import { IGrupoRepository } from "../../domain/repositories/IGrupoRepository";
import { IGrupoSource } from "../dataSources/IGrupoSource";
import { GrupoIntegranteEntity } from "../../domain/entities/GrupoIntegranteEntity";

export class GrupoRepository implements IGrupoRepository {
  private source: IGrupoSource;

  constructor(source: IGrupoSource) {
    this.source = source;
  }

  async getGruposPorCategoria(idCat: string): Promise<GrupoIntegranteEntity[]> {
    return await this.source.getGruposPorCategoria(idCat);
  }
}