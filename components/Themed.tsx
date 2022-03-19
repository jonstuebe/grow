/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useMemo } from "react";
import { Text as DefaultText, View as RNView } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  colorName: "background" | "card",
  opts?: { light?: string; dark?: string }
) {
  const theme = useColorScheme();
  const colorFromProps = opts ? opts[theme] : undefined;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function useTextColor(name: keyof typeof Colors.light.text) {
  const theme = useColorScheme();

  return Colors[theme].text[name];
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps &
  DefaultText["props"] & {
    size?: number;
    weight?: "medium" | "light" | "regular" | "semibold" | "bold";
    color?: keyof typeof Colors.light.text;
  };
export type ViewProps = ThemeProps & RNView["props"];

export function Text({
  style,
  size = 16,
  color: colorName = "body",
  weight = "regular",
  ...otherProps
}: TextProps) {
  const color = useTextColor(colorName);
  const fontWeight = useMemo(() => {
    switch (weight) {
      case "light":
        return "300";
      case "bold":
        return "700";
      case "medium":
        return "500";
      case "semibold":
        return "600";
      default:
        return "400";
    }
  }, [weight]);

  return (
    <DefaultText
      style={[
        { color, fontFamily: "System", fontSize: size, fontWeight },
        style,
      ]}
      {...otherProps}
    />
  );
}
