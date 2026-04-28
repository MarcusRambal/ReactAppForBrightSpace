// src/features/cursos/presentation/context/useCursoController.ts

import { useEffect, useState } from "react";
import { CursoCurso } from "../../domain/entities/CursoCurso";
import { ICursoRepository } from "../../domain/repositories/ICursoRepository";

export function useCursoController(repository: ICursoRepository) {
  const [cursos, setCursos] = useState<CursoCurso[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // equivalente a onInit()
  useEffect(() => {
    cargarCursos();
  }, []);

  // --- CARGAR CURSOS ---
  const cargarCursos = async () => {
    try {
      setIsLoading(true);
      const result = await repository.getCursosByProfe();
      setCursos(result);
    } catch (e) {
      console.error("Error cargando cursos:", e);
      // placeholder UI
      console.log("No se pudieron cargar los cursos");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CREAR CURSO ---
  const crearCurso = async (idCurso: string, nombre: string) => {
    try {
      setIsCreating(true);
      await repository.createCurso(idCurso, nombre);

      console.log("Curso creado correctamente");

      await cargarCursos();
    } catch (e) {
      console.error("Error creando curso:", e);
      console.log("No se pudo crear el curso");
    } finally {
      setIsCreating(false);
    }
  };

  // --- ACTUALIZAR ---
  const actualizarCurso = async (
    curso: CursoCurso,
    nuevoNombre: string
  ) => {
    try {
      setIsUpdating(true);
      await repository.updateCurso(curso, nuevoNombre);

      console.log("Curso actualizado");

      await cargarCursos();
    } catch (e) {
      console.error("Error actualizando curso:", e);
      console.log("No se pudo actualizar el nombre");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- ELIMINAR ---
  const eliminarCurso = async (idCurso: string) => {
    try {
      setIsDeleting(true);

      console.log("Borrando curso y grupos...");

      await repository.deleteCurso(idCurso);

      console.log("Curso eliminado correctamente");

      await cargarCursos();
    } catch (e) {
      console.error("Error eliminando curso:", e);
      console.log("No se pudo eliminar el curso");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- DERIVADOS ---
  const cantidadCursos = cursos.length;

  return {
    cursos,
    cantidadCursos,

    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    cargarCursos,
    crearCurso,
    actualizarCurso,
    eliminarCurso,
  };
}