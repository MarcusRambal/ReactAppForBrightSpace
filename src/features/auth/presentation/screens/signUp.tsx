import React, { useState } from "react";

//ui
import { Button, HelperText, Snackbar, Surface, Text, TextInput } from "react-native-paper";
import { StyleSheet, View, Keyboard } from "react-native";

//context
import { useAuth } from "../context/authContext";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignUp({ navigation }: { navigation: any }) {
  const { signup, error, clearError } = useAuth();
  
  const [name, setName] = useState("Marcus");
  const [email, setEmail] = useState("mpreston@uninorte.edu.co");
  const [password, setPassword] = useState("ThePassword!1.");
  const [obscurePassword, setObscurePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    let newErrors: FormErrors = {};
    let isValid = true;

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-z]+[0-9]*@uninorte\.edu\.co$/;
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$_.\-])[A-Za-z\d!@#$_\-\.]{8,}$/;

    if (!nameRegex.test(name)) {
      newErrors.name = "Nombre solo debe contener letras.";
      isValid = false;
    }

    if (!emailRegex.test(email)) {
      newErrors.email = "Formato inválido. Debe ser usuario@uninorte.edu.co";
      isValid = false;
    }

    if (!passwordRegex.test(password)) {
      newErrors.password = "Mínimo 8 caracteres, 1 mayús, 1 minús, 1 número y 1 símbolo (!@#$_-).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) return; 

    try {

      await signup(name, email, password);
      navigation.navigate("VerificationEmail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Crear Cuenta
      </Text>

      {/* NAME */}
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>

      {/* EMAIL */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={!!errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

      {/* PASSWORD */}
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={obscurePassword} 
        error={!!errors.password}
        right={
          <TextInput.Icon
            icon={obscurePassword ? "eye-outline" : "eye-off-outline"}
            onPress={() => setObscurePassword(!obscurePassword)}
          />
        }
      />
      <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Registrarse
      </Button>

      <Button mode="text" onPress={() => navigation.navigate("Login") } disabled={loading}>
        Back to Login
      </Button>

      <Snackbar visible={!!error} onDismiss={clearError} duration={3000}>
        {error}
      </Snackbar>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 15,
  }
});