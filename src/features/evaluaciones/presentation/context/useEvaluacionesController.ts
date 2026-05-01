// src/features/evaluaciones/presentation/controllers/useEvaluacionesController.ts

import { useEffect, useState, useRef } from "react";

import { EvaluacionEntity } from "../../domain/entities/EvaluacionEntity";
import { PreguntaEntity } from "../../domain/entities/PreguntaEntity";
import { RespuestaEntity } from "../../domain/entities/RespuestaEntity";

import { IEvaluacionRepository } from "../../domain/repositories/IEvaluacionRepository";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { ILocalPreferences } from "@/src/core/iLocalPreferences";

export const useEvaluacionesController = (idCategoria?: string) => {
    const di = useDI();

    const evaluacionRepo =
        di.resolve<IEvaluacionRepository>(TOKENS.EvaluacionRepo);
    const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);
    const prefs = di.resolve<ILocalPreferences>(TOKENS.LocalPreferences);

    const [evaluaciones, setEvaluaciones] = useState<EvaluacionEntity[]>([]);
    const [preguntas, setPreguntas] = useState<PreguntaEntity[]>([]);
    const [respuestas, setRespuestas] = useState<RespuestaEntity[]>([]);

    const [evaluacionesIncompletas, setEvaluacionesIncompletas] = useState<
        EvaluacionEntity[]
    >([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPreguntas, setIsLoadingPreguntas] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // 🔥 equivalente a _calculandoIncompletas de Flutter
    const calculandoRef = useRef(false);

    // ===============================
    // 🔥 HELPERS
    // ===============================
    const estaVigente = (e: EvaluacionEntity) => {
        const ahora = new Date();
        return ahora > e.fechaCreacion && ahora < e.fechaFinalizacion;
    };

    // ===============================
    // 📥 CARGAR EVALUACIONES
    // ===============================
    const cargarEvaluaciones = async (idCat: string) => {
        try {
            setIsLoading(true);

            const data = await evaluacionRepo.getEvaluacionesByProfe(idCat);
            setEvaluaciones(data);
        } catch (e) {
            console.error("Error cargando evaluaciones:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // ===============================
    // ❓ PREGUNTAS
    // ===============================
    const cargarPreguntas = async () => {
        try {
            setIsLoadingPreguntas(true);

            const data = await evaluacionRepo.getPreguntas();
            setPreguntas(data);
        } catch (e) {
            console.error("Error cargando preguntas:", e);
        } finally {
            setIsLoadingPreguntas(false);
        }
    };

    // ===============================
    // ➕ CREAR EVALUACION
    // ===============================
    const crearEvaluacion = async (
        idCategoria: string,
        tipo: string,
        fechaCreacion: string,
        fechaFinalizacion: string,
        nom: string,
        esPrivada: boolean
    ) => {
        try {
            setIsCreating(true);

            await evaluacionRepo.createEvaluacion(
                idCategoria,
                tipo,
                fechaCreacion,
                fechaFinalizacion,
                nom,
                esPrivada
            );

            console.log("✅ Evaluación creada");
        } catch (e) {
            console.error("Error creando evaluación:", e);
        } finally {
            setIsCreating(false);
        }
    };

    // ===============================
    // 📝 RESPUESTAS
    // ===============================
    const agregarRespuesta = (r: RespuestaEntity) => {
        setRespuestas((prev) => [...prev, r]);
    };

    const limpiarRespuestas = () => {
        setRespuestas([]);
    };
    const enviarRespuestasDirecto = async (respuestasDirectas: RespuestaEntity[]) => {
        try {
            setIsSending(true);

            console.log("📦 enviando:", respuestasDirectas);

            await evaluacionRepo.createRespuestas(respuestasDirectas);

            console.log("✅ Respuestas enviadas");

        } catch (e) {
            console.error("Error enviando respuestas:", e);
        } finally {
            setIsSending(false);
        }
    };
    const enviarRespuestas = async () => {
        try {
            setIsSending(true);

            await evaluacionRepo.createRespuestas(respuestas);

            console.log("✅ Respuestas enviadas");
            limpiarRespuestas();
        } catch (e) {
            console.error("Error enviando respuestas:", e);
        } finally {
            setIsSending(false);
        }
    };

    // ===============================
    // ✔️ YA EVALUO
    // ===============================
    const yaEvaluo = async (
        idEvaluacion: string,
        idEvaluador: string,
        idEvaluado: string
    ) => {
        try {
            return await evaluacionRepo.yaEvaluo(
                idEvaluacion,
                idEvaluador,
                idEvaluado
            );
        } catch (e) {
            console.error("Error validando evaluación:", e);
            return false;
        }
    };

    // ===============================
    // 🔥 EVALUACIONES INCOMPLETAS (FIX FINAL)
    // ===============================
    const cargarEvaluacionesIncompletasPorGrupos = async (grupos: any[]) => {
        if (calculandoRef.current) return;

        try {
            calculandoRef.current = true;
            setIsLoading(true);

            const acumuladas: EvaluacionEntity[] = [];
            const cacheCompaneros: Record<string, string[]> = {};

            // 🔥 obtenemos usuario desde storage (igual que Flutter)
            const prefs = di.resolve<ILocalPreferences>(TOKENS.LocalPreferences);

            const miEmail = await prefs.retrieveData<string>("email");

            if (!miEmail) {
                throw new Error("Usuario no autenticado");
            }
            for (const g of grupos) {
                const idCat = g.idCat;
                const nombreGrupo = g.grupoNombre;

                if (!cacheCompaneros[idCat]) {
                    const comps = await cursoRepo.getCompanerosDeGrupo(
                        idCat,
                        nombreGrupo
                    );
                    cacheCompaneros[idCat] = comps;
                }

                const companeros = cacheCompaneros[idCat];
                const evals = await evaluacionRepo.getEvaluacionesByProfe(idCat);

                for (const ev of evals) {
                    if (!estaVigente(ev)) continue;

                    let completa = true;

                    for (const evaluado of companeros) {
                        if (
                            evaluado.trim().toLowerCase() ===
                            miEmail.trim().toLowerCase()
                        ) {
                            continue;
                        }

                        const ya = await evaluacionRepo.yaEvaluo(
                            ev.id,
                            miEmail,
                            evaluado
                        );

                        if (!ya) {
                            completa = false;
                            break;
                        }
                    }

                    if (!completa) acumuladas.push(ev);
                }
            }

            setEvaluacionesIncompletas(acumuladas);
        } catch (e) {
            console.error("Error evaluaciones incompletas:", e);
        } finally {
            setIsLoading(false);
            calculandoRef.current = false;
        }
    };

    // ===============================
    // 🔐 PRIVACIDAD
    // ===============================
    const cambiarPrivacidad = async (
        idEvaluacion: string,
        esPrivadaActual: boolean
    ) => {
        try {
            const nuevoEstado = !esPrivadaActual;

            setEvaluaciones((prev) =>
                prev.map((e) =>
                    e.id === idEvaluacion ? { ...e, esPrivada: nuevoEstado } : e
                )
            );

            await evaluacionRepo.updatePrivacidad(idEvaluacion, nuevoEstado);

            console.log("✅ Privacidad actualizada");
        } catch (e) {
            console.error("Error cambiando privacidad:", e);
        }
    };

    // ===============================
    // 🔄 AUTO LOAD
    // ===============================
    useEffect(() => {
        if (idCategoria) {
            cargarEvaluaciones(idCategoria);
        }
    }, [idCategoria]);

    return {
        // estados
        evaluaciones,
        preguntas,
        respuestas,
        evaluacionesIncompletas,

        isLoading,
        isLoadingPreguntas,
        isCreating,
        isSending,

        // acciones
        cargarEvaluaciones,
        cargarPreguntas,
        crearEvaluacion,

        agregarRespuesta,
        limpiarRespuestas,
        enviarRespuestas,

        yaEvaluo,
        cargarEvaluacionesIncompletasPorGrupos,
        cambiarPrivacidad,

        enviarRespuestasDirecto,
    };
};