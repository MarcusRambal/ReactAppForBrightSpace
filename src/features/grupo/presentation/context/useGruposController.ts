import { useEffect, useState } from "react";
import { IGrupoRepository } from "../../domain/repositories/IGrupoRepository";

export const useGruposController = (
  grupoRepo: IGrupoRepository,
  idCat: string
) => {
  // Guardaremos un array: [{ nombreGrupo: "Grupo 1", integrantes: ["email1", "email2"] }]
  const [gruposOrganizados, setGruposOrganizados] = useState<any[]>([]);
  const [isLoadingGrupos, setIsLoadingGrupos] = useState(true);

  useEffect(() => {
    const fetchGrupos = async () => {
      if (!idCat) return;
      try {
        setIsLoadingGrupos(true);
        const flatData = await grupoRepo.getGruposPorCategoria(idCat);
        
        // Reducimos la lista plana agrupando los correos por nombre de grupo
        const agrupados = flatData.reduce((acc: any, curr: any) => {
          const nombre = curr.nombre;
          if (!acc[nombre]) acc[nombre] = [];
          acc[nombre].push(curr.correo);
          return acc;
        }, {});

        // Convertimos el diccionario a un array para usar en el mapa/FlatList
        const listAgrupada = Object.keys(agrupados).map(key => ({
          nombreGrupo: key,
          integrantes: agrupados[key],
        }));

        setGruposOrganizados(listAgrupada);
      } catch (e) {
        console.error("Error buscando grupos de la categoría:", e);
      } finally {
        setIsLoadingGrupos(false);
      }
    };

    fetchGrupos();
  }, [idCat]);

  return {
    gruposOrganizados,
    isLoadingGrupos,
  };
};