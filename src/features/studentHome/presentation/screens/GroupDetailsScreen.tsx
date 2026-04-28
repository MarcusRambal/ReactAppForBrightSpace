// src/features/studentHome/presentation/screens/GroupDetailsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAuth } from "@/src/features/auth/presentation/context/authContext";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import { CategoriaGrupo, CursoMatriculado } from "@/src/features/cursos/domain/entities/CursoMatriculado";
import { useGroupDetailsController } from "../context/useGroupDetailsController";

export default function GroupDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  const { grupo, cursoMatriculado } = route.params as { 
    grupo: CategoriaGrupo; 
    cursoMatriculado: CursoMatriculado;
  };

  const { loggedUser } = useAuth();
  const di = useDI();
  const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

  const { companeros, isLoading } = useGroupDetailsController(
    cursoRepo,
    grupo.idCat,
    grupo.grupoNombre,
    loggedUser?.email ?? ""
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#F4F5EF" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#1A365D" />
        <Appbar.Content title="Detalles del Grupo" titleStyle={{ color: "#1A365D", fontWeight: "bold" }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ==============================================
            1. EVALUACIONES (Hardcodeado por ahora)
            ============================================== */}
        <Text style={styles.sectionTitle}>Evaluaciones</Text>
        
        <View style={styles.emptyState}>
          <FontAwesome6 name="clipboard-list" size={40} color="#ccc" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>No se encontraron evaluaciones disponibles.</Text>
        </View>

        <View style={styles.spacer} />

        {/* ==============================================
            2. COMPAÑEROS
            ============================================== */}
        <Text style={styles.sectionTitle}>Compañeros</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#1A365D" style={{ marginTop: 20 }} />
        ) : companeros.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="users-slash" size={40} color="#ccc" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>No hay compañeros asignados.</Text>
          </View>
        ) : (
          companeros.map((correo, index) => (
            <View key={index} style={styles.userCard}>
              <View style={styles.avatar}>
                <FontAwesome6 name="user" size={20} color="#1A365D" />
              </View>
              <Text style={styles.userEmail}>{correo}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5EF" },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#1A365D", marginBottom: 15 },
  spacer: { height: 35 },
  
  // Empty States
  emptyState: { padding: 24, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#666", fontSize: 16, textAlign: "center" },
  
  // Cards de usuarios
  userCard: { backgroundColor: "#fff", borderRadius: 16, marginBottom: 12, padding: 16, flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: "rgba(26, 54, 93, 0.1)", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 15 },
  userEmail: { fontSize: 16, color: "#333", fontWeight: "500" }
});