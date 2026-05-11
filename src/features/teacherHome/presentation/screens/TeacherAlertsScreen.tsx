import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";
import { ReportePersonalPorEvaluacionModel } from "@/src/features/reportes/data/models/ReportePersonalPorEvaluacionModel";

const ENV = {
    API_BASE: "https://roble-api.openlab.uninorte.edu.co",
    PROJECT_ID: process.env.EXPO_PUBLIC_ROBLE_PROJECT_ID || "",
};

type AlertaEstudiante = {
    cursoNombre: string;
    categoriaNombre: string;
    grupoNombre: string;
    correo: string;
    nota: number;
};

export default function TeacherAlertsScreen() {
    const di = useDI();
    const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

    const [loading, setLoading] = useState(true);
    const [alertas, setAlertas] = useState<AlertaEstudiante[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // =========================
    // 🔐 TOKEN (MISMO MODELO QUE YA FUNCIONA)
    // =========================
    const obtenerToken = async () => {
        let token =
            di.resolve<any>(TOKENS.AuthRepo)?.getToken?.() || null;

        console.log("🔐 TOKEN desde DI:", token);

        if (!token) {
            console.log("⚠️ Buscando token en AsyncStorage...");
            token = await AsyncStorage.getItem("token");
        }

        console.log("🔐 TOKEN final:", token);

        return token;
    };

    // =========================
    // 🚀 INIT
    // =========================
    useEffect(() => {
        cargarAlertas();
    }, []);

    // =========================
    // 🔥 CARGAR ALERTAS
    // =========================
    const cargarAlertas = async () => {
        try {
            setLoading(true);

            const token = await obtenerToken();

            if (!token) {
                console.error("❌ No hay token disponible");
                return;
            }

            if (!ENV.PROJECT_ID) {
                console.error("❌ PROJECT_ID no definido");
                return;
            }

            const cursos = await cursoRepo.getCursosByProfe?.() || [];

            console.log("📚 CURSOS:", cursos.length);

            let resultados: AlertaEstudiante[] = [];

            for (const curso of cursos) {
                const cursoId = curso.id.toString();

                console.log("🔎 Procesando curso:", curso.nombre);

                const bajos =
                    await di
                        .resolve<any>(TOKENS.ReporteController)
                        ?.getEstudiantesBajoRendimiento?.(cursoId);

                console.log("⚠️ BAJOS RENDIMIENTOS:", bajos?.length || 0);

                if (!bajos) continue;

                for (const r of bajos) {
                    const correo = (r.idEstudiante || "").toLowerCase().trim();
                    const idCat = (r.idCategoria || "").toString().trim();

                    let nombreCat = "Categoría Desconocida";
                    let nombreGrupo = "Sin Grupo";

                    try {
                        const categorias =
                            await cursoRepo.getCategoriasByCurso(cursoId);

                        const cat = categorias.find(
                            (c: any) =>
                                c.idcat?.toString().trim() === idCat
                        );

                        if (cat) {
                            nombreCat = cat.nombre;
                        }
                    } catch (e) {
                        console.log("⚠️ error categorias:", e);
                    }

                    try {
                        const grupos =
                            await cursoRepo.getDatosDeGruposPorCategoria(
                                idCat
                            );

                        const grupo = grupos.find(
                            (g: any) =>
                                (g.Correo || "")
                                    .toLowerCase()
                                    .trim() === correo
                        );

                        if (grupo) {
                            nombreGrupo = grupo.nombre;
                        }
                    } catch (e) {
                        console.log("⚠️ error grupos:", e);
                    }

                    resultados.push({
                        cursoNombre: curso.nombre,
                        categoriaNombre: nombreCat,
                        grupoNombre: nombreGrupo,
                        correo,
                        nota: parseFloat(r.nota || "0") || 0,
                    });
                }
            }

            resultados.sort((a, b) => a.nota - b.nota);

            console.log("📊 ALERTAS FINALES:", resultados.length);

            setAlertas(resultados);
        } catch (e) {
            console.error("❌ Error cargando alertas:", e);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await cargarAlertas();
        setRefreshing(false);
    };

    // =========================
    // 🔥 LOADING
    // =========================
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#D32F2F" />
            </View>
        );
    }

    // =========================
    // 🎨 UI
    // =========================
    return (
        <FlatList
            data={alertas}
            keyExtractor={(item, index) =>
                item.correo + index.toString()
            }
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            ListEmptyComponent={
                <View style={styles.center}>
                    <Text>No hay alertas de rendimiento</Text>
                </View>
            }
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.email}>{item.correo}</Text>

                    <Text>Curso: {item.cursoNombre}</Text>
                    <Text>Categoría: {item.categoriaNombre}</Text>
                    <Text>Grupo: {item.grupoNombre}</Text>

                    <Text
                        style={[
                            styles.nota,
                            { color: item.nota < 3 ? "red" : "green" },
                        ]}
                    >
                        {item.nota.toFixed(1)}
                    </Text>
                </View>
            )}
        />
    );
}

// =========================
// 🎨 STYLES
// =========================
const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        backgroundColor: "#fff",
        padding: 15,
        margin: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },

    email: {
        fontWeight: "bold",
        marginBottom: 5,
    },

    nota: {
        marginTop: 8,
        fontWeight: "bold",
        fontSize: 16,
    },
});