// src/features/teacherHome/presentation/context/useTeacherCourseDetailsController.ts

import { useEffect, useState } from "react";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export const useTeacherCourseDetailsController = (
  cursoRepository: ICursoRepository,
  idCurso: string
) => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(true);

  // 🔥 Cache: idCat -> { grupo: [correos] }
  const [datosGrupos, setDatosGrupos] = useState<
    Record<string, Record<string, string[]>>
  >({});

  const [loadingDetalleCategoria, setLoadingDetalleCategoria] = useState<
    Record<string, boolean>
  >({});

  // ===============================
  // 🔥 FETCH CATEGORÍAS (AHORA GLOBAL)
  // ===============================
  const fetchCategorias = async (cursoId: string) => {
    try {
      setIsLoadingCategorias(true);

      const result = await cursoRepository.getCategoriasByCurso(cursoId);

      setCategorias(result);
    } catch (e) {
      console.error("Error cargando categorías:", e);
    } finally {
      setIsLoadingCategorias(false);
    }
  };

  // 🔥 CARGA INICIAL
  useEffect(() => {
    fetchCategorias(idCurso);
  }, [idCurso]);

  // ===============================
  // 🔥 FETCH DETALLE CATEGORÍA (CON CACHE)
  // ===============================
  const fetchDetalleCategoria = async (idCat: string) => {
    // 🔥 CACHE (igual que Flutter)
    if (datosGrupos[idCat]) return;

    try {
      setLoadingDetalleCategoria((prev) => ({
        ...prev,
        [idCat]: true,
      }));

      const listaPlana =
        await cursoRepository.getDatosDeGruposPorCategoria(idCat);

      // 🔥 AGRUPAR (igual que Flutter)
      const agrupados: Record<string, string[]> = {};

      listaPlana.forEach((estudiante: any) => {
        const nombreGrupo = estudiante.nombre?.toString() ?? "";
        const correo = estudiante.Correo?.toString() ?? "";

        if (!agrupados[nombreGrupo]) {
          agrupados[nombreGrupo] = [];
        }

        agrupados[nombreGrupo].push(correo);
      });

      setDatosGrupos((prev) => ({
        ...prev,
        [idCat]: agrupados,
      }));
    } catch (e) {
      console.error("Error cargando detalle categoría:", e);
    } finally {
      setLoadingDetalleCategoria((prev) => ({
        ...prev,
        [idCat]: false,
      }));
    }
  };

  // ===============================
  // 🔥 RETURN
  // ===============================
  return {
    categorias,
    isLoadingCategorias,
    datosGrupos,
    loadingDetalleCategoria,
    fetchDetalleCategoria,
    fetchCategorias, // ✅ ahora sí existe correctamente
  };
};