import React, { useState } from "react";

//ui
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";


//context
import { useAuth } from "../context/authContext";



export default function VerificationEmail({ navigation}: { navigation: any}) {
  const { validate, error, clearError, emailToVerify } = useAuth();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");


  const handleVerification = async () => {
        try {
            setLoading(true);
            clearError();
            console.log("👉 Validando email con código:", code);
            console.log("👉 Email a validar:", emailToVerify);
            const validationError = await validate(emailToVerify, code);
            if (!validationError) {
              navigation.replace("Login");
            }
        } finally {
            setLoading(false);
        }
  }

  return (
    <Surface style={styles.container}>
      {/* ICONO */}
      <MaterialCommunityIcons name="email-check-outline" size={80} color="#D4AF37" />

      {/* TITULO Y TEXTO */}
      <Text variant="headlineMedium" style={styles.title}>Verificar Email</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enviamos un código a: {"\n"}
        <Text style={{ fontWeight: 'bold' }}>{emailToVerify}</Text>
      </Text>

      {/* CAMPO DE CODIGO */}
      <TextInput
        style={styles.otpInput}
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
        keyboardType="numeric"
        maxLength={6}
        placeholder="000000"
        textAlign="center"
      />

      {/* BOTON PRINCIPAL */}
      <Button mode="contained" style={styles.button} onPress={handleVerification}>
        Verificar Código
      </Button>

      {/* FOOTER ACTIONS */}
      <TouchableOpacity onPress={() => console.log("Reenviando...")}>
        <Text style={styles.footerText}>No recibí el código. Reenviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={{ marginTop: 20 }}>
        <Text style={styles.linkText}>¿Email incorrecto? Volver al registro</Text>
      </TouchableOpacity>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAFF", // Un fondo muy suave si lo deseas
  },
  title: {
    marginVertical: 15,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  otpInput: {
    width: '80%',
    height: 60,
    fontSize: 32,
    letterSpacing: 20, // ¡Esto hace que parezca separado!
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#D4AF37', // Color dorado del icono
  },
  footerText: {
    color: '#888',
    marginTop: 20,
  },
  linkText: {
    color: '#666',
    textDecorationLine: 'underline',
  }
});