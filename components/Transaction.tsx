import { ActionSheetIOS, StyleProp, View, ViewStyle } from "react-native";
import { formatRelative, parseISO } from "date-fns";
import { upperFirst } from "lodash-es";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { formatCurrency } from "../utils";
import { useTheme } from "../theme";

import { Text } from "./Text";

import type { SavingsItemAmount } from "../types";
import { useCallback, useRef } from "react";

export interface TransactionProps {
  data: SavingsItemAmount;
  onDelete: (data: SavingsItemAmount) => Promise<void>;
  style?: StyleProp<ViewStyle>;
}

export function Transaction({ data, onDelete, style }: TransactionProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

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
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                title: "Delete Item",
                message: "Are you sure?",
                options: ["Cancel", "Delete"],
                cancelButtonIndex: 0,
                destructiveButtonIndex: 1,
                userInterfaceStyle: "dark",
              },
              async (buttonIndex) => {
                if (buttonIndex === 1) {
                  try {
                    await onDelete(data);
                    swipeableRef.current?.close();
                  } catch (e) {
                    // @todo handle error
                    console.log(e);
                  }
                }
              }
            );
          }}
        >
          <Text color="text" weight="semibold">
            Delete
          </Text>
        </RectButton>
      </View>
    );
  }, [colors.error, data, onDelete]);

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={80}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      <View
        style={[
          {
            width: "100%",
            backgroundColor: colors.card,
            paddingHorizontal: 16,
            paddingVertical: 12,

            flexDirection: "row",
            justifyContent: "space-between",
          },
          style,
        ]}
      >
        <Text weight="medium">
          {upperFirst(formatRelative(parseISO(data.dateAdded), new Date()))}
        </Text>
        <Text>{formatCurrency(data.amount)}</Text>
      </View>
    </Swipeable>
  );
}
