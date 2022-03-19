import { FlatList, Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { uniqueId } from "lodash-es";

import { Text, useTextColor, useThemeColor } from "../components/Themed";
import SavingsCard, { SavingsCardProps } from "../components/SavingsCard";

import useColorScheme from "../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Portal } from "react-native-portalize";
import Color from "color";
import { Modalize } from "react-native-modalize";
import AddItem from "./AddItem";
import { useModalize } from "../hooks/useModalize";

const data: SavingsCardProps[] = [
  {
    id: uniqueId(),
    icon: "🎟️",
    title: "Disney Trip",
    amount: 250,
    totalAmount: 2000,
  },
  {
    id: uniqueId(),
    icon: "🏠",
    title: "House",
    amount: 8000,
    totalAmount: 30_000,
  },

  {
    id: uniqueId(),
    icon: "🎟️",
    title: "Disney Trip",
    amount: 250,
    totalAmount: 2000,
  },
  {
    id: uniqueId(),
    icon: "🏠",
    title: "House",
    amount: 8000,
    totalAmount: 30_000,
  },
  {
    id: uniqueId(),
    icon: "🎟️",
    title: "Disney Trip",
    amount: 250,
    totalAmount: 2000,
  },
  {
    id: uniqueId(),
    icon: "🏠",
    title: "House",
    amount: 8000,
    totalAmount: 30_000,
  },
  {
    id: uniqueId(),
    icon: "🎟️",
    title: "Disney Trip",
    amount: 250,
    totalAmount: 2000,
  },
  {
    id: uniqueId(),
    icon: "🏠",
    title: "House",
    amount: 8000,
    totalAmount: 30_000,
  },
];

export default function Home() {
  const scheme = useColorScheme();

  const { bottom } = useSafeAreaInsets();
  const { ref: modalRef, open } = useModalize();

  const backgroundColor = useThemeColor("background");

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
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
        )}
        data={data}
        renderItem={({ item }) => <SavingsCard {...item} />}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        stickyHeaderIndices={[0]}
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingBottom: bottom,
        }}
      />
      <Portal>
        <Pressable
          onPress={open}
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
          <AddItem />
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
