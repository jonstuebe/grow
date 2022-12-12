import { Ionicons } from "@expo/vector-icons";
import { useCallback, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { iOSColors } from "react-native-typography";
import { signInWithEmailAndPassword, signOut } from "@firebase/auth";
import * as SecureStore from "expo-secure-store";

import { auth } from "../firebase";
import { useNavigation } from "../hooks/useHomeNavigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItemsQueryKey } from "../queries/useItemsQuery";

export default function SwitchAccounts() {
  const { setOptions, goBack, navigate } = useNavigation<"SwitchAccounts">();
  const queryClient = useQueryClient();
  const query = useQuery(["accounts"], async () => {
    const accounts = await SecureStore.getItemAsync("accounts");

    if (accounts !== null) {
      const accountsObj = JSON.parse(accounts) as Record<string, string>;

      return Object.keys(accountsObj).map((key) => {
        return {
          email: key,
          password: accountsObj[key],
        };
      });
    }

    return undefined;
  });

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <Pressable onPress={() => goBack()}>
          <Ionicons name="close" color={iOSColors.gray} size={24} />
        </Pressable>
      ),
    });
  }, [goBack]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="interactive"
      style={{ flex: 1 }}
    >
      <TableView
        appearance="dark"
        style={{
          marginHorizontal: 16,
        }}
      >
        <Section roundedCorners hideSurroundingSeparators>
          {query.data ? (
            query.data.map(({ email, password }, index) => {
              return (
                <Cell
                  key={index}
                  title={email}
                  accessory="DisclosureIndicator"
                  onPress={() => {
                    signInWithEmailAndPassword(auth, email, password).then(
                      () => {
                        queryClient.invalidateQueries(getItemsQueryKey());
                        navigate("Home");
                      }
                    );
                  }}
                />
              );
            })
          ) : (
            <ActivityIndicator size="large" />
          )}
        </Section>
      </TableView>
    </ScrollView>
  );
}
