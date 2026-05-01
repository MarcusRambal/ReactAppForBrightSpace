// src/features/teacherHome/presentation/screens/TeacherCategoriesScreen.tsx

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
  Alert,
  Platform,
} from "react-native";

import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";

export default function TeacherCategoriesScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { curso } = route.params;

  const di = useDI();
  const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

  const evaluacionesController = useEvaluacionesController();

  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  // ===============================
  // 🔥 FETCH CATEGORÍAS
  // ===============================
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

  useFocusEffect(
    useCallback(() => {
      fetchCategorias();
    }, [curso.id])
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#F4F5EF" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#1A365D" />
        <Appbar.Content
          title="Categorías"
          titleStyle={{ color: "#1A365D", fontWeight: "bold" }}
        />
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={styles.courseTitle}>{curso.nombre}</Text>
        <Text style={styles.subtitle}>
          Selecciona una categoría para ver sus grupos y evaluaciones
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#1A365D" style={{ marginTop: 40 }} />
        ) : categorias.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="folder-open" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No hay categorías creadas.</Text>
          </View>
        ) : (
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.idcat.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("TeacherCategoryDetails", {
                    categoria: item,
                    curso,
                  })
                }
              >
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <FontAwesome6 name="chevron-right" size={16} color="#1A365D" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "#fff", fontSize: 24 }}>＋</Text>
      </TouchableOpacity>

      <CreateEvaluationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categorias={categorias}
        evaluacionesController={evaluacionesController}
        onCreated={fetchCategorias}
      />
    </View>
  );
}

//
// 🔥 MODAL CORREGIDO (SIN CRASH)
//
function CreateEvaluationModal({
  visible,
  onClose,
  categorias,
  evaluacionesController,
  onCreated,
}: any) {
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState<string | null>(null);

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  const [esPrivada, setEsPrivada] = useState(true);

  // ===============================
  // 📅 PICKERS ANDROID (CORRECTO)
  // ===============================
  const openInicioPicker = () => {
    DateTimePickerAndroid.open({
      value: fechaInicio || new Date(),
      mode: "date",
      minimumDate: new Date(),
      onChange: (_, date) => {
        if (!date) return;

        DateTimePickerAndroid.open({
          value: date,
          mode: "time",
          onChange: (_, time) => {
            if (!time) return;
            setFechaInicio(time);
          },
        });
      },
    });
  };

  const openFinPicker = () => {
    DateTimePickerAndroid.open({
      value: fechaFin || fechaInicio || new Date(),
      mode: "date",
      minimumDate: fechaInicio || new Date(),
      onChange: (_, date) => {
        if (!date) return;

        DateTimePickerAndroid.open({
          value: date,
          mode: "time",
          onChange: (_, time) => {
            if (!time) return;
            setFechaFin(time);
          },
        });
      },
    });
  };

  // ===============================
  // 🔥 CREAR
  // ===============================
  const handleCreate = async () => {
    if (!categoriaId || !nombre || !fechaInicio || !fechaFin) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (fechaFin <= fechaInicio) {
      Alert.alert("Error", "La fecha fin debe ser mayor a la de inicio");
      return;
    }

    await evaluacionesController.crearEvaluacion(
      categoriaId,
      "General",
      fechaInicio.toISOString(),
      fechaFin.toISOString(),
      nombre,
      esPrivada
    );

    onClose();
    onCreated();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Nueva Evaluación</Text>

          {/* Categorías */}
          {categorias.map((c: any) => (
            <TouchableOpacity
              key={c.idcat}
              onPress={() => setCategoriaId(c.idcat.toString())}
              style={[
                styles.categoryOption,
                categoriaId === c.idcat.toString() && styles.categorySelected,
              ]}
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

          {/* Fecha inicio */}
          <TouchableOpacity style={styles.input} onPress={openInicioPicker}>
            <Text>
              {fechaInicio
                ? fechaInicio.toLocaleString()
                : "Seleccionar fecha inicio"}
            </Text>
          </TouchableOpacity>

          {/* Fecha fin */}
          <TouchableOpacity style={styles.input} onPress={openFinPicker}>
            <Text>
              {fechaFin
                ? fechaFin.toLocaleString()
                : "Seleccionar fecha fin"}
            </Text>
          </TouchableOpacity>

          {/* Switch */}
          <View style={styles.switchRow}>
            <Text>Privada</Text>
            <Switch value={esPrivada} onValueChange={setEsPrivada} />
          </View>

          {evaluacionesController.isCreating ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
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
  container: { flex: 1, backgroundColor: "#F4F5EF" },
  content: { padding: 20, flex: 1 },

  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A365D",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    color: "#666",
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#E6C363",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 18,
    fontWeight: "bold",
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
    marginTop: 10,
  },

  createButton: {
    backgroundColor: "#1A365D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  categoryOption: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 5,
  },

  categorySelected: {
    backgroundColor: "#E6C363",
  },
});