import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

export default function TeacherCategoriesScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  // Recibimos el curso desde la pantalla anterior
  const { curso } = route.params;

  const di = useDI();
  const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
        const data = await cursoRepo.getCategoriasByCurso(curso.id);
        setCategorias(data);
      } catch (e) {
        console.error("Error buscando categorías:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, [curso.id]);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#F4F5EF" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#1A365D" />
        <Appbar.Content title="Categorías" titleStyle={{ color: "#1A365D", fontWeight: "bold" }} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={styles.courseTitle}>{curso.nombre}</Text>
        <Text style={styles.subtitle}>Selecciona una categoría para ver sus grupos y evaluaciones</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#1A365D" style={{ marginTop: 40 }} />
        ) : categorias.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="folder-open" size={40} color="#ccc" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>No hay categorías creadas.</Text>
          </View>
        ) : (
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.idcat.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("TeacherCategoryDetails", { categoria: item, curso })}
              >
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <FontAwesome6 name="chevron-right" size={16} color="#1A365D" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5EF" },
  content: { padding: 20, flex: 1 },
  courseTitle: { fontSize: 24, fontWeight: "bold", color: "#1A365D", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  emptyState: { alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyText: { color: "#666", fontSize: 16 },
});