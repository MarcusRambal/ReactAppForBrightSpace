import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Portal, Modal, TextInput, Button as PaperButton } from "react-native-paper";

import { useAuth } from "@/src/features/auth/presentation/context/authContext";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import { useTeacherHomeController } from "../context/useTeacherHomeController";

import { useGrupoImportController } from "@/src/features/grupo/presentation/context/useGrupoImportController";
import { IGrupoRepository } from "@/src/features/grupo/domain/repositories/IGrupoRepository";

export default function TeacherHomeScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<any>();
  
  const di = useDI();
  const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);
  const grupoRepo = di.resolve<IGrupoRepository>(TOKENS.GrupoRepo);

  // Instanciamos el controlador del Home (ya sin manejarSubidaCSV)
  const { cursos, isLoading, crearCurso, eliminarCurso } = useTeacherHomeController(cursoRepo);
  
  // Instanciamos el controlador para importar CSV
  const { isImporting, importProgress, importarCSV, actualizarCursoConNuevoCSV } = useGrupoImportController(grupoRepo, cursoRepo);

  // Estados para el Modal de Crear Curso
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoNRC, setNuevoNRC] = useState("");

  const handleEliminar = (idCurso: string, nombreCurso: string) => {
    Alert.alert(
      "Eliminar Curso",
      `¿Estás seguro de que deseas eliminar "${nombreCurso}"? Se perderán todos sus grupos y evaluaciones.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => eliminarCurso(idCurso) }
      ]
    );
  };

  const handleCrearCursoSubmit = () => {
    if (!nuevoNombre.trim() || !nuevoNRC.trim()) {
      Alert.alert("Campos incompletos", "Por favor ingresa el nombre y el NRC del curso.");
      return;
    }
    crearCurso(nuevoNRC.trim(), nuevoNombre.trim());
    setModalVisible(false);
    setNuevoNombre("");
    setNuevoNRC("");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoPlaceholder}>
            <FontAwesome6 name="tree" size={20} color="#C49B3E" />
          </View>
          <Text style={styles.title}>Hola, Profesor</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <FontAwesome6 name="arrow-right-from-bracket" size={22} color="#1A365D" />
        </TouchableOpacity>
      </View>

      {/* RESUMEN ACADÉMICO */}
      <View style={styles.resumenCard}>
        <Text style={styles.resumenTitle}>RESUMEN ACADÉMICO</Text>
        <View style={styles.resumenStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Mis Cursos</Text>
            <Text style={styles.statValue}>{cursos.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Alertas</Text>
            <Text style={styles.statValue}>99</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mis Cursos Reales</Text>

      {/* LISTA DE CURSOS */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E6C363" />
        </View>
      ) : cursos.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome6 name="book-open" size={40} color="#ccc" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>No tienes cursos asignados.</Text>
        </View>
      ) : (
        <FlatList
          data={cursos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => {
            const headerColors = ["#4D8DF5", "#009688"];
            const color = headerColors[index % headerColors.length];

            return (
              <View style={styles.card}>
                <View style={[styles.cardTop, { backgroundColor: color }]} />
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <TouchableOpacity 
                      style={styles.courseInfo}
                      onPress={() => navigation.navigate("TeacherCategories", { curso: item })}
                    >
                      <Text style={styles.courseTitle}>{item.nombre}</Text>
                      <Text style={styles.courseId}>Código: {item.id}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => handleEliminar(item.id, item.nombre)} style={styles.deleteBtn}>
                      <FontAwesome6 name="trash-can" size={20} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>

                  {/* 🔥 BOTONES DE CSV CON ESTADOS DE CARGA */}
                  {isImporting ? (
                    <TouchableOpacity style={[styles.csvBtn, styles.csvBtnGold]} disabled>
                       <ActivityIndicator size="small" color="#C49B3E" style={{ marginRight: 8 }}/>
                       <Text style={styles.csvBtnGoldText} numberOfLines={1}>{importProgress || "Procesando..."}</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.csvBtn, styles.csvBtnGold]} onPress={() => importarCSV(item.id)}>
                        <FontAwesome6 name="file-arrow-up" size={14} color="#C49B3E" style={{ marginRight: 8 }} />
                        <Text style={styles.csvBtnGoldText}>Subir grupos por primera vez</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[styles.csvBtn, styles.csvBtnGray]} 
                        onPress={() => {
                          Alert.alert(
                            "Actualizar Grupos",
                            "Esto borrará la lista actual y cargará la del nuevo archivo. ¿Continuar?",
                            [
                              { text: "Cancelar", style: "cancel" },
                              { text: "Sí, actualizar", style: "destructive", onPress: () => actualizarCursoConNuevoCSV(item.id) }
                            ]
                          );
                        }}
                      >
                        <FontAwesome6 name="rotate" size={14} color="#777" style={{ marginRight: 8 }} />
                        <Text style={styles.csvBtnGrayText}>Actualizar lista (.csv)</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}

      {/* BOTÓN FLOTANTE (+) CONECTADO AL MODAL */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <FontAwesome6 name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* MODAL PARA AÑADIR CURSO */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Añadir Nuevo Curso</Text>
          
          <TextInput
            label="Nombre del Curso (ej. Programación Móvil)"
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
            mode="outlined"
            style={{ marginBottom: 15 }}
            activeOutlineColor="#1A365D"
          />
          
          <TextInput
            label="Código / NRC"
            value={nuevoNRC}
            onChangeText={setNuevoNRC}
            mode="outlined"
            keyboardType="numeric"
            style={{ marginBottom: 25 }}
            activeOutlineColor="#1A365D"
          />

          <View style={styles.modalButtons}>
            <PaperButton mode="text" onPress={() => setModalVisible(false)} textColor="#777">
              Cancelar
            </PaperButton>
            <PaperButton mode="contained" onPress={handleCrearCursoSubmit} buttonColor="#1A365D">
              Crear Curso
            </PaperButton>
          </View>
        </Modal>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5EF", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 20 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoPlaceholder: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: "#C49B3E", justifyContent: "center", alignItems: "center", marginRight: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A365D" },
  logoutBtn: { padding: 5 },
  resumenCard: { backgroundColor: "#E6C363", borderRadius: 12, padding: 20, marginBottom: 25 },
  resumenTitle: { textAlign: "center", fontWeight: "bold", fontSize: 16, color: "#333", marginBottom: 15 },
  resumenStatsRow: { flexDirection: "row", justifyContent: "space-around" },
  statBox: { alignItems: "center" },
  statLabel: { fontSize: 14, color: "#333", marginBottom: 5 },
  statValue: { fontSize: 28, fontWeight: "bold", color: "#333" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 15 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#777", textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 20, overflow: "hidden", elevation: 2 },
  cardTop: { height: 40 },
  cardContent: { padding: 15 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 4 },
  courseId: { color: "#888", fontSize: 14 },
  deleteBtn: { padding: 5 },
  csvBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 8, borderWidth: 1, marginBottom: 10 },
  csvBtnGold: { borderColor: "#C49B3E", backgroundColor: "#fff" },
  csvBtnGoldText: { color: "#C49B3E", fontWeight: "500", fontSize: 14 },
  csvBtnGray: { borderColor: "#bbb", backgroundColor: "#fff", marginBottom: 0 },
  csvBtnGrayText: { color: "#777", fontWeight: "500", fontSize: 14 },
  fab: { position: "absolute", bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: "#C49B3E", justifyContent: "center", alignItems: "center", elevation: 5 },
  
  // Estilos del Modal
  modalContainer: { backgroundColor: "white", padding: 20, margin: 20, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1A365D", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 }
});