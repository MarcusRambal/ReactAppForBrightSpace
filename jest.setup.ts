import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "react-native-gesture-handler/jestSetup";

// Set test environment variables
process.env.EXPO_PUBLIC_ROBLE_PROJECT_ID = "test-project-id";

console.log("✅ Jest setup file loaded successfully");

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native-gesture-handler", () =>
  jest.requireActual("react-native-gesture-handler"),
);
