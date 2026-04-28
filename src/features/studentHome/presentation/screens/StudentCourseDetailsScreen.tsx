// src/features/studentHome/presentation/screens/StudentCourseDetailsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";import { CursoMatriculado } from "@/src/features/cursos/domain/entities/CursoMatriculado";
export default function StudentCourseDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { cursoMatriculado } = route.params as { cursoMatriculado: CursoMatriculado };

  return (
    <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: "#fff" }}>
            <Appbar.BackAction onPress={() => navigation.goBack()} color="#1A365D" />
            <Appbar.Content 
                title="Detalles del Curso" 
                titleStyle={{ color: "#1A365D", fontWeight: "bold" }} 
            />
        </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER DEL CURSO */}
        <View style={styles.courseHeader}>
          <Text style={styles.courseName}>{cursoMatriculado.curso.nombre}</Text>
          <Text style={styles.courseNrc}>NRC: {cursoMatriculado.curso.id}</Text>
        </View>

        <Text style={styles.sectionTitle}>Tus Grupos de Trabajo</Text>

        {/* LISTA DE GRUPOS */}
        {cursoMatriculado.grupos.map((grupo) => (
          <TouchableOpacity
            key={grupo.idCat}
            style={styles.groupCard}
            onPress={() => navigation.navigate("GroupDetails", { grupo, cursoMatriculado })}
          >
            <View style={styles.groupInfo}>
              <Text style={styles.categoryName}>{grupo.categoriaNombre}</Text>
              <Text style={styles.assignmentText}>Asignación: {grupo.grupoNombre}</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#1A365D" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5EF" },
  scrollContent: { padding: 20 },
  courseHeader: { backgroundColor: "#E6C363", padding: 20, borderRadius: 15, marginBottom: 30 },
  courseName: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  courseNrc: { color: "rgba(255,255,255,0.8)", fontSize: 16, marginTop: 5 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  groupCard: { backgroundColor: "#fff", padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 2 },
  groupInfo: { flex: 1 },
  categoryName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  assignmentText: { color: "#E6C363", fontWeight: "bold" },
});