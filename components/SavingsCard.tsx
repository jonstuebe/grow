import { useCallback, useMemo, useRef, useState } from "react";
import { ActionSheetIOS, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Dinero from "dinero.js";
import * as Haptics from "expo-haptics";
import Confetti from "react-native-confetti";
import { Portal } from "react-native-portalize";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Modalize } from "react-native-modalize";
import { RectButton } from "react-native-gesture-handler";
import { HStack } from "react-native-stacks";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { CircularProgressWithChild } from "react-native-circular-progress-indicator";

import { useTheme } from "../theme";
import { app } from "../firebase";
import { useModalize } from "../hooks/useModalize";
import { useConfetti } from "../hooks/useConfetti";

import { Text } from "./Text";
import { ModifyAmount } from "../forms/ModifyAmount";

import { RootStackParamList, SavingsItem, SavingsItemAmount } from "../types";
import { getItemAmount } from "../utils";
export interface SavingsCardProps {
  item: SavingsItem;
  style?: StyleProp<ViewStyle>;
}

export default function SavingsCard({ item, style }: SavingsCardProps) {
  const { colors } = useTheme();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

  const { ref: modalRef, open: openModal, close: closeModal } = useModalize();
  const [modalView, setModalView] = useState<"add" | "subtract" | undefined>();

  const swipeableRef = useRef<Swipeable>(null);
  const { confettiRef, startConfetti } = useConfetti();

  const amount = useMemo(() => {
    return getItemAmount(item);
  }, [item]);

  const goalPerc = useMemo(() => {
    const perc = (amount / item.goal) * 100;

    if (perc > 100) return 100;
    return perc;
  }, [amount, item.goal]);

  const formattedAmount = useMemo(() => {
    const value = Dinero({ amount: amount * 100, currency: "USD" });

    return value.hasSubUnits() ? value.toFormat("$0,0.00") : value.toFormat("$0,0");
  }, [amount]);

  const onView = useCallback(() => {
    swipeableRef.current?.close();
    navigate("Item", item);
  }, [item, navigate]);

  const onDelete = useCallback(async () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Are you sure?",
        options: ["Cancel", "Delete"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        userInterfaceStyle: "dark",
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          try {
            await deleteDoc(doc(getFirestore(app), "items-v2", item.id));
          } catch (e) {
            // @todo handle error
            console.log(e);
          }
        }
        swipeableRef.current?.close();
      }
    );
  }, [item.id]);

  const renderRightActions = useCallback(() => {
    return (
      <View
        style={{
          width: 68,
          flexDirection: "row",
        }}
      >
        <RectButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: colors.error,
            justifyContent: "center",
            flex: 1,
            width: 68,
          }}
          onPress={onDelete}
        >
          <Text color="text" weight="semibold">
            Delete
          </Text>
        </RectButton>
      </View>
    );
  }, [colors.error, onDelete]);

  const onAdd = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalView("add");
    openModal();
  }, [openModal]);

  const onSubtract = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalView("subtract");
    openModal();
  }, [openModal]);

  const onAddAmount = useCallback(
    async (values: { amount: string }) => {
      const newAmounts: SavingsItemAmount[] = [
        ...item.amounts,
        {
          amount: parseFloat(values.amount),
          type: "deposit",
          dateAdded: new Date().toISOString(),
        },
      ];

      await updateDoc(doc(getFirestore(app), "items-v2", item.id), {
        amounts: newAmounts,
      });

      if (getItemAmount({ ...item, amounts: newAmounts }) >= item.goal) {
        startConfetti();
      }

      closeModal();
    },
    [closeModal, item, startConfetti]
  );

  const onSubtractAmount = useCallback(
    async (values: { amount: string }) => {
      await updateDoc(doc(getFirestore(app), "items-v2", item.id), {
        amounts: [
          ...item.amounts,
          {
            amount: parseFloat(values.amount),
            type: "withdrawal",
            dateAdded: new Date().toISOString(),
          },
        ],
      });
      closeModal();
    },
    [closeModal, item.amounts, item.id]
  );

  return (
    <Pressable
      onPress={onView}
      style={[
        {
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Swipeable
        ref={swipeableRef}
        friction={2}
        leftThreshold={80}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={renderRightActions}
      >
        <View
          style={{
            backgroundColor: colors.card,
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  marginRight: 16,
                }}
              >
                <CircularProgressWithChild
                  value={goalPerc}
                  radius={24}
                  activeStrokeColor={colors.success}
                  inActiveStrokeColor={colors.border}
                  activeStrokeWidth={4}
                  inActiveStrokeWidth={4}
                  circleBackgroundColor={colors.card}
                >
                  <Text size={24}>{item.icon}</Text>
                </CircularProgressWithChild>
              </View>
              <View style={{ justifyContent: "center", flexDirection: "column" }}>
                <Text size={16} weight="semibold" color="text">
                  {item.title}
                </Text>
                <Text size={14} weight="semibold" color="text">
                  {formattedAmount}
                </Text>
              </View>
            </View>
            <HStack spacing={4}>
              <Pressable onPress={onSubtract}>
                <Ionicons name="remove-circle-outline" color="#FFF" size={32} />
              </Pressable>
              <Pressable onPress={onAdd}>
                <Ionicons name="add-circle-outline" color="#FFF" size={32} />
              </Pressable>
            </HStack>
          </View>
        </View>
      </Swipeable>
      <Portal>
        <Confetti ref={confettiRef} confettiCount={100} />
        <Modalize
          ref={modalRef}
          adjustToContentHeight
          childrenStyle={{
            backgroundColor: colors.background,
          }}
          onClose={() => {
            setModalView(undefined);
          }}
        >
          {modalView ? (
            <ModifyAmount onSubmit={modalView === "add" ? onAddAmount : onSubtractAmount} />
          ) : undefined}
        </Modalize>
      </Portal>
    </Pressable>
  );
}
