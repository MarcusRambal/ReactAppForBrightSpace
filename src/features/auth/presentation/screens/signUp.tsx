import React, { useState } from "react";
import { StyleSheet, View, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { Button, HelperText, Snackbar, Text, TextInput } from "react-native-paper";
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
      newErrors.password = "Mínimo 8 caracteres, 1 mayús, 1 minús, 1 número y 1 símbolo.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const isSuccess = await signup(name, email, password);
      if (isSuccess) {
        navigation.navigate("VerificationEmail");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#FFFAFF" }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        {/* Logo Section */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../../../assets/logo_2.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text variant="headlineMedium" style={styles.title}>Crear Cuenta</Text>

          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            error={!!errors.name}
            mode="outlined"
            activeOutlineColor="#D4AF37"
            outlineColor="#ccc"
            textColor="black"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={!!errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            activeOutlineColor="#D4AF37"
            outlineColor="#ccc"
            textColor="black"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={obscurePassword} 
            error={!!errors.password}
            mode="outlined"
            activeOutlineColor="#D4AF37"
            outlineColor="#ccc"
            textColor="black"
            style={styles.input}
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
            contentStyle={styles.buttonContent}
            textColor="black"
          >
            Registrarse
          </Button>

          <Button mode="text" onPress={() => navigation.navigate("Login")} style={{marginTop: 10}} textColor="gray">
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </View>

        <Snackbar visible={!!error} onDismiss={clearError} duration={3000}>
          {error}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f5f3ef",
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
    height: 150,
    marginBottom: 20,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  input: {
    marginBottom: 4,
    backgroundColor: "white",
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#D4AF37',
    marginTop: 10,
  },
  buttonContent: {
    paddingVertical: 6,
  }
});