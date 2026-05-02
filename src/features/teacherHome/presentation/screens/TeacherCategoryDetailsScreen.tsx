import React from "react";
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

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";

export default function TeacherCategoryDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { categoria } = route.params;

  const di = useDI();
  const grupoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

  // ===============================
  // 🔥 ESTADO GRUPOS (equivalente Flutter)
  // ===============================
  const [gruposOrganizados, setGruposOrganizados] = React.useState<any[]>(
    []
  );
  const [isLoadingGrupos, setIsLoadingGrupos] = React.useState(true);

  const evaluacionesController = useEvaluacionesController(
    categoria.idcat.toString()
  );

  // ===============================
  // 🔥 INIT
  // ===============================
  React.useEffect(() => {
    cargarGrupos();
  }, []);

  // ===============================
  // 🔥 GRUPOS (equivalente fetchDetalleCategoria Flutter)
  // ===============================
  const cargarGrupos = async () => {
    try {
      setIsLoadingGrupos(true);

      const data = await grupoRepo.getDatosDeGruposPorCategoria(
        categoria.idcat.toString()
      );

      // 🔥 convertir formato plano → estructurado
      const agrupado: Record<string, string[]> = {};

      for (const item of data) {
        const nombreGrupo = item.nombre || item.Nombre || item.nombreGrupo;
        const correo = item.Correo || item.correo;

        if (!nombreGrupo || !correo) continue;

        if (!agrupado[nombreGrupo]) {
          agrupado[nombreGrupo] = [];
        }

        agrupado[nombreGrupo].push(correo);
      }

      const finalData = Object.entries(agrupado).map(
        ([nombreGrupo, integrantes]) => ({
          nombreGrupo,
          integrantes,
        })
      );

      setGruposOrganizados(finalData);
    } catch (e) {
      console.error("Error cargando grupos:", e);
    } finally {
      setIsLoadingGrupos(false);
    }
  };

  // ===============================
  // 🎨 UI
  // ===============================
  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <Appbar.Header style={{ backgroundColor: "#F4F5EF" }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#1A365D"
        />
        <Appbar.Content
          title={categoria.nombre}
          titleStyle={{
            color: "#1A365D",
            fontWeight: "bold",
            fontSize: 18,
          }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================= GRUPOS ================= */}
        <Text style={styles.sectionTitle}>Grupos</Text>

        {isLoadingGrupos ? (
          <ActivityIndicator size="large" color="#1A365D" />
        ) : gruposOrganizados.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="users-slash" size={30} color="#ccc" />
            <Text style={styles.emptyText}>
              No hay grupos disponibles.
            </Text>
          </View>
        ) : (
          gruposOrganizados.map((grupo, idx) => (
            <View key={idx} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <FontAwesome6 name="users" size={18} color="#fff" />
                <Text style={styles.groupTitle}>
                  {grupo.nombreGrupo}
                </Text>
              </View>

              <View style={styles.groupMembers}>
                {grupo.integrantes.map((correo: string, i: number) => (
                  <Text key={i} style={styles.memberText}>
                    • {correo}
                  </Text>
                ))}
              </View>
            </View>
          ))
        )}

        <View style={{ height: 30 }} />

        {/* ================= EVALUACIONES ================= */}
        <Text style={styles.sectionTitle}>Evaluaciones</Text>

        {evaluacionesController.isLoading ? (
          <ActivityIndicator size="small" color="#1A365D" />
        ) : evaluacionesController.evaluaciones.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No hay evaluaciones en esta categoría.
            </Text>
          </View>
        ) : (
          evaluacionesController.evaluaciones.map((e) => (
            <View key={e.id} style={styles.evalCard}>
              {/* ICONO */}
              <View style={styles.evalIcon}>
                <FontAwesome6
                  name="clipboard-list"
                  size={18}
                  color="#E6C363"
                />
              </View>

              {/* INFO */}
              <View style={{ flex: 1 }}>
                <Text style={styles.evalName}>{e.nom}</Text>

                <Text style={styles.evalType}>Tipo: {e.tipo}</Text>

                {/* BADGES */}
                <View style={styles.badgeRow}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{e.tipo}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: e.esPrivada
                          ? "rgba(255,0,0,0.15)"
                          : "rgba(0,128,0,0.15)",
                      },
                    ]}
                  >
                    <FontAwesome6
                      name={e.esPrivada ? "lock" : "globe"}
                      size={10}
                      color={e.esPrivada ? "red" : "green"}
                    />
                    <Text
                      style={{
                        color: e.esPrivada ? "red" : "green",
                        fontSize: 10,
                        marginLeft: 4,
                        fontWeight: "bold",
                      }}
                    >
                      {e.esPrivada ? "Privada" : "Pública"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ACCIONES */}
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={[
                    styles.privacyButton,
                    { borderColor: e.esPrivada ? "red" : "green" },
                  ]}
                  onPress={() =>
                    evaluacionesController.cambiarPrivacidad(
                      e.id,
                      e.esPrivada
                    )
                  }
                >
                  <FontAwesome6
                    name={e.esPrivada ? "lock-open" : "lock"}
                    size={10}
                    color={e.esPrivada ? "red" : "green"}
                  />
                  <Text
                    style={{
                      color: e.esPrivada ? "red" : "green",
                      fontSize: 10,
                      marginLeft: 4,
                    }}
                  >
                    {e.esPrivada ? "Publicar" : "Privar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resultButton}
                  onPress={() =>
                    navigation.navigate("TeacherReport", {
                      idEvaluacion: e.id,
                      nombreEvaluacion: e.nom,
                      idCategoria: categoria.idcat,
                    })
                  }
                >
                  <Text style={styles.resultButtonText}>
                    RESULTADOS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ===============================
// 🎨 STYLES
// ===============================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5EF" },
  scrollContent: { padding: 20 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A365D",
    marginBottom: 15,
  },

  emptyState: {
    padding: 20,
    alignItems: "center",
  },

  emptyText: {
    color: "#666",
    fontSize: 14,
  },

  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },

  groupHeader: {
    backgroundColor: "#1A365D",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  groupTitle: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },

  groupMembers: {
    padding: 12,
  },

  memberText: {
    fontSize: 14,
    marginBottom: 4,
  },

  evalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  evalIcon: {
    marginRight: 10,
  },

  evalName: {
    fontWeight: "bold",
    fontSize: 15,
  },

  evalType: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  badgeRow: {
    flexDirection: "row",
    marginTop: 8,
    flexWrap: "wrap",
  },

  typeBadge: {
    backgroundColor: "rgba(26,54,93,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 5,
  },

  typeBadgeText: {
    fontSize: 10,
    color: "#1A365D",
    fontWeight: "bold",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  privacyButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },

  resultButton: {
    backgroundColor: "#1A365D",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },

  resultButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});