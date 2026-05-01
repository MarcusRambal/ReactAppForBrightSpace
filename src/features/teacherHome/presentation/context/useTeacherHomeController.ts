import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { CursoCurso } from "@/src/features/cursos/domain/entities/CursoCurso";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export const useTeacherHomeController = (cursoRepo: ICursoRepository) => {
  const [cursos, setCursos] = useState<CursoCurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCursos = async () => {
    try {
      setIsLoading(true);
      const fetchedCursos = await cursoRepo.getCursosByProfe();
      setCursos(fetchedCursos);
    } catch (e) {
      console.error("Error buscando cursos del profesor:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  // 🔥 CREAR CURSO
  const crearCurso = async (idCurso: string, nombre: string) => {
    try {
      setIsLoading(true);
      await cursoRepo.createCurso(idCurso, nombre);
      console.log("Curso creado exitosamente");
      await fetchCursos();
    } catch (e) {
      console.error("Error creando el curso:", e);
      Alert.alert("Error", "No se pudo crear el curso.");
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarCurso = async (idCurso: string) => {
    try {
      console.log("👉 Intentando eliminar el curso con ID:", idCurso);
      setIsLoading(true);
      
      await cursoRepo.deleteCurso(idCurso);
      
      console.log("✅ Curso eliminado correctamente");
      await fetchCursos();
    } catch (e: any) {
      console.error("❌ Error eliminando el curso:", e);
      Alert.alert("Error", `No se pudo eliminar el curso: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 SELECCIONAR CSV
  const manejarSubidaCSV = async (idCurso: string, esActualizacion: boolean) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "application/vnd.ms-excel"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("Selección de archivo cancelada");
        return;
      }

      const file = result.assets[0];
      console.log("Archivo seleccionado:", file.name, file.uri);

      // Aquí conectaremos la lógica de procesamiento del CSV.
      // Dependiendo de si esActualizacion es true o false, vaciaremos los grupos antes o no.
      Alert.alert(
        "Archivo Seleccionado", 
        `Listo para procesar: ${file.name}\n(Lógica de parseo pendiente)`
      );

    } catch (error) {
      console.error("Error al seleccionar el documento:", error);
      Alert.alert("Error", "Hubo un problema al seleccionar el archivo.");
    }
  };

  return {
    cursos,
    isLoading,
    crearCurso,
    eliminarCurso,
    manejarSubidaCSV,
    fetchCursos
  };
};