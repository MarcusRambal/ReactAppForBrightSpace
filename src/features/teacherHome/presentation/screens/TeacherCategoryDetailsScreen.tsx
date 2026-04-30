import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { IGrupoRepository } from "@/src/features/grupo/domain/repositories/IGrupoRepository";

// Importamos nuestros controladores
import { useGruposController } from "@/src/features/grupo/presentation/context/useGruposController";
import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";

export default function TeacherCategoryDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { categoria } = route.params;

  const di = useDI();
  const grupoRepo = di.resolve<IGrupoRepository>(TOKENS.GrupoRepo);

  // Instanciamos el controlador del nuevo feature Grupo
  const { gruposOrganizados, isLoadingGrupos } = useGruposController(grupoRepo, categoria.idcat.toString());
  
  // Instanciamos el controlador de Evaluaciones
  const evaluacionesController = useEvaluacionesController(categoria.idcat.toString());

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#F4F5EF" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#1A365D" />
        <Appbar.Content title={categoria.nombre} titleStyle={{ color: "#1A365D", fontWeight: "bold", fontSize: 18 }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* === EVALUACIONES === */}
        <Text style={styles.sectionTitle}>Evaluaciones</Text>
        {evaluacionesController.isLoading ? (
          <ActivityIndicator size="small" color="#1A365D" />
        ) : evaluacionesController.evaluaciones.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay evaluaciones en esta categoría.</Text>
          </View>
        ) : (
          evaluacionesController.evaluaciones.map((evaluacion) => (
            <View key={evaluacion.id} style={styles.evalCard}>
              <View style={styles.evalIcon}>
                <FontAwesome6 name="clipboard-list" size={20} color="#E6C363" />
              </View>
              <View style={styles.evalInfo}>
                <Text style={styles.evalName}>{evaluacion.nom}</Text>
                <Text style={styles.evalType}>Tipo: {evaluacion.tipo}</Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.spacer} />

        {/* === GRUPOS === */}
        <Text style={styles.sectionTitle}>Grupos Formados</Text>
        {isLoadingGrupos ? (
          <ActivityIndicator size="large" color="#1A365D" style={{ marginTop: 20 }} />
        ) : gruposOrganizados.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="users-slash" size={30} color="#ccc" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyText}>Aún no has registrado grupos.</Text>
          </View>
        ) : (
          gruposOrganizados.map((grupo, idx) => (
            <View key={idx} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <FontAwesome6 name="users" size={18} color="#fff" />
                <Text style={styles.groupTitle}>{grupo.nombreGrupo}</Text>
              </View>
              <View style={styles.groupMembers}>
                {grupo.integrantes.map((correo: string, i: number) => (
                  <Text key={i} style={styles.memberText}>• {correo}</Text>
                ))}
              </View>
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
  spacer: { height: 30 },
  emptyState: { padding: 15, alignItems: "center", backgroundColor: "rgba(0,0,0,0.03)", borderRadius: 10, marginBottom: 15 },
  emptyText: { color: "#666", fontSize: 14 },
  evalCard: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: "row", alignItems: "center", elevation: 1 },
  evalIcon: { backgroundColor: "rgba(230, 195, 99, 0.2)", padding: 10, borderRadius: 10, marginRight: 15 },
  evalInfo: { flex: 1 },
  evalName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  evalType: { fontSize: 12, color: "#666", marginTop: 4 },
  groupCard: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, overflow: "hidden", elevation: 2 },
  groupHeader: { backgroundColor: "#1A365D", padding: 15, flexDirection: "row", alignItems: "center" },
  groupTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  groupMembers: { padding: 15 },
  memberText: { fontSize: 14, color: "#333", marginBottom: 6 },
});