import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useAuth } from "@/src/features/auth/presentation/context/authContext";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import { useTeacherHomeController } from "../context/useTeacherHomeController";

export default function TeacherHomeScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<any>();
  
  const di = useDI();
  const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

  const { cursos, isLoading } = useTeacherHomeController(cursoRepo);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, Profesor</Text>
          <Text style={styles.title}>Tus Cursos</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE CURSOS */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1A365D" />
        </View>
      ) : cursos.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome6 name="book-open" size={40} color="#ccc" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>No tienes cursos asignados en este momento.</Text>
        </View>
      ) : (
        <FlatList
          data={cursos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("TeacherCategories", { curso: item })}
            >
              <View style={styles.cardTop} />
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <FontAwesome6 name="chalkboard-user" size={20} color="#1A365D" />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{item.nombre}</Text>
                  <Text style={styles.courseId}>NRC: {item.id}</Text>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color="#1A365D" />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5EF", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25, marginTop: 10 },
  greeting: { fontSize: 16, color: "#666" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A365D" },
  logout: { color: "red", fontWeight: "bold" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#777", textAlign: "center" },
  
  // Card
  card: { backgroundColor: "#fff", borderRadius: 15, marginBottom: 15, overflow: "hidden", elevation: 2 },
  cardTop: { height: 8, backgroundColor: "#1A365D" },
  cardContent: { padding: 20, flexDirection: "row", alignItems: "center" },
  iconContainer: { backgroundColor: "rgba(26, 54, 93, 0.1)", padding: 12, borderRadius: 12, marginRight: 15 },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
  courseId: { color: "#666", fontSize: 14 },
});