// src/features/cursos/domain/entities/CursoCurso.ts

export type CursoCurso = {
  id: string;
  nombre: string;
  idProfesor: string;
};

export const CursoCursoMapper = {
  fromJson(json: any): CursoCurso {
    return {
      id: json.idcurso,
      nombre: json.nom,
      idProfesor: json.idProfesor,
    };
  },

  toJson(entity: CursoCurso): any {
    return {
      idcurso: entity.id,
      nom: entity.nombre,
      idprofesor: entity.idProfesor,
    };
  },
};