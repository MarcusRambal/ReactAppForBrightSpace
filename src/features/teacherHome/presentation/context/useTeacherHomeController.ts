import { useEffect, useState } from "react";
import { CursoCurso } from "@/src/features/cursos/domain/entities/CursoCurso";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export const useTeacherHomeController = (cursoRepo: ICursoRepository) => {
  const [cursos, setCursos] = useState<CursoCurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setIsLoading(true);
        // Trae los cursos donde este profesor está asignado
        const fetchedCursos = await cursoRepo.getCursosByProfe();
        setCursos(fetchedCursos);
      } catch (e) {
        console.error("Error buscando cursos del profesor:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursos();
  }, []);

  return {
    cursos,
    isLoading,
  };
};