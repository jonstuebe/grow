import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, ColorSchemeName, View } from "react-native";
import { Host } from "react-native-portalize";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import NotFoundScreen from "../screens/NotFoundScreen";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";

import type { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import { useThemeColor } from "../components/Themed";
import { app } from "../firebase";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const backgroundColor = useThemeColor("background");

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Host style={{ backgroundColor }}>
        <RootNavigator />
      </Host>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const auth = getAuth(app);

function RootNavigator() {
  const [status, setStatus] = useState<
    "authenticated" | "unauthenticated" | "loading"
  >("loading");

  const backgroundColor = useThemeColor("background");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setStatus("authenticated");
        return;
      }

      setStatus("unauthenticated");
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {status === "authenticated" ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerLargeTitle: true,
              headerLargeTitleShadowVisible: false,
            }}
          />
        </>
      )}

      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
