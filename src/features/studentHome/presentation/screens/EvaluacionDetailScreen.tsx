// src/features/studentHome/presentation/screens/EvaluacionDetailScreen.tsx
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { useAuth } from "@/src/features/auth/presentation/context/authContext";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { IEvaluacionRepository } from "@/src/features/evaluaciones/domain/repositories/IEvaluacionRepository";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

import { useEvaluacionesController } from "@/src/features/evaluaciones/presentation/context/useEvaluacionesController";
import { useGroupDetailsController } from "../context/useGroupDetailsController";

export default function EvaluacionDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { loggedUser } = useAuth();
    const di = useDI();

    const evaluacionRepo = di.resolve<IEvaluacionRepository>(TOKENS.EvaluacionRepo);
    const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

    const { evaluacion, grupo, cursoMatriculado } = route.params;

    const evaluacionesController = useEvaluacionesController();

    const { companeros, isLoading } = useGroupDetailsController(
        cursoRepo,
        grupo.idCat,
        grupo.grupoNombre,
        loggedUser?.email ?? ""
    );

    const [estadoEvaluacion, setEstadoEvaluacion] = useState<Record<string, boolean>>({});

    // ===============================
    // 🔥 CARGAR ESTADO DE EVALUACIONES
    // ===============================
    useFocusEffect(
        useCallback(() => {
            const cargarEstado = async () => {
                if (!companeros.length) return;

                const results: Record<string, boolean> = {};

                for (const correo of companeros) {
                    try {
                        const ya = await evaluacionesController.yaEvaluo(
                            evaluacion.id,
                            loggedUser?.email ?? "",
                            correo
                        );

                        results[correo] = ya;
                    } catch {
                        results[correo] = false;
                    }
                }

                setEstadoEvaluacion(results);
            };

            cargarEstado();
        }, [companeros])
    );

    // ===============================
    // 🔥 HELPERS
    // ===============================
    const noHaIniciado = new Date(evaluacion.fechaCreacion) > new Date();
    const yaCerro = new Date(evaluacion.fechaFinalizacion) < new Date();

    // ===============================
    // 🎨 UI
    // ===============================
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{evaluacion.nom}</Text>

            <Text style={styles.date}>
                Inicia: {new Date(evaluacion.fechaCreacion).toLocaleString()}
            </Text>
            <Text style={styles.date}>
                Finaliza: {new Date(evaluacion.fechaFinalizacion).toLocaleString()}
            </Text>

            {/* 🔥 BOTÓN RESULTADOS */}
            <TouchableOpacity
                style={styles.resultButton}
                onPress={() => {
                    // 🔥 HARDCODE (pantalla aún no implementada)
                    console.log("Ir a resultados...");
                }}
            >
                <Text style={styles.resultText}>VER MIS RESULTADOS</Text>
            </TouchableOpacity>

            <Text style={styles.section}>Compañeros de Grupo</Text>

            {isLoading ? (
                <ActivityIndicator />
            ) : companeros.length === 0 ? (
                <Text>No hay compañeros</Text>
            ) : (
                <FlatList
                    data={companeros}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text>{item}</Text>
                            {renderAction(item)}
                        </View>
                    )}
                />
            )}
        </View>
    );

    // ===============================
    // 🔥 ACCIONES
    // ===============================
    function renderAction(correo: string) {
        const yaEvaluado = estadoEvaluacion[correo];

        if (yaEvaluado === undefined) {
            return <ActivityIndicator size="small" />;
        }

        if (yaEvaluado) {
            return <Text style={{ color: "green" }}>✔</Text>;
        }

        if (noHaIniciado) {
            return <Text style={{ color: "orange" }}>⏳</Text>;
        }

        if (yaCerro) {
            return <Text style={{ color: "red" }}>🔒</Text>;
        }

        return (
            <TouchableOpacity
                style={styles.evalButton}
                onPress={() => {
                    navigation.navigate("ResponderEvaluacion", {
                        evaluacion,
                        evaluadoCorreo: correo,
                        grupoNombre: grupo.grupoNombre,
                        idCat: grupo.idCat,
                        idCurso: cursoMatriculado.curso.id,
                    });
                }}
            >
                <Text style={{ color: "#fff" }}>Evaluar</Text>
            </TouchableOpacity>
        );
    }
}

// ===============================
// 🎨 STYLES
// ===============================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F4F5EF",
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1A365D",
    },

    date: {
        color: "#555",
        marginTop: 5,
    },

    resultButton: {
        marginTop: 20,
        backgroundColor: "#1A365D",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    resultText: {
        color: "#fff",
        fontWeight: "bold",
    },

    section: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold",
    },

    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    evalButton: {
        backgroundColor: "#1A365D",
        padding: 8,
        borderRadius: 6,
    },
});