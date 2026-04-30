import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";

export default function StudentPendingEvaluationsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { cursoMatriculado } = route.params;

  const evaluacionesController = useEvaluacionesController();

  // ===============================
  // 🔥 CARGA INICIAL
  // ===============================
  useEffect(() => {
    const grupos = cursoMatriculado.grupos;

    evaluacionesController.cargarEvaluacionesIncompletasPorGrupos(grupos);
  }, []);

  const evaluaciones = evaluacionesController.evaluacionesIncompletas;

  // ===============================
  // 🎨 UI
  // ===============================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluaciones Pendientes</Text>

      {evaluacionesController.isLoading ? (
        <ActivityIndicator size="large" />
      ) : evaluaciones.length === 0 ? (
        <Text style={styles.empty}>
          No tienes evaluaciones pendientes
        </Text>
      ) : (
        <FlatList
          data={evaluaciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            // ✅ GRUPOS REALES (SIN SIMULACIÓN)
            const grupo =
              cursoMatriculado.grupos.find(
                (g: any) => g.idCat == item.idCategoria
              ) || cursoMatriculado.grupos[0];

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  navigation.navigate("EvaluacionDetail", {
                    evaluacion: item,
                    grupo: grupo,
                    cursoMatriculado: cursoMatriculado,
                  });

                  // 🔄 RECARGA AL VOLVER (igual Flutter)
                  setTimeout(() => {
                    evaluacionesController.cargarEvaluacionesIncompletasPorGrupos(
                      cursoMatriculado.grupos
                    );
                  }, 300);
                }}
              >
                <Text style={styles.name}>{item.nom}</Text>

                <Text style={styles.sub}>
                  Categoría: {grupo.categoriaNombre}
                </Text>

                <Text style={styles.sub}>Tipo: {item.tipo}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

// ===============================
// 🎨 ESTILOS
// ===============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5EF",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,

    // sombra ligera (similar Flutter elevation)
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  sub: {
    color: "#555",
    marginTop: 4,
  },
});