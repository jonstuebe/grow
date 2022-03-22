import { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import * as Haptics from "expo-haptics";

import { app } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useModalize } from "../hooks/useModalize";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import Confetti from "react-native-confetti";
import Dinero from "dinero.js";

import EditItem from "../screens/EditItem";
import { Text, useThemeColor } from "./Themed";
import { useConfetti } from "../hooks/useConfetti";

export interface SavingsCardProps {
  id: string;
  title: string;
  icon: string;
  amount: number;
  totalAmount: number;
}

export default function SavingsCard({
  id,
  title,
  icon,
  amount,
  totalAmount,
}: SavingsCardProps) {
  const scheme = useColorScheme();
  const { ref, open, close } = useModalize();
  const backgroundColor = useThemeColor("background");
  const { confettiRef, startConfetti } = useConfetti();

  const formattedAmount = useMemo(() => {
    return Dinero({ amount: amount * 100, currency: "USD" }).toFormat(
      "$0,0.00"
    );
  }, [amount]);

  const onSaveChanges = useCallback(
    async ({ id, ...item }: SavingsCardProps) => {
      const user = getAuth(app).currentUser;
      await updateDoc(doc(getFirestore(app), "items", id), {
        title: item.title,
        icon: item.icon,
        amount: parseFloat(item.amount as any as string),
        totalAmount: parseFloat(item.totalAmount as any as string),
        uid: user?.uid,
      });

      if (parseFloat(item.amount as any) >= parseFloat(totalAmount as any)) {
        startConfetti();
      }

      close();
    },
    []
  );

  return (
    <>
      <Pressable
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          open();
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
        <Modalize
          ref={ref}
          adjustToContentHeight
          childrenStyle={{
            backgroundColor,
          }}
        >
          <EditItem
            onSaveChanges={onSaveChanges}
            item={{
              id,
              title,
              amount,
              totalAmount,
              icon,
            }}
          />
        </Modalize>
        <Confetti ref={confettiRef} confettiCount={100} />
      </Portal>
    </>
  );
}
