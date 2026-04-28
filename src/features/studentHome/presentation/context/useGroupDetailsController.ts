// src/features/studentHome/presentation/context/useGroupDetailsController.ts
import { useEffect, useState } from "react";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export const useGroupDetailsController = (
  cursoRepository: ICursoRepository,
  idCat: string,
  nombreGrupo: string,
  currentUserEmail: string
) => {
  const [companeros, setCompaneros] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompaneros = async () => {
      try {
        setIsLoading(true);
        const fetchedCompaneros = await cursoRepository.getCompanerosDeGrupo(idCat, nombreGrupo);
        
        // 🔥 Filtramos al usuario actual para que no se evalúe a sí mismo
        setCompaneros(fetchedCompaneros.filter(correo => correo !== currentUserEmail));
      } catch (e) {
        console.error("Error buscando compañeros:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompaneros();
  }, [idCat, nombreGrupo]);

  return {
    companeros,
    isLoading,
  };
};