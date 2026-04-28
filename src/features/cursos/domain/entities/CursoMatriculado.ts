// src/features/cursos/domain/entities/CursoMatriculado.ts

import { CursoCurso, CursoCursoMapper } from "./CursoCurso";

export type CategoriaGrupo = {
  idCat: string;
  categoriaNombre: string;
  grupoNombre: string;
};

export const CategoriaGrupoMapper = {
  fromJson(json: any): CategoriaGrupo {
    return {
      idCat: json.idCat,
      categoriaNombre: json.categoriaNombre,
      grupoNombre: json.grupoNombre,
    };
  },

  toJson(entity: CategoriaGrupo): any {
    return {
      idCat: entity.idCat,
      categoriaNombre: entity.categoriaNombre,
      grupoNombre: entity.grupoNombre,
    };
  },
};
export type CursoMatriculado = {
  curso: CursoCurso;
  grupos: CategoriaGrupo[];
  evaluacionesPendientes: number;
};

export const CursoMatriculadoMapper = {
  fromJson(json: any): CursoMatriculado {
    return {
      curso: CursoCursoMapper.fromJson(json.curso),
      grupos: json.grupos.map((x: any) =>
        CategoriaGrupoMapper.fromJson(x)
      ),
      evaluacionesPendientes: json.evaluacionesPendientes ?? 0,
    };
  },

  toJson(entity: CursoMatriculado): any {
    return {
      curso: CursoCursoMapper.toJson(entity.curso),
      grupos: entity.grupos.map((x) =>
        CategoriaGrupoMapper.toJson(x)
      ),
      evaluacionesPendientes: entity.evaluacionesPendientes,
    };
  },
};