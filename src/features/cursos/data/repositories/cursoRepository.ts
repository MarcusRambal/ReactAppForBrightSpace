// src/features/cursos/data/repositories/cursoRepository.ts

import { ICursoRepository } from "../../domain/repositories/ICursoRepository";
import { CursoCurso } from "../../domain/entities/CursoCurso";
import { IcursoSource } from "../dataSources/IcursoSource";

export class CursoRepository implements ICursoRepository {
    private source: IcursoSource;

    constructor(source: IcursoSource) {
        this.source = source;
    }

    async createCurso(idCurso: string, nom: string): Promise<void> {
        return this.source.createCurso(idCurso, nom);
    }

    async updateCurso(curso: CursoCurso, nomNuevo: string): Promise<void> {
        return this.source.updateCurso(curso, nomNuevo);
    }

    async deleteCurso(idCurso: string): Promise<void> {
        return this.source.deleteCurso(idCurso);
    }

    async getCursosByProfe(): Promise<CursoCurso[]> {
        return this.source.getCursosByProfe();
    }

    async vaciarContenidoCurso(idCurso: string): Promise<void> {
        return this.source.vaciarContenidoCurso(idCurso);
    }

    // 🔴 pendientes para bloque 2
    async getCursosByEstudiante(emailEstudiante: string): Promise<any> {
        return this.source.getCursosByEstudiante(emailEstudiante);
    }

    async getCompanerosDeGrupo(idCat: string, nombreGrupo: string): Promise<any> {
        return this.source.getCompanerosDeGrupo(idCat, nombreGrupo);
    }

    async getCategoriasByCurso(idCurso: string): Promise<any> {
        return this.source.getCategoriasByCurso(idCurso);
    }

    async getDatosDeGruposPorCategoria(idCategoria: string): Promise<any> {
        return this.source.getDatosDeGruposPorCategoria(idCategoria);
    }

}