import { ICursoRepository } from "../../domain/repositories/ICursoRepository";
import { CursoCurso } from "../../domain/entities/CursoCurso";
import { IcursoSource } from "../dataSources/IcursoSource";
import { LocalCursoCacheSource } from "../dataSources/LocalCursoCacheSource";

export class CursoRepository implements ICursoRepository {
    private source: IcursoSource;
    private cacheSource: LocalCursoCacheSource;

    constructor(source: IcursoSource, cacheSource: LocalCursoCacheSource) {
        this.source = source;
        this.cacheSource = cacheSource;
    }

    async createCurso(idCurso: string, nom: string): Promise<void> {
        await this.source.createCurso(idCurso, nom);
        await this.cacheSource.clearCache(); // Limpiamos caché si hay cambios
    }

    async updateCurso(curso: CursoCurso, nomNuevo: string): Promise<void> {
        await this.source.updateCurso(curso, nomNuevo);
        await this.cacheSource.clearCache();
    }

    async deleteCurso(idCurso: string): Promise<void> {
        await this.source.deleteCurso(idCurso);
        await this.cacheSource.clearCache();
    }

    // 🔥 MAGIA CACHÉ PROFESOR
    async getCursosByProfe(): Promise<CursoCurso[]> {
        if (await this.cacheSource.isCacheValidProfe()) {
            try {
                return await this.cacheSource.getCachedCursosProfeData();
            } catch (e) {
                console.log("Error leyendo caché profe, yendo a API...");
            }
        }
        
        const remoteCursos = await this.source.getCursosByProfe();
        await this.cacheSource.cacheCursosProfeData(remoteCursos);
        return remoteCursos;
    }

    async vaciarContenidoCurso(idCurso: string): Promise<void> {
        await this.source.vaciarContenidoCurso(idCurso);
    }

    // 🔥 MAGIA CACHÉ ESTUDIANTE
    async getCursosByEstudiante(emailEstudiante: string): Promise<any> {
        if (await this.cacheSource.isCacheValidEstudiante()) {
            try {
                return await this.cacheSource.getCachedCursosEstudianteData();
            } catch (e) {
                console.log("Error leyendo caché estudiante, yendo a API...");
            }
        }

        const remoteCursos = await this.source.getCursosByEstudiante(emailEstudiante);
        await this.cacheSource.cacheCursosEstudianteData(remoteCursos);
        return remoteCursos;
    }

    async getCompanerosDeGrupo(idCat: string, nombreGrupo: string): Promise<any> {
        return this.source.getCompanerosDeGrupo(idCat, nombreGrupo);
    }

    async getCategoriasByCurso(idCurso: string): Promise<any[]> {
        return this.source.getCategoriasByCurso(idCurso);
    }

    async getDatosDeGruposPorCategoria(idCat: string): Promise<any[]> {
        return this.source.getDatosDeGruposPorCategoria(idCat);
    }
}