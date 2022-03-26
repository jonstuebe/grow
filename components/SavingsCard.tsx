import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Dinero from "dinero.js";
import * as Haptics from "expo-haptics";
import Confetti from "react-native-confetti";
import { Portal } from "react-native-portalize";

import useColorScheme from "../hooks/useColorScheme";
import { useConfetti } from "../hooks/useConfetti";

import { Text } from "./Themed";

import type { SavingsItem } from "../types";

export interface SavingsCardProps extends SavingsItem {}

export default function SavingsCard({
  id,
  title,
  icon,
  amount,
  totalAmount,
}: SavingsCardProps) {
  const { navigate } = useNavigation();
  const scheme = useColorScheme();
  const { confettiRef, startConfetti } = useConfetti();

  const formattedAmount = useMemo(() => {
    return Dinero({ amount: amount, currency: "USD" }).toFormat("$0,0.00");
  }, [amount]);

  return (
    <>
      <Pressable
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigate("EditItem", { id, title, icon, amount, totalAmount });
          // open();
        }}
        style={{
          backgroundColor: scheme === "dark" ? "#3c3d40" : "#e5e5ea",
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          marginHorizontal: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: totalAmount ? 22 : 16,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ marginRight: 16 }} size={32}>
              {icon}
            </Text>
            <View style={{ justifyContent: "center", flexDirection: "column" }}>
              <Text size={20} weight="semibold" color="title">
                {title}
              </Text>
              <Text size={14} weight="semibold" color="dim">
                {formattedAmount}
              </Text>
            </View>
          </View>
          {amount >= totalAmount ? (
            <View>
              <Ionicons
                name="checkmark-circle-outline"
                color={"#38a04b"}
                size={32}
              />
            </View>
          ) : null}
        </View>
        {totalAmount ? (
          <View
            style={{
              width: `${Math.round((amount / totalAmount) * 100)}%`,
              height: 6,

              position: "absolute",
              bottom: 0,
              left: 0,

              backgroundColor: scheme === "dark" ? "#5B5B5E" : "#d1d1d6",
            }}
          />
        ) : null}
      </Pressable>
      <Portal>
        <Confetti ref={confettiRef} confettiCount={100} />
      </Portal>
    </>
  );
}
