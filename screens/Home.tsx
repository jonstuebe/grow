import { useMemo } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Dinero from "dinero.js";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { lighten } from "polished";

import { db, auth } from "../firebase";

import { useTheme } from "../theme";
import { getItemAmount } from "../utils";

import ActionSheetButton from "../components/ActionSheetButton";
import { Text } from "../components/Text";
import SavingsCard from "../components/SavingsCard";
import Button from "../components/Button";

import { RootStackParamList, SavingsItem, SavingsItemAmount } from "../types";

export default function Home() {
  const { colors } = useTheme();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

  const [user] = useAuthState(auth);
  const [value, loading, error] = useCollection(
    query(collection(db, "items-v2"), where("uid", "==", user?.uid), orderBy("title", "asc")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const data = useMemo(() => {
    const items: SavingsItem[] = [];

    if (!loading && !error) {
      value?.docs.map((doc) => {
        const itemData = doc.data();

        items.push({
          id: doc.id,
          amounts: [] as SavingsItemAmount[],
          ...itemData,
        } as SavingsItem);
      });
    }

    return items;
  }, [error, loading, value?.docs]);

  const totalSaved = useMemo(() => {
    const amount = data.reduce((acc, cur) => {
      return acc + getItemAmount(cur);
    }, 0);

    const value = Dinero({ amount: parseFloat(amount.toFixed(2)) * 100, currency: "USD" });

    return value.hasSubUnits() ? value.toFormat("$0,0.00") : value.toFormat("$0,0");
  }, [data]);

  const { bottom } = useSafeAreaInsets();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        ListHeaderComponent={() => {
          if (data.length === 0) {
            return null;
          }

          return (
            <LinearGradient
              colors={["rgb(0,0,0)", "rgb(0,0,0)", "rgba(0,0,0,0.8)", "rgba(0,0,0,0)"]}
              locations={[0, 0.6, 0.8, 1]}
              style={{
                alignItems: "center",
                paddingVertical: 120,
              }}
            >
              <Text size={24} weight="medium" color="textDim">
                Total Saved
              </Text>
              <Text size={48} weight="semibold" color="text">
                {totalSaved}
              </Text>
            </LinearGradient>
          );
        }}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <SavingsCard
              item={item}
              style={[
                index === 0
                  ? {
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }
                  : index + 1 === data.length
                  ? {
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                    }
                  : undefined,
                data.length === 1
                  ? {
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                    }
                  : undefined,
              ]}
            />
          );
        }}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: colors.border }} />
        )}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                size={28}
                weight="semibold"
                style={{
                  marginBottom: 24,
                }}
              >
                No items found
              </Text>
              <Button
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigate("AddItem");
                }}
              >
                Add Item
              </Button>
            </View>
          );
        }}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          flex: 1,
          marginHorizontal: 16,
        }}
      />
      <Pressable
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigate("AddItem");
        }}
        style={({ pressed }) => ({
          position: "absolute",
          bottom: bottom > 0 ? bottom : 12,
          right: 12,
          width: 56,
          height: 56,
          borderRadius: 56 / 2,
          backgroundColor: pressed ? lighten(0.1, "#3178c6") : "#3178c6",
          alignItems: "center",
          justifyContent: "center",

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
        })}
      >
        <Ionicons
          name="add"
          color={"white"}
          size={32}
          style={{
            marginLeft: 2,
          }}
        />
      </Pressable>
      <ActionSheetButton
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Logout", "Cancel"],
              destructiveButtonIndex: 0,
              cancelButtonIndex: 1,
              userInterfaceStyle: "dark",
            },
            async (buttonIndex) => {
              if (buttonIndex === 0) {
                await signOut(auth);
              }
            }
          );
        }}
      />
    </>
  );
}
