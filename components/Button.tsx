import { Pressable, StyleProp, ViewStyle } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import Color from "color";
import { Text } from "./Themed";
import { ReactText } from "react";

export default function Button({
  children,
  fullWidth = true,
  lightColor = "#007aff",
  darkColor = "#3178c6",
  style,
  onPress,
}: {
  children: ReactText;
  fullWidth?: boolean;
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress: VoidFunction;
}) {
  const scheme = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => {
        return [
          {
            width: fullWidth ? "100%" : undefined,
            backgroundColor:
              scheme === "light"
                ? pressed
                  ? Color(lightColor).lighten(0.1).hex()
                  : lightColor
                : pressed
                ? Color(darkColor).lighten(0.1).hex()
                : darkColor,
            borderRadius: 12,
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
