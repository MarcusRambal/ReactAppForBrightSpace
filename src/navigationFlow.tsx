import React from "react";
import { Text } from "react-native";
import { useAuth } from "./features/auth/presentation/context/authContext";
import AuthStack from "./authStack";
import StudentStack from "./studentStack";
import TeacherStack from "./teacherStack";


export default function NavigationFlow() {
  const { isLoggedIn, loggedUser, loading, isWaitingForValidation } = useAuth();

  console.log("NavigationFlow - isLoggedIn:", isLoggedIn, "isWaitingForValidation:", isWaitingForValidation);

  if (loading) return <Text>Cargando...</Text>;

  if (!isLoggedIn && isWaitingForValidation) return <AuthStack initialRoute="VerificationEmail" />;
  if (!isLoggedIn) return <AuthStack initialRoute="Login" />;

  if (loggedUser?.rol === "estudiante") return <StudentStack />;
  if (loggedUser?.rol === "profesor") return <TeacherStack />;

  return <Text>No tienes permisos</Text>;
}

