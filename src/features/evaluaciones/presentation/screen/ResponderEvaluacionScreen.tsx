// src/features/evaluaciones/presentation/screens/ResponderEvaluacionScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { useEvaluacionesController } from "../context/useEvaluacionesController";
import { useDI } from "@/src/core/di/diProvider";
import { TOKENS } from "@/src/core/di/tokens";

import { RespuestaEntity } from "../../domain/entities/RespuestaEntity";
import { ILocalPreferences } from "@/src/core/iLocalPreferences";

export default function ResponderEvaluacionScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const di = useDI();

    const {
        evaluacion,
        evaluadoCorreo,
        grupoNombre,
        idCat,
        idCurso,
    } = route.params;

    const controller = useEvaluacionesController();

    const localPrefs = di.resolve<ILocalPreferences>(TOKENS.LocalPreferences);

    const [index, setIndex] = useState(0);
    const [miId, setMiId] = useState<string | null>(null);
    const [respuestasTemp, setRespuestasTemp] = useState<RespuestaEntity[]>([]);

    const valores = [5, 4, 3, 2];
    const opciones = ["Excelente", "Bueno", "Adecuado", "Podría mejorar"];

    // ===============================
    // 🔥 INIT
    // ===============================
    useEffect(() => {
        const init = async () => {
            const userId = await localPrefs.retrieveData<string>("userId");
            setMiId(userId);

            await controller.cargarPreguntas();
        };

        init();
    }, []);

    // ===============================
    // 🔥 SELECCIONAR OPCIÓN
    // ===============================
    const seleccionarOpcion = (valor: number) => {
        const pregunta = controller.preguntas[index];
        const idPreguntaStr = pregunta.idPregunta.toString();

        setRespuestasTemp((prev) => {
            const indexExistente = prev.findIndex(
                (r) => r.idPregunta === idPreguntaStr
            );

            const nuevaRespuesta: RespuestaEntity = {
                idEvaluacion: evaluacion.id.toString(),
                idEvaluador: miId!,
                idEvaluado: evaluadoCorreo,
                idPregunta: idPreguntaStr,
                tipo: pregunta.tipo,
                valorComentario: valor.toString(),
            };

            if (indexExistente !== -1) {
                const copia = [...prev];
                copia[indexExistente] = nuevaRespuesta;
                return copia;
            } else {
                return [...prev, nuevaRespuesta];
            }
        });

        if (index < controller.preguntas.length - 1) {
            setIndex(index + 1);
        }
    };

    // ===============================
    // 🔥 FINALIZAR
    // ===============================
    const finalizarEvaluacion = async () => {
        try {
            navigation.goBack();

            await controller.enviarRespuestasDirecto(respuestasTemp);

        } catch (e) {
            console.error("Error enviando evaluación:", e);
        }
    };

    // ===============================
    // 🔥 LOADING
    // ===============================
    if (controller.isLoadingPreguntas || miId === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (controller.preguntas.length === 0) {
        return (
            <View style={styles.center}>
                <Text>No hay preguntas</Text>
            </View>
        );
    }

    const pregunta = controller.preguntas[index];

    const yaRespondida = respuestasTemp.some(
        (r) => r.idPregunta === pregunta.idPregunta.toString()
    );

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <Text style={styles.header}>
                Evaluando a {evaluadoCorreo}
            </Text>

            {/* PREGUNTA */}
            <Text style={styles.pregunta}>{pregunta.pregunta}</Text>

            {/* OPCIONES */}
            {opciones.map((op, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.button}
                    onPress={() => seleccionarOpcion(valores[i])}
                >
                    <Text style={styles.buttonText}>
                        {op} ({valores[i]})
                    </Text>
                </TouchableOpacity>
            ))}

            {/* PROGRESO */}
            <Text style={styles.progreso}>
                Pregunta {index + 1} de {controller.preguntas.length}
            </Text>

            {/* FINALIZAR */}
            {index === controller.preguntas.length - 1 && (
                <TouchableOpacity
                    style={[
                        styles.finalButton,
                        { opacity: yaRespondida ? 1 : 0.5 },
                    ]}
                    disabled={!yaRespondida}
                    onPress={finalizarEvaluacion}
                >
                    <Text style={styles.finalText}>Finalizar evaluación</Text>
                </TouchableOpacity>
            )}
        </View>
    );
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
    },

    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },

    pregunta: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 30,
    },

    button: {
        backgroundColor: "#E6C363",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },

    buttonText: {
        fontWeight: "bold",
        textAlign: "center",
    },

    progreso: {
        marginTop: 20,
        textAlign: "center",
        color: "#555",
    },

    finalButton: {
        marginTop: 20,
        backgroundColor: "green",
        padding: 15,
        borderRadius: 10,
    },

    finalText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});