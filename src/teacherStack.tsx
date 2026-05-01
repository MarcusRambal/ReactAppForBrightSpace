import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importamos las pantallas del profesor
import TeacherHomeScreen from "./features/teacherHome/presentation/screens/TeacherHomeScreen";
import TeacherCategoriesScreen from "./features/teacherHome/presentation/screens/TeacherCategoriesScreen";
//import TeacherCategoriesScreen from "./features/teacherHome/presentation/screens/TeacherCourseDetailsScreen";
import TeacherCategoryDetailsScreen from "./features/teacherHome/presentation/screens/TeacherCategoryDetailsScreen"; // Asumiendo que la guardaste aquí también

const Stack = createStackNavigator();

export default function TeacherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} />
      <Stack.Screen name="TeacherCategories" component={TeacherCategoriesScreen} />
      <Stack.Screen name="TeacherCategoryDetails" component={TeacherCategoryDetailsScreen} />
    </Stack.Navigator>
  );
}