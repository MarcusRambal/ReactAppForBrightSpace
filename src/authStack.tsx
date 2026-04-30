import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./features/auth/presentation/screens/logIn";
import SignUpScreen from "./features/auth/presentation/screens/signUp";
import VerificationEmail from "./features/auth/presentation/screens/verificatioEmail";

const Stack = createStackNavigator();

export default function AuthStack() {
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="VerificationEmail" component={VerificationEmail} />
    </Stack.Navigator>
  );
}