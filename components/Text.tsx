import { useMemo } from "react";
import { Text as DefaultText } from "react-native";
import { Theme, useTheme } from "../theme";

export type TextProps = DefaultText["props"] & {
  size?: number;
  weight?: "medium" | "light" | "regular" | "semibold" | "bold";
  color?: keyof typeof Theme.colors | "textDim" | "error";
};

export function Text({
  style,
  size = 16,
  color: colorName = "text",
  weight = "regular",
  ...otherProps
}: TextProps) {
  const { colors } = useTheme();
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
        {
          color: colors[colorName],
          fontFamily: "System",
          fontSize: size,
          fontWeight,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
