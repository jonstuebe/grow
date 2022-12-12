import Ionicons from "@expo/vector-icons/Ionicons";
import { deleteDoc, doc } from "@firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import Color from "color";
import { parseISO } from "date-fns";
import React, { useMemo } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import SwipeableItem from "react-native-swipeable-item";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { db } from "../firebase";
import { useNavigation } from "../hooks/useHomeNavigation";
import ItemAction from "./ItemAction";

export type AmountType = "deposit" | "withdrawal";

export interface ItemAmountType {
  // currency in cents
  amount: number;
  // needs to be converted from firebase iso string to date
  dateAdded: Date;
  type: AmountType;
}

export interface ItemType {
  id: string;
  title: string;
  // currency in cents
  goal?: number;
  // needs to be converted from firebase iso string to date
  goalDate?: Date;

  amounts: ItemAmountType[];
}

export interface ItemAmountSerializedType
  extends Omit<ItemAmountType, "dateAdded"> {
  dateAdded: string;
}

export interface ItemSerializedType
  extends Omit<ItemType, "goalDate" | "amounts"> {
  goalDate?: string;
  amounts: ItemAmountSerializedType[];
}

export interface ItemProps extends ItemType {
  style?: StyleProp<ViewStyle>;
}

export function serializeItem({
  goalDate,
  ...item
}: ItemType): ItemSerializedType {
  return {
    ...item,
    goalDate: goalDate ? goalDate.toISOString() : undefined,
    amounts: item.amounts.map((amount) => ({
      ...amount,
      dateAdded: amount.dateAdded.toISOString(),
    })),
  };
}

export function deserializeItem({
  goalDate,
  ...item
}: ItemSerializedType): ItemType {
  return {
    ...item,
    goalDate: goalDate ? parseISO(goalDate) : undefined,
    amounts: item.amounts.map((amount) => ({
      ...amount,
      dateAdded: parseISO(amount.dateAdded),
    })),
  };
}

export function getTotalAmountSavedInCents({ amounts }: ItemType) {
  return amounts.reduce((acc, cur) => {
    switch (cur.type) {
      case "deposit":
        acc = acc + cur.amount;
        break;
      case "withdrawal":
        acc = acc - cur.amount;
    }

    return acc;
  }, 0);
}

export function getTotalAmountSavedFormatted(item: ItemType): string {
  const cents = getTotalAmountSavedInCents(item);
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function Item({ style, ...item }: ItemProps) {
  const client = useQueryClient();
  const { navigate } = useNavigation<"Home">();
  const { colors } = useTheme();

  const { id, title, goal } = item;

  const { totalAmountSaved, goalFormatted } = useMemo(() => {
    return {
      totalAmountSaved: getTotalAmountSavedFormatted(item),
      goalFormatted: goal
        ? (goal / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })
        : undefined,
    };
  }, [item, goal]);

  return (
    <View
      style={[
        {
          height: 96,
          overflow: "hidden",
          marginHorizontal: 12,
        },
        style,
      ]}
    >
      <SwipeableItem
        item={{}}
        snapPointsLeft={[116]}
        renderUnderlayLeft={() => (
          <ItemAction
            placement="end"
            onPress={async () => {
              try {
                await deleteDoc(doc(db, "items-v2", id));
                await client.invalidateQueries(["items"]);
              } catch (e) {
                console.log(e);
              }
            }}
            color={iOSColors.red}
            label="Remove"
          />
        )}
      >
        <View
          style={{
            borderColor: Color("white").hsl().darken(0.95).string(),
            borderWidth: 1,
            borderRadius: 24,

            backgroundColor: Color(colors.card).darken(0.2).hsl().string(),
            overflow: "hidden",

            paddingVertical: 20,
            paddingLeft: 20,
            paddingRight: 8,

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              allowFontScaling={false}
              style={[
                iOSUIKit.title3EmphasizedWhite,
                {
                  letterSpacing: -0.45,
                  fontSize: 18,
                  marginBottom: 4,
                  color: Color("#ffffff").hsl().darken(0.1).string(),
                },
              ]}
            >
              {title}
            </Text>
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.border,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  iOSUIKit.caption2,
                  {
                    fontSize: 14,
                    lineHeight: 16,
                    color: Color("#ffffff").hsl().darken(0.3).string(),
                    letterSpacing: -0.2,
                  },
                ]}
              >
                {goal
                  ? `${totalAmountSaved} / ${goalFormatted}`
                  : totalAmountSaved}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              style={{ marginRight: 8 }}
              hitSlop={4}
              onPress={() => {
                navigate("Withdrawal", serializeItem(item));
              }}
            >
              <Ionicons
                name="remove-circle"
                size={32}
                color={colors.notification}
              />
            </Pressable>
            <Pressable
              hitSlop={4}
              onPress={() => {
                navigate("Deposit", serializeItem(item));
              }}
            >
              <Ionicons name="add-circle" size={32} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      </SwipeableItem>
    </View>
  );
}
