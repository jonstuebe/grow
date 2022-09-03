import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

import "expo-dev-client";
import "react-native-gesture-handler";
import "./firebase";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted",
  "'SplashScreen.show' has already been called for given view controller",
]); // Ignore log notification by message

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
