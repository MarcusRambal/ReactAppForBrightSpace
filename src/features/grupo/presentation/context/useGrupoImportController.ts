import { useState } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { parseCSV } from "@/src/core/utils/csvParser";
import { IGrupoRepository } from "../../domain/repositories/IGrupoRepository";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export const useGrupoImportController = (
  grupoRepo: IGrupoRepository,
  cursoRepo: ICursoRepository
) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState("");

  const procesarArchivo = async (idCurso: string, vaciarAnterior: boolean) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "application/vnd.ms-excel", "text/comma-separated-values"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const file = result.assets[0];

      setIsImporting(true);

      // Si es actualización, vaciamos el curso primero
      if (vaciarAnterior) {
        setImportProgress("Limpiando datos del curso anterior...");
        await cursoRepo.vaciarContenidoCurso(idCurso);
      }

      setImportProgress(vaciarAnterior ? "Procesando nuevo archivo..." : "Leyendo archivo CSV...");
      const rows = await parseCSV(file.uri);

      const categoriasMemoria: Record<string, string> = {};
      const loteEstudiantes: any[] = [];

      // Empezamos en i = 1 para saltar los encabezados (igual que en Flutter)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 8) continue; // Mismo filtro que en Flutter

        const catNom = row[0] ? row[0].toString().trim() : "";
        const grNom = row[1] ? row[1].toString().trim() : "";
        const grCod = row[2] ? row[2].toString().trim() : "";
        const correo = row[7] ? row[7].toString().trim() : "";

        if (!catNom || !correo) continue;

        if (!categoriasMemoria[catNom]) {
          setImportProgress(`Creando categoría: ${catNom}...`);
          const id = await grupoRepo.createCategoria(idCurso, catNom);
          categoriasMemoria[catNom] = id;
        }

        loteEstudiantes.push({
          idCat: categoriasMemoria[catNom],
          idGrupo: `${grCod}_${correo}`, // Misma Primary Key de Flutter
          nombre: grNom,
          Correo: correo,
        });
      }

      if (loteEstudiantes.length > 0) {
        setImportProgress(`Enviando ${loteEstudiantes.length} estudiantes a Roble...`);
        await grupoRepo.createGruposBatch(loteEstudiantes);
      }

      Alert.alert(
        "Éxito",
        vaciarAnterior ? "Lista actualizada correctamente" : "Grupos importados correctamente."
      );

    } catch (e: any) {
      console.error("Error al importar/actualizar CSV:", e);
      Alert.alert(
        "Error",
        vaciarAnterior ? "No se pudo actualizar la lista." : "No se pudo procesar el archivo CSV."
      );
    } finally {
      setIsImporting(false);
      setImportProgress("");
    }
  };

  const importarCSV = (idCurso: string) => procesarArchivo(idCurso, false);
  const actualizarCursoConNuevoCSV = (idCurso: string) => procesarArchivo(idCurso, true);

  return {
    isImporting,
    importProgress,
    importarCSV,
    actualizarCursoConNuevoCSV,
  };
};