// src/features/teacherHome/presentation/screens/TeacherCourseDetailsScreen.tsx

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import { IEvaluacionRepository } from "@/src/features/evaluaciones/domain/repositories/IEvaluacionRepository";

import { useTeacherCourseDetailsController } from "../context/useTeacherCourseDetailsController";
import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";

export default function TeacherCourseDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { curso } = route.params;

  const di = useDI();

  const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);
  const evaluacionRepo = di.resolve<IEvaluacionRepository>(TOKENS.EvaluacionRepo);

  const controller = useTeacherCourseDetailsController(cursoRepo, curso.id);
  const evaluacionesController = useEvaluacionesController();

  const [modalVisible, setModalVisible] = useState(false);

  // ===============================
  // 🔥 RECARGA AL ENTRAR
  // ===============================
  useFocusEffect(
    useCallback(() => {
      controller.fetchCategorias(curso.id);
    }, [curso.id])
  );

  // ===============================
  // 🎨 UI
  // ===============================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>

      {controller.isLoadingCategorias ? (
        <ActivityIndicator size="large" />
      ) : controller.categorias.length === 0 ? (
        <Text>No hay categorías disponibles</Text>
      ) : (
        <FlatList
          data={controller.categorias}
          keyExtractor={(item) => item.idcat.toString()}
          renderItem={({ item }) => {
            const idCat = item.idcat.toString();
            const nombre = item.nombre ?? "Sin nombre";

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("TeacherCategoryDetails", {
                    categoriaId: idCat,
                    nombreCategoria: nombre,
                  })
                }
              >
                <Text style={styles.cardText}>{nombre}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>＋</Text>
      </TouchableOpacity>

      {/* ===============================
          🔥 MODAL CREAR EVALUACIÓN
         =============================== */}
      <CreateEvaluationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categorias={controller.categorias}
        evaluacionesController={evaluacionesController}
      />
    </View>
  );
}

//
// 🔥 MODAL (equivalente al Dialog de Flutter)
//
function CreateEvaluationModal({
  visible,
  onClose,
  categorias,
  evaluacionesController,
}: any) {
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [esPrivada, setEsPrivada] = useState(true);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Nueva Evaluación</Text>

          {/* 🔥 HARDCODE: selector simple (no dropdown real aún) */}
          <Text style={{ marginBottom: 5 }}>Categoría</Text>
          {categorias.map((c: any) => (
            <TouchableOpacity
              key={c.idcat}
              onPress={() => setCategoriaId(c.idcat.toString())}
              style={{
                padding: 8,
                backgroundColor:
                  categoriaId === c.idcat.toString()
                    ? "#E6C363"
                    : "#eee",
                marginBottom: 5,
                borderRadius: 6,
              }}
            >
              <Text>{c.nombre}</Text>
            </TouchableOpacity>
          ))}

          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />

          {/* 🔥 HARDCODE fechas */}
          <TextInput
            placeholder="Fecha inicio (ISO)"
            value={fechaInicio}
            onChangeText={setFechaInicio}
            style={styles.input}
          />

          <TextInput
            placeholder="Fecha fin (ISO)"
            value={fechaFin}
            onChangeText={setFechaFin}
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <Text>Privada</Text>
            <Switch value={esPrivada} onValueChange={setEsPrivada} />
          </View>

          {evaluacionesController.isCreating ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                if (!categoriaId || !nombre || !fechaInicio || !fechaFin) {
                  return;
                }

                evaluacionesController.crearEvaluacion(
                  categoriaId,
                  "General",
                  fechaInicio,
                  fechaFin,
                  nombre,
                  esPrivada
                );

                onClose();
              }}
            >
              <Text style={{ color: "#fff" }}>Crear</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose}>
            <Text style={{ marginTop: 10 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

//
// 🎨 STYLES
//
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

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  cardText: {
    fontWeight: "bold",
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#E6C363",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  createButton: {
    backgroundColor: "#1A365D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
});