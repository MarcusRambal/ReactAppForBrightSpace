// src/navigationFlow.tsx
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";

import { useAuth } from "./features/auth/presentation/context/authContext";
import LoginScreen from "./features/auth/presentation/screens/logIn";
import StudentHomeScreen from "./features/studentHome/presentation/screens/StudentHomeScreen";
import SettingScreen from "./features/settings/settingScreen";

// 🔥 NUEVAS PANTALLAS (Asegúrate de crearlas en la ruta correcta)
import StudentCourseDetailsScreen from "./features/studentHome/presentation/screens/StudentCourseDetailsScreen";
import GroupDetailsScreen from "./features/studentHome/presentation/screens/GroupDetailsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ContentTabs() {
  const { logout } = useAuth();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Profile"
        component={SettingScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user" size={24} color={color} iconStyle="solid" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function NavigationFlow() {
  const { isLoggedIn, loggedUser, loading } = useAuth();

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <Stack.Navigator
      key={isLoggedIn ? "user" : "guest"}
      screenOptions={{ headerShown: false }} // Podemos ocultar el header global y usar el propio de cada pantalla
    >
      {isLoggedIn ? (
        loggedUser?.rol === "estudiante" ? (
          // 🔥 AGRUPAMOS LAS RUTAS DEL ESTUDIANTE EN UN FRAGMENTO
          <>
            <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
            <Stack.Screen name="StudentCourseDetails" component={StudentCourseDetailsScreen} />
            <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
          </>
        ) : loggedUser?.rol === "profesor" ? (
          <Stack.Screen name="TeacherHome">
            {() => <Text>Teacher Home - {loggedUser?.email}</Text>}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="NoAccess">
            {() => <Text>No tienes permisos</Text>}
          </Stack.Screen>
        )
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}