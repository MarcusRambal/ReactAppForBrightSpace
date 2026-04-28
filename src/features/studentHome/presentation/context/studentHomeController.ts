// src/features/studentHome/presentation/context/studentHomeController.ts

import { useEffect, useState } from "react";
import { CursoMatriculado } from "@/src/features/cursos/domain/entities/CursoMatriculado";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export const useStudentHomeController = (
  cursoRepository: ICursoRepository,
  studentEmail: string
) => {
  const [cursos, setCursos] = useState<CursoMatriculado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 equivalente a onInit()
  useEffect(() => {
    fetchCursos();
  }, [studentEmail]);

  const cargarEvaluaciones = () => {
    if (cursos.length === 0) return;

    const grupos = cursos.flatMap((curso) => curso.grupos);

    // ❌ AÚN NO IMPLEMENTADO (como pediste)
    // evaluacionController.cargarEvaluacionesIncompletasPorGrupos(grupos);
  };

  const fetchCursos = async () => {
    try {
      setIsLoading(true);

      const fetchedCursos =
        await cursoRepository.getCursosByEstudiante(studentEmail);

      setCursos(fetchedCursos);

      // 🔥 MISMA LÓGICA QUE FLUTTER
      // (pero ojo: aquí cursos aún no está actualizado inmediatamente)
      // solución abajo 👇
      const grupos = fetchedCursos.flatMap((c) => c.grupos);

      // ❌ pendiente
      // evaluacionController.cargarEvaluacionesIncompletasPorGrupos(grupos);

    } catch (e) {
      console.error("Error buscando cursos del estudiante:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cursos,
    isLoading,
    fetchCursos,
  };
};