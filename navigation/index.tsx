import React, { useEffect, useState } from "react";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { Host } from "react-native-portalize";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { darken } from "polished";

import NotFoundScreen from "../screens/NotFoundScreen";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";

import { Stack } from "./Stack";

import LinkingConfiguration from "./LinkingConfiguration";
import { Theme } from "../theme";
import { app } from "../firebase";

import AddItem from "../screens/AddItem";
import EditItem from "../screens/EditItem";
import Item from "../screens/Item";

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={Theme}>
      <StatusBar style="light" />
      <Host style={{ backgroundColor: Theme.colors.background }}>
        <RootNavigator />
      </Host>
    </NavigationContainer>
  );
}

const auth = getAuth(app);

function RootNavigator() {
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");
  const { colors } = useTheme();

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
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: darken(0.15, colors.card),
        },
      }}
    >
      {status === "authenticated" ? (
        <>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen
            name="Item"
            component={Item}
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="EditItem"
            component={EditItem}
            options={{
              title: "",
            }}
          />
          <Stack.Screen name="AddItem" component={AddItem} options={{ title: "" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
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

      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
    </Stack.Navigator>
  );
}
