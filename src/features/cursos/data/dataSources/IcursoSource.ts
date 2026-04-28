// src/features/cursos/data/dataSources/IcursoSource.ts

import { CursoCurso } from "../../domain/entities/CursoCurso";

export interface IcursoSource {
    createCurso(idCurso: string, nom: string): Promise<void>;

    updateCurso(curso: CursoCurso, nomNuevo: string): Promise<void>;

    deleteCurso(idCurso: string): Promise<void>;

    getCursosByProfe(): Promise<CursoCurso[]>;

    vaciarContenidoCurso(idCurso: string): Promise<void>;
    getCursosByEstudiante(emailEstudiante: string): Promise<any>;
    getCompanerosDeGrupo(idCat: string, nombreGrupo: string): Promise<any>;
    getCategoriasByCurso(idCurso: string): Promise<any>;
    getDatosDeGruposPorCategoria(idCategoria: string): Promise<any>
}