import { ReactText } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { lighten } from "polished";

import { Text } from "./Text";
import { useTheme } from "../theme";

export default function Button({
  children,
  fullWidth = true,
  style,
  onPress,
}: {
  children: ReactText;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: VoidFunction;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => {
        return [
          {
            width: fullWidth ? "100%" : undefined,
            backgroundColor: pressed
              ? lighten(0.1, colors.primary)
              : colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ];
      }}
    >
      <Text weight="semibold" size={20} style={{ color: "white" }}>
        {children}
      </Text>
    </Pressable>
  );
}
