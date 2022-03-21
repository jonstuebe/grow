import { useCallback } from "react";
import { Pressable, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import * as Haptics from "expo-haptics";

import { app } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useModalize } from "../hooks/useModalize";

import EditItem from "../screens/EditItem";
import { Text, useThemeColor } from "./Themed";
import { getAuth } from "firebase/auth";

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

  const onSaveChanges = useCallback(
    async ({ id, ...item }: SavingsCardProps) => {
      const user = getAuth(app).currentUser;
      await updateDoc(doc(getFirestore(app), "items", id), {
        title: item.title,
        icon: item.icon,
        amount: parseInt(item.amount as any as string),
        totalAmount: parseInt(item.totalAmount as any as string),
        uid: user?.uid,
      });

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
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: totalAmount ? 22 : 16,

            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginRight: 16 }} size={32}>
            {icon}
          </Text>
          <View>
            <Text size={20} weight="semibold" color="title">
              {title}
            </Text>
            <Text size={14} weight="semibold" color="dim">
              ${amount}
            </Text>
          </View>
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
      </Portal>
    </>
  );
}
