import * as FileSystem from 'expo-file-system/legacy';

export const parseCSV = async (fileUri: string): Promise<string[][]> => {
  try {
    // 1. Leemos el archivo normal
    let fileContent = await FileSystem.readAsStringAsync(fileUri);

    // 🔥 2. TRUCO PARA RESTAURAR ACENTOS Y Ñ
    try {
      // Si el texto se leyó con la codificación incorrecta (CategorÃa), 
      // esto lo fuerza a volver a su estado original (Categoría)
      fileContent = decodeURIComponent(escape(fileContent));
    } catch (e) {
      // Si entra al catch, significa que el texto ya estaba bien codificado, 
      // así que simplemente lo dejamos como estaba.
    }

    // 3. Procesamos las líneas
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");
    
    return lines.map(line => line.split(',').map(item => item.trim()));
  } catch (error) {
    console.error("Error parseando CSV:", error);
    throw error;
  }
};