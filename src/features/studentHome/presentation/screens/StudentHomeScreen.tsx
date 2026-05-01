// src/features/studentHome/presentation/screens/StudentHomeScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "@/src/features/auth/presentation/context/authContext";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { useStudentHomeController } from "../context/studentHomeController";
import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";

import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import { IEvaluacionRepository } from "@/src/features/evaluaciones/domain/repositories/IEvaluacionRepository";
import { CursoMatriculado } from "@/src/features/cursos/domain/entities/CursoMatriculado";


import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
export default function StudentHomeScreen() {
  const { loggedUser, logout } = useAuth();
  const navigation = useNavigation<any>();
  const di = useDI();

  const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);
  const evaluacionRepo = di.resolve<IEvaluacionRepository>(
    TOKENS.EvaluacionRepo
  );

  const { cursos, isLoading } = useStudentHomeController(
    cursoRepo,
    loggedUser?.email ?? ""
  );

  const evaluacionesController = useEvaluacionesController();

  // 🔥 equivalente a ever + initState de Flutter
  useEffect(() => {
    if (cursos.length > 0) {
      const grupos = cursos.flatMap((c) => c.grupos);
      evaluacionesController.cargarEvaluacionesIncompletasPorGrupos(grupos);
    }
  }, [cursos]);

  useFocusEffect(
    useCallback(() => {
      if (cursos.length > 0) {
        const grupos = cursos.flatMap((c) => c.grupos);
        evaluacionesController.cargarEvaluacionesIncompletasPorGrupos(grupos);
      }
    }, [cursos])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (cursos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          Aún no estás inscrito en ningún curso.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 SUMMARY CARD DINÁMICO */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Evaluaciones pendientes</Text>

        {evaluacionesController.isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.summaryValue}>
            {evaluacionesController.evaluacionesIncompletas.length} tareas
          </Text>
        )}
      </View>

      <FlatList
        data={cursos}
        keyExtractor={(item) => item.curso.id}
        renderItem={({ item, index }) => (
          <CourseCard curso={item} index={index} />
        )}
      />
    </View>
  );
}

// 📦 CARD
const CourseCard = ({
  curso,
  index,
}: {
  curso: CursoMatriculado;
  index: number;
}) => {
  const navigation = useNavigation<any>();

  const colors = ["#8B0000", "#E6C363", "#2E8B57", "#4682B4"];
  const color = colors[index % colors.length];

  return (
    <View style={styles.card}>
      <View style={[styles.cardTop, { backgroundColor: color }]} />

      <View style={styles.cardContent}>
        <Text style={styles.courseTitle}>{curso.curso.nombre}</Text>
        <Text style={styles.courseId}>NRC: {curso.curso.id}</Text>

        <Text style={styles.sectionTitle}>Tus asignaciones:</Text>

        {curso.grupos.map((g, i) => (
          <Text key={i} style={styles.groupText}>
            • {g.categoriaNombre}: {g.grupoNombre}
          </Text>
        ))}

        {/* 🔥 BOTÓN DETALLES */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("StudentCourseDetails", {
              cursoMatriculado: curso,
            })
          }
        >
          <Text style={styles.buttonText}>Ver detalles del curso</Text>
        </TouchableOpacity>

        {/* 🔥 BOTÓN NUEVO: EVALUACIONES */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() =>
            navigation.navigate("StudentPendingEvaluationsScreen", {
              cursoMatriculado: curso,
            })
          }
        >
          <Text style={styles.buttonText}>Evaluaciones pendientes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
//
// 🎨 STYLES
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5EF",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  logout: {
    color: "red",
    fontWeight: "bold",
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  summaryTitle: {
    color: "#555",
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  emptyText: {
    fontSize: 16,
    color: "#777",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },

  cardTop: {
    height: 10,
  },

  cardContent: {
    padding: 15,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  courseId: {
    color: "#666",
    marginBottom: 10,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },

  groupText: {
    marginTop: 4,
  },

  button: {
    marginTop: 15,
    backgroundColor: "#E6C363",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
  },
});