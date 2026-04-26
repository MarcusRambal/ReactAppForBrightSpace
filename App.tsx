import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { PaperProvider } from "react-native-paper";

import NavigationFlow from "./src/navigationFlow";
import { AuthProvider } from "./src/features/auth/presentation/context/authContext";
import { DIProvider } from "./src/core/di/diProvider";




export default function App() {
  
  return (
    <DIProvider>
      <AuthProvider>
        <PaperProvider>
          <NavigationContainer >
            <NavigationFlow />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </DIProvider>
  );
}
