import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StudentHomeScreen from "./features/studentHome/presentation/screens/StudentHomeScreen";
import StudentCourseDetailsScreen from "./features/studentHome/presentation/screens/StudentCourseDetailsScreen";
import GroupDetailsScreen from "./features/studentHome/presentation/screens/GroupDetailsScreen";
import StudentPendingEvaluationsScreen from "./features/studentHome/presentation/screens/StudentPendingEvaluationsScreen";

const Stack = createStackNavigator();

export default function StudentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
      <Stack.Screen name="StudentCourseDetails" component={StudentCourseDetailsScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <Stack.Screen name="StudentPendingEvaluationsScreen" component={StudentPendingEvaluationsScreen} />
    </Stack.Navigator>
  );
}