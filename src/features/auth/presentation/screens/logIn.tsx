import React, { useState, useRef } from "react";
import { StyleSheet, View, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { Button, HelperText, Snackbar, Surface, Text, TextInput } from "react-native-paper";
import { useAuth } from "../context/authContext";



interface FormErrors {
  email?: string;
  password?: string;
}

export default function LogIn({ navigation }: { navigation: any }) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("acoronellm@uninorte.edu.co");
  const [password, setPassword] = useState("ThePassword!1.");
  const [obscurePassword, setObscurePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordRef = useRef<any>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = "Enter email";
    else if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Enter password";
    else if (password.length < 6) newErrors.password = "Too short";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!validate()) return;
    try {
      setLoading(true);
      await login(email.trim(), password);
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


        <View   style={styles.imageContainer}> 
          <Image
            source={require("../../../../../assets/logo_2.png")}
            style={styles.image}
        />
        </View>


        <View style={styles.inputContainer}>
        
        <Text variant="headlineMedium" style={styles.title}>Bienvenido</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={!!errors.email}
          textColor="black"
          outlineColor="#ccc"         
          activeOutlineColor="#D4AF37"
          style={styles.input}
          mode="outlined"
        />
        <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

        <TextInput
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={obscurePassword}
          right={<TextInput.Icon icon={obscurePassword ? "eye-outline" : "eye-off-outline"} onPress={() => setObscurePassword(!obscurePassword)} />}
          error={!!errors.password}
          outlineColor="#ccc"          
          activeOutlineColor="#D4AF37"
          textColor="black"
          style={styles.input}
          mode="outlined"
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
          Log In
        </Button>

        <Button mode="text" onPress={() => navigation.navigate("SignUp")} style={{marginTop: 10}} textColor="gray" >
          Sin cuenta? Crea una aquí
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
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: 200,
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
    borderRadius: 20,
    color: "black",
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#D4AF37',
  },
  buttonContent: {
    paddingVertical: 6,
  }
});