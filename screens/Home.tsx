import { useMemo } from "react";
import {
  ActionSheetIOS,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { getFirestore, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Ionicons } from "@expo/vector-icons";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import Color from "color";
import { getAuth, signOut } from "firebase/auth";
import * as Haptics from "expo-haptics";

import { app } from "../firebase";

import useColorScheme from "../hooks/useColorScheme";
import { useModalize } from "../hooks/useModalize";

import AddItem from "./AddItem";
import ActionSheetButton from "../components/ActionSheetButton";
import { Text, useThemeColor } from "../components/Themed";
import SavingsCard, { SavingsCardProps } from "../components/SavingsCard";
import Button from "../components/Button";

export default function Home() {
  const scheme = useColorScheme();
  const [user] = useAuthState(getAuth(app));
  const [value, loading, error] = useCollection(
    query(
      collection(getFirestore(app), "items"),
      where("uid", "==", user?.uid)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const data = useMemo(() => {
    let items: SavingsCardProps[] = [];

    if (!loading && !error) {
      value?.docs.map((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        } as SavingsCardProps);
      });
    }

    return items;
  }, [loading, value]);

  const { bottom } = useSafeAreaInsets();
  const { ref: modalRef, open, close } = useModalize();

  const backgroundColor = useThemeColor("background");

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlatList
        ListHeaderComponent={() => {
          if (data.length === 0) {
            return null;
          }

          return (
            <LinearGradient
              colors={
                scheme === "light"
                  ? [
                      "rgb(242,242,242)",
                      "rgb(242,242,242)",
                      "rgba(242,242,242,0.8)",
                      "rgba(242,242,242,0)",
                    ]
                  : [
                      "rgb(0,0,0)",
                      "rgb(0,0,0)",
                      "rgba(0,0,0,0.8)",
                      "rgba(0,0,0,0)",
                    ]
              }
              locations={[0, 0.6, 0.8, 1]}
              style={{
                alignItems: "center",
                paddingVertical: 120,
              }}
            >
              <Text size={24} weight="medium" color="dim">
                Total Saved
              </Text>
              <Text size={48} weight="semibold" color="title">
                $
                {data.reduce((acc, cur) => {
                  return acc + cur.amount;
                }, 0)}
              </Text>
            </LinearGradient>
          );
        }}
        data={data}
        renderItem={({ item }) => <SavingsCard {...item} />}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={() => (
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
                open();
              }}
            >
              Add Item
            </Button>
          </View>
        )}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          flex: 1,
          paddingBottom: bottom,
        }}
      />
      <Portal>
        <ActionSheetButton
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: ["Logout", "Cancel"],
                destructiveButtonIndex: 0,
                cancelButtonIndex: 1,
              },
              async (buttonIndex) => {
                if (buttonIndex === 0) {
                  await signOut(getAuth(app));
                }
              }
            );
          }}
        />
        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            open();
          }}
          style={({ pressed }) => ({
            position: "absolute",
            bottom: bottom > 0 ? bottom : 12,
            right: 12,
            width: 56,
            height: 56,
            borderRadius: 56 / 2,
            backgroundColor:
              scheme === "light"
                ? pressed
                  ? Color("#007aff").lighten(0.1).hex()
                  : "#007aff"
                : pressed
                ? Color("#3178c6").lighten(0.1).hex()
                : "#3178c6",
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
        <Modalize
          ref={modalRef}
          adjustToContentHeight
          childrenStyle={{
            backgroundColor,
          }}
        >
          <AddItem close={close} />
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
