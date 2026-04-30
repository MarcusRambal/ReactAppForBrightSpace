import React from "react";
import { Text } from "react-native";
import { useAuth } from "./features/auth/presentation/context/authContext";
import AuthStack from "./authStack";
import StudentStack from "./studentStack";
import TeacherStack from "./teacherStack";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function NavigationFlow() {
  const { isLoggedIn, loggedUser, loading } = useAuth();

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        loggedUser?.rol === "estudiante" ? (
          <Stack.Screen name="StudentFlow" component={StudentStack} />
        ) : loggedUser?.rol === "profesor" ? (
          <Stack.Screen name="TeacherFlow" component={TeacherStack} />
        ) : (
          <Stack.Screen name="NoAccess">
            {() => <Text>No tienes permisos</Text>}
          </Stack.Screen>
        )
      ) : (
        <Stack.Screen name="AuthFlow" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}