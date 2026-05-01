// src/features/studentHome/presentation/screens/GroupDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useAuth } from "@/src/features/auth/presentation/context/authContext";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import {
  CategoriaGrupo,
  CursoMatriculado,
} from "@/src/features/cursos/domain/entities/CursoMatriculado";

import { useGroupDetailsController } from "../context/useGroupDetailsController";
import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";


import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
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

  const evaluacionesController = useEvaluacionesController();

  const [isScreenLoading, setIsScreenLoading] = useState(true);

  // 🔥 equivalente a _cargarTodo() de Flutter
  useFocusEffect(
    useCallback(() => {
      const cargarTodo = async () => {
        try {
          setIsScreenLoading(true);

          await evaluacionesController.cargarEvaluaciones(grupo.idCat);

          await evaluacionesController.cargarEvaluacionesIncompletasPorGrupos([
            grupo,
          ]);
        } finally {
          setIsScreenLoading(false);
        }
      };

      cargarTodo();
    }, [grupo.idCat])
  );

  if (isScreenLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A365D" />
      </View>
    );
  }

  const evaluaciones = evaluacionesController.evaluaciones;
  const incompletas = evaluacionesController.evaluacionesIncompletas;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#F4F5EF" }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#1A365D"
        />
        <Appbar.Content
          title="Detalles del Grupo"
          titleStyle={{ color: "#1A365D", fontWeight: "bold" }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================== EVALUACIONES ================== */}
        <Text style={styles.sectionTitle}>Evaluaciones</Text>

        {evaluaciones.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="clipboard-list" size={40} color="#ccc" />
            <Text style={styles.emptyText}>
              No hay evaluaciones disponibles.
            </Text>
          </View>
        ) : (
          evaluaciones.map((ev, index) => {
            const completa = !incompletas.some((i) => i.id === ev.id);

            return (
              <TouchableOpacity
                key={index}
                style={styles.evalCard}
                onPress={() =>
                  navigation.navigate("EvaluacionDetail", {
                    evaluacion: ev,
                    grupo,
                    cursoMatriculado,
                  })
                }
              >
                <View style={styles.evalIcon}>
                  <FontAwesome6
                    name="clipboard"
                    size={20}
                    color="#E6C363"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.evalTitle}>{ev.nom}</Text>
                  <Text style={styles.evalType}>Tipo: {ev.tipo}</Text>

                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: ev.esPrivada
                          ? "rgba(255,0,0,0.15)"
                          : "rgba(0,128,0,0.15)",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: ev.esPrivada ? "red" : "green",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {ev.esPrivada ? "Privada" : "Pública"}
                    </Text>
                  </View>
                </View>

                <FontAwesome6
                  name={completa ? "check-circle" : "chevron-right"}
                  size={18}
                  color={completa ? "green" : "#1A365D"}
                />
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.spacer} />

        {/* ================== COMPAÑEROS ================== */}
        <Text style={styles.sectionTitle}>Compañeros</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#1A365D" />
        ) : companeros.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="users-slash" size={40} color="#ccc" />
            <Text style={styles.emptyText}>
              No hay compañeros asignados.
            </Text>
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

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A365D",
    marginBottom: 15,
  },

  spacer: { height: 35 },

  evalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  evalIcon: { marginRight: 12 },

  evalTitle: { fontWeight: "bold", fontSize: 16 },

  evalType: { color: "#555", marginTop: 4 },

  badge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  emptyState: { padding: 24, alignItems: "center" },

  emptyText: { color: "#666", fontSize: 16, textAlign: "center" },

  userCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    backgroundColor: "rgba(26, 54, 93, 0.1)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  userEmail: { fontSize: 16, color: "#333", fontWeight: "500" },
});