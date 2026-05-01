// src/features/studentHome/presentation/context/useGroupDetailsController.ts
import { useEffect, useState, useRef } from "react";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export const useGroupDetailsController = (
  cursoRepository: ICursoRepository,
  idCat: string,
  nombreGrupo: string,
  currentUserEmail: string
) => {
  const [companeros, setCompaneros] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 CACHE EN MEMORIA (por idCat)
  const cacheRef = useRef<Record<string, string[]>>({});

  useEffect(() => {
    const fetchCompaneros = async () => {
      try {
        setIsLoading(true);

        // 🔥 SI YA EXISTE EN CACHE → USARLO
        if (cacheRef.current[idCat]) {
          setCompaneros(
            cacheRef.current[idCat].filter(
              (correo) => correo !== currentUserEmail
            )
          );
          return;
        }

        const fetchedCompaneros =
          await cursoRepository.getCompanerosDeGrupo(idCat, nombreGrupo);

        // 🔥 GUARDAMOS EN CACHE
        cacheRef.current[idCat] = fetchedCompaneros;

        // 🔥 FILTRADO (igual que tu versión original)
        setCompaneros(
          fetchedCompaneros.filter(
            (correo) => correo !== currentUserEmail
          )
        );
      } catch (e) {
        console.error("Error buscando compañeros:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompaneros();
  }, [idCat, nombreGrupo, currentUserEmail]);

  return {
    companeros,
    isLoading,
  };
};