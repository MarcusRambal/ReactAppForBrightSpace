import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { CursoCurso } from "../../domain/entities/CursoCurso";
import { CursoMatriculado } from "../../domain/entities/CursoMatriculado";

export class LocalCursoCacheSource {
    private prefs: ILocalPreferences;

    // Llaves separadas para no mezclar datos
    private static readonly CACHE_KEY_PROFE = 'cache_cursos_profe';
    private static readonly CACHE_TIMESTAMP_PROFE = 'cache_cursos_profe_timestamp';

    private static readonly CACHE_KEY_ESTUDIANTE = 'cache_cursos_estudiante';
    private static readonly CACHE_TIMESTAMP_ESTUDIANTE = 'cache_cursos_estudiante_timestamp';

    // 10 minutos en milisegundos
    private static readonly CACHE_TTL_MS = 10 * 60 * 1000; 

    constructor(prefs: ILocalPreferences) {
        this.prefs = prefs;
    }

    // ==========================================
    // CACHÉ DEL PROFESOR
    // ==========================================
    async isCacheValidProfe(): Promise<boolean> {
        try {
            const timestampStr = await this.prefs.retrieveData<string>(LocalCursoCacheSource.CACHE_TIMESTAMP_PROFE);
            if (!timestampStr) return false;

            const timestamp = new Date(timestampStr).getTime();
            const now = new Date().getTime();
            const difference = now - timestamp;
            const isValid = difference < LocalCursoCacheSource.CACHE_TTL_MS;

            console.log(`⏱️ [PROFE] Cache age: ${(difference / 60000).toFixed(1)}m / TTL: 10m → ${isValid ? "VALID" : "EXPIRED"}`);
            return isValid;
        } catch (e) {
            return false;
        }
    }

    async cacheCursosProfeData(cursos: CursoCurso[]): Promise<void> {
        await this.prefs.storeData(LocalCursoCacheSource.CACHE_KEY_PROFE, cursos);
        await this.prefs.storeData(LocalCursoCacheSource.CACHE_TIMESTAMP_PROFE, new Date().toISOString());
        console.log(`💾 [PROFE] Cursos cache saved: ${cursos.length}`);
    }

    async getCachedCursosProfeData(): Promise<CursoCurso[]> {
        const decoded = await this.prefs.retrieveData<CursoCurso[]>(LocalCursoCacheSource.CACHE_KEY_PROFE);
        if (!decoded) throw new Error('No cache');
        console.log(`📦 [PROFE] Cache loaded: ${decoded.length} cursos`);
        return decoded;
    }

    // ==========================================
    // CACHÉ DEL ESTUDIANTE
    // ==========================================
    async isCacheValidEstudiante(): Promise<boolean> {
        try {
            const timestampStr = await this.prefs.retrieveData<string>(LocalCursoCacheSource.CACHE_TIMESTAMP_ESTUDIANTE);
            if (!timestampStr) return false;

            const timestamp = new Date(timestampStr).getTime();
            const now = new Date().getTime();
            const difference = now - timestamp;
            const isValid = difference < LocalCursoCacheSource.CACHE_TTL_MS;

            console.log(`⏱️ [ESTUDIANTE] Cache age: ${(difference / 60000).toFixed(1)}m / TTL: 10m → ${isValid ? "VALID" : "EXPIRED"}`);
            return isValid;
        } catch (e) {
            return false;
        }
    }

    async cacheCursosEstudianteData(cursos: CursoMatriculado[]): Promise<void> {
        await this.prefs.storeData(LocalCursoCacheSource.CACHE_KEY_ESTUDIANTE, cursos);
        await this.prefs.storeData(LocalCursoCacheSource.CACHE_TIMESTAMP_ESTUDIANTE, new Date().toISOString());
        console.log(`💾 [ESTUDIANTE] Cursos cache saved: ${cursos.length}`);
    }

    async getCachedCursosEstudianteData(): Promise<CursoMatriculado[]> {
        const decoded = await this.prefs.retrieveData<CursoMatriculado[]>(LocalCursoCacheSource.CACHE_KEY_ESTUDIANTE);
        if (!decoded) throw new Error('No cache');
        console.log(`📦 [ESTUDIANTE] Cache loaded: ${decoded.length} cursos`);
        return decoded;
    }

    // ==========================================
    // LIMPIAR CACHÉ
    // ==========================================
    async clearCache(): Promise<void> {
        await this.prefs.removeData(LocalCursoCacheSource.CACHE_KEY_PROFE);
        await this.prefs.removeData(LocalCursoCacheSource.CACHE_TIMESTAMP_PROFE);
        await this.prefs.removeData(LocalCursoCacheSource.CACHE_KEY_ESTUDIANTE);
        await this.prefs.removeData(LocalCursoCacheSource.CACHE_TIMESTAMP_ESTUDIANTE);
        console.log('🧹 Cache cleared');
    }
}