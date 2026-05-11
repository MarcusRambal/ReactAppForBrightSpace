import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { ReportePersonalPorEvaluacionModel } from "@/src/features/reportes/data/models/ReportePersonalPorEvaluacionModel";
import { ICursoRepository } from "@/src/features/cursos/domain/repositories/ICursoRepository";

// 🔥 ENV
const ENV = {
    API_BASE: "https://roble-api.openlab.uninorte.edu.co",
    PROJECT_ID: process.env.EXPO_PUBLIC_ROBLE_PROJECT_ID || "",
};

export default function TeacherReportScreen() {
    const route = useRoute<any>();
    const di = useDI();

    const { idEvaluacion, nombreEvaluacion, idCategoria } = route.params;

    const cursoRepo = di.resolve<ICursoRepository>(TOKENS.CursoRepo);

    // 🔥 AUTH SERVICE (MISMO PATRÓN QUE CURSOS)
    const authService = di.resolve<any>(TOKENS.AuthRemoteDS);

    const [isLoading, setIsLoading] = useState(true);
    const [reportes, setReportes] = useState<ReportePersonalPorEvaluacionModel[]>([]);
    const [grupos, setGrupos] = useState<Record<string, string[]>>({});

    // ===============================
    // 🔐 TOKEN COMO EN CURSOS
    // ===============================
    const getValidToken = async () => {
        try {
            const token = await authService?.getValidToken?.();
            console.log("🔐 TOKEN (AuthService):", token);
            return token;
        } catch (e) {
            console.error("❌ Error obteniendo token:", e);
            return null;
        }
    };

    // ===============================
    // INIT
    // ===============================
    useEffect(() => {
        cargarTodo();
    }, []);

    const cargarTodo = async () => {
        try {
            setIsLoading(true);

            await Promise.all([
                cargarGrupos(),
                cargarReportes(),
            ]);

        } catch (e) {
            console.error("❌ Error general:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // ===============================
    // GRUPOS
    // ===============================
    const cargarGrupos = async () => {
        try {
            const gruposRaw = await cursoRepo.getDatosDeGruposPorCategoria(idCategoria);

            const mapa: Record<string, string[]> = {};

            const nombresUnicos = [...new Set(gruposRaw.map((g: any) => g.nombre))];

            await Promise.all(
                nombresUnicos.map(async (nombreGrupo) => {
                    const integrantes = await cursoRepo.getCompanerosDeGrupo(
                        idCategoria,
                        nombreGrupo
                    );

                    console.log("👥", nombreGrupo, integrantes);

                    mapa[nombreGrupo] = integrantes;
                })
            );

            setGrupos(mapa);

        } catch (e) {
            console.error("❌ Error cargando grupos:", e);
        }
    };

    // ===============================
    // REPORTES (API CON AUTH SERVICE)
    // ===============================
    const cargarReportes = async () => {
        try {
            if (!ENV.PROJECT_ID) {
                console.warn("⚠️ PROJECT_ID no definido");
                return;
            }

            const token = await getValidToken();

            if (!token) {
                console.error("❌ No hay token válido");
                return;
            }

            const url = `${ENV.API_BASE}/database/${ENV.PROJECT_ID}/read?tableName=respuesta&idEvaluacion=${idEvaluacion}`;

            console.log("🌐 URL:", url);
            console.log("🔐 TOKEN:", token);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("📡 STATUS:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ ERROR BODY:", errorText);
                throw new Error(`API ERROR ${response.status}: ${errorText}`);
            }

            const records = await response.json();

            const agrupado: Record<string, any> = {};

            for (const r of records) {
                const correo = (r.idEvaluado || "").toLowerCase().trim();
                const tipo = (r.tipo || "").toLowerCase();
                const nota = parseFloat(r.valor_comentario || "0") || 0;

                if (!correo) continue;

                if (!agrupado[correo]) {
                    agrupado[correo] = {
                        puntualidad: [],
                        contribucion: [],
                        actitud: [],
                        compromiso: [],
                    };
                }

                if (tipo.includes("puntuali")) agrupado[correo].puntualidad.push(nota);
                else if (tipo.includes("contribu")) agrupado[correo].contribucion.push(nota);
                else if (tipo.includes("actitud")) agrupado[correo].actitud.push(nota);
                else if (tipo.includes("compromis")) agrupado[correo].compromiso.push(nota);
            }

            const promedio = (arr: number[]) =>
                arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

            const lista = Object.entries(agrupado).map(
                ([correo, notas]: any) =>
                    new ReportePersonalPorEvaluacionModel(
                        "temp",
                        idEvaluacion,
                        correo,
                        promedio(notas.puntualidad).toFixed(1),
                        promedio(notas.contribucion).toFixed(1),
                        promedio(notas.actitud).toFixed(1),
                        promedio(notas.compromiso).toFixed(1)
                    )
            );

            setReportes(lista);

        } catch (e) {
            console.error("❌ Error cargando reportes:", e);
        }
    };

    // ===============================
    // PROMEDIOS
    // ===============================
    const promedioEstudiante = (r: ReportePersonalPorEvaluacionModel) => {
        const p = parseFloat(r.notaPuntualidad) || 0;
        const c = parseFloat(r.notaContribucion) || 0;
        const a = parseFloat(r.notaActitud) || 0;
        const co = parseFloat(r.notaCompromiso) || 0;

        return (p + c + a + co) / 4;
    };

    const promedioGeneral =
        reportes.length > 0
            ? reportes.map(promedioEstudiante).reduce((a, b) => a + b, 0) / reportes.length
            : 0;

    // ===============================
    // LOADING
    // ===============================
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // ===============================
    // UI
    // ===============================
    return (
        <FlatList
            style={styles.container}
            ListHeaderComponent={
                <>
                    <Text style={styles.title}>{nombreEvaluacion}</Text>

                    <View style={styles.summary}>
                        <Text style={styles.summaryTitle}>PROMEDIO GENERAL</Text>
                        <Text style={styles.summaryValue}>
                            {promedioGeneral.toFixed(1)}
                        </Text>
                        <Text style={styles.summarySub}>
                            {reportes.length} estudiantes
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.refresh} onPress={cargarTodo}>
                        <Text style={styles.refreshText}>Actualizar</Text>
                    </TouchableOpacity>

                    <Text style={styles.section}>Desempeño por grupos</Text>
                </>
            }
            data={Object.entries(grupos)}
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => {
                const [grupo, integrantes] = item;

                const reportesGrupo = reportes.filter((r) =>
                    integrantes.some(
                        (i) => i.toLowerCase() === r.idEstudiante.toLowerCase()
                    )
                );

                const promedioGrupo =
                    reportesGrupo.length > 0
                        ? reportesGrupo.map(promedioEstudiante).reduce((a, b) => a + b, 0) /
                          reportesGrupo.length
                        : 0;

                return (
                    <View style={styles.card}>
                        <Text style={styles.groupTitle}>Grupo: {grupo}</Text>

                        <Text style={{ color: promedioGrupo >= 3 ? "green" : "red" }}>
                            Promedio: {promedioGrupo.toFixed(1)}
                        </Text>

                        {integrantes.map((correo) => {
                            const reporte = reportes.find(
                                (r) =>
                                    r.idEstudiante.toLowerCase() === correo.toLowerCase()
                            );

                            if (!reporte) {
                                return (
                                    <Text key={correo} style={styles.pending}>
                                        {correo} - Pendiente
                                    </Text>
                                );
                            }

                            const prom = promedioEstudiante(reporte);

                            return (
                                <View key={correo} style={styles.student}>
                                    <Text style={styles.studentName}>{correo}</Text>

                                    <Text style={styles.studentDetail}>
                                        P:{reporte.notaPuntualidad} | C:
                                        {reporte.notaContribucion} | A:
                                        {reporte.notaActitud} | Co:
                                        {reporte.notaCompromiso}
                                    </Text>

                                    <Text style={{ color: prom >= 3 ? "green" : "red" }}>
                                        {prom.toFixed(1)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                );
            }}
        />
    );
}

// styles (sin cambios)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F5EF", padding: 20 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", color: "#1A365D" },
    summary: { backgroundColor: "#1A365D", padding: 20, borderRadius: 15, marginTop: 15 },
    summaryTitle: { color: "#ccc", textAlign: "center" },
    summaryValue: { color: "#E6C363", fontSize: 40, textAlign: "center", fontWeight: "bold" },
    summarySub: { color: "#fff", textAlign: "center" },
    refresh: { backgroundColor: "#1A365D", padding: 12, marginTop: 10, borderRadius: 10 },
    refreshText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
    section: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
    card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginTop: 10 },
    groupTitle: { fontWeight: "bold", fontSize: 16 },
    pending: { color: "#999", fontStyle: "italic" },
    student: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 },
    studentName: { fontWeight: "bold" },
    studentDetail: { fontSize: 11 },
});