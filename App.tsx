import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

import "./firebase";
import "react-native-gesture-handler";

LogBox.ignoreLogs(["AsyncStorage has been extracted"]); // Ignore log notification by message

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
