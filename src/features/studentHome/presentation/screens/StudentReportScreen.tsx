import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { IEvaluacionSource } from "@/src/features/evaluaciones/data/dataSources/IEvaluacionSource";
import { ILocalPreferences } from "@/src/core/iLocalPreferences";

import { ReportePersonalPorEvaluacionModel } from "@/src/features/reportes/data/models/ReportePersonalPorEvaluacionModel";

export default function StudentReportScreen() {
    const route = useRoute<any>();
    const di = useDI();

    const { idEvaluacion, nombreEvaluacion, esPrivada } = route.params;

    const evaluacionSource = di.resolve<IEvaluacionSource>(TOKENS.EvaluacionSource);
    const localPrefs = di.resolve<ILocalPreferences>(TOKENS.LocalPreferences);

    const [isLoading, setIsLoading] = useState(true);
    const [miReporte, setMiReporte] =
        useState<ReportePersonalPorEvaluacionModel | null>(null);

    // ===============================
    // 🔥 INIT
    // ===============================
    useEffect(() => {
        if (esPrivada) {
            setIsLoading(false);
            return;
        }

        cargarMisNotas();
    }, []);

    // ===============================
    // 🔥 CARGAR NOTAS
    // ===============================
    const cargarMisNotas = async () => {
        try {
            const miCorreo = await localPrefs.retrieveData<string>("email");

            if (!miCorreo) {
                console.warn("No hay userId en local storage");
                setIsLoading(false);
                return;
            }

            const puntualidad = await evaluacionSource.getNotasPorEvaluado(
                idEvaluacion,
                miCorreo,
                "Puntualidad"
            );

            const contribucion = await evaluacionSource.getNotasPorEvaluado(
                idEvaluacion,
                miCorreo,
                "Contribuciones"
            );

            const actitud = await evaluacionSource.getNotasPorEvaluado(
                idEvaluacion,
                miCorreo,
                "Actitud"
            );

            const compromiso = await evaluacionSource.getNotasPorEvaluado(
                idEvaluacion,
                miCorreo,
                "Compromiso"
            );

            console.log("miCorreo:", miCorreo);
            console.log("puntualidad:", puntualidad);
            console.log("contribuciones:", contribucion);
            console.log("actitud:", actitud);
            console.log("compromiso:", compromiso);

            if (
                puntualidad.length === 0 &&
                contribucion.length === 0 &&
                actitud.length === 0 &&
                compromiso.length === 0
            ) {
                setIsLoading(false);
                return;
            }

            const calcular = (notas: string[]) => {
                if (!notas.length) return "0.0";
                const suma = notas
                    .map((e) => parseFloat(e) || 0)
                    .reduce((a, b) => a + b, 0);

                return (suma / notas.length).toFixed(1);
            };

            // ✅ 🔥 AQUÍ ESTÁ EL FIX
            const reporte = new ReportePersonalPorEvaluacionModel(
                "temp",
                idEvaluacion,
                miCorreo,
                calcular(puntualidad),
                calcular(contribucion),
                calcular(actitud),
                calcular(compromiso)
            );

            setMiReporte(reporte);

            setIsLoading(false);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    // ===============================
    // 🔢 PROMEDIO
    // ===============================
    const calcularPromedio = (r: ReportePersonalPorEvaluacionModel) => {
        const p = parseFloat(r.notaPuntualidad) || 0;
        const c = parseFloat(r.notaContribucion) || 0;
        const a = parseFloat(r.notaActitud) || 0;
        const co = parseFloat(r.notaCompromiso) || 0;

        return ((p + c + a + co) / 4).toFixed(1);
    };

    // ===============================
    // 🔒 BLOQUEADO
    // ===============================
    const renderBloqueado = () => (
        <View style={styles.center}>
            <Text style={styles.lockTitle}>Calificaciones Ocultas</Text>
            <Text style={styles.lockText}>
                El profesor ha marcado esta evaluación como privada.
            </Text>
        </View>
    );

    // ===============================
    // 📭 VACÍO
    // ===============================
    const renderEmpty = () => (
        <View style={styles.center}>
            <Text style={styles.emptyTitle}>Aún no hay resultados</Text>
            <Text style={styles.emptyText}>
                Tus resultados aparecerán aquí cuando te evalúen.
            </Text>
        </View>
    );

    // ===============================
    // 📊 REPORTE
    // ===============================
    const renderReporte = () => {
        if (!miReporte) return null;

        const promedio = calcularPromedio(miReporte);

        const data = [
            { label: "Puntualidad", value: miReporte.notaPuntualidad },
            { label: "Contribución", value: miReporte.notaContribucion },
            { label: "Actitud", value: miReporte.notaActitud },
            { label: "Compromiso", value: miReporte.notaCompromiso },
        ];

        return (
            <FlatList
                data={data}
                keyExtractor={(item) => item.label}
                ListHeaderComponent={
                    <View style={styles.headerCard}>
                        <Text style={styles.evalName}>{nombreEvaluacion}</Text>
                        <Text style={styles.promedioTitle}>Promedio Final</Text>
                        <Text style={styles.promedioValue}>{promedio}</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>{item.label}</Text>
                        <Text style={styles.itemValue}>
                            {parseFloat(item.value).toFixed(1)}
                        </Text>
                    </View>
                )}
            />
        );
    };

    // ===============================
    // 🔥 RENDER
    // ===============================
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (esPrivada) return renderBloqueado();
    if (!miReporte) return renderEmpty();

    return <View style={styles.container}>{renderReporte()}</View>;
}

// ===============================
// 🎨 STYLES
// ===============================
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
        padding: 20,
    },

    headerCard: {
        backgroundColor: "#1A365D",
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },

    evalName: {
        color: "#ccc",
        textAlign: "center",
        marginBottom: 10,
    },

    promedioTitle: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },

    promedioValue: {
        backgroundColor: "#E6C363",
        textAlign: "center",
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 10,
        borderRadius: 10,
        padding: 10,
    },

    item: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    itemTitle: {
        fontWeight: "bold",
    },

    itemValue: {
        fontWeight: "bold",
        color: "#1A365D",
    },

    lockTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },

    lockText: {
        textAlign: "center",
        color: "#666",
        marginTop: 10,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },

    emptyText: {
        textAlign: "center",
        color: "#666",
        marginTop: 10,
    },
});