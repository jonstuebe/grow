import { Pressable, ViewStyle } from "react-native";
import { useFormikContext } from "formik";
import useColorScheme from "../hooks/useColorScheme";
import Color from "color";
import { Text } from "./Themed";

export default function FormikSubmit({
  label = "Save",
  fullWidth = true,
  style,
}: {
  label?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme();
  const { submitForm } = useFormikContext();

  return (
    <Pressable
      onPress={() => submitForm()}
      style={({ pressed }) => ({
        width: fullWidth ? "100%" : undefined,
        backgroundColor:
          scheme === "light"
            ? pressed
              ? Color("#007aff").lighten(0.1).hex()
              : "#007aff"
            : pressed
            ? Color("#3178c6").lighten(0.1).hex()
            : "#3178c6",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        ...style,
      })}
    >
      <Text weight="semibold" size={20} style={{ color: "white" }}>
        {label}
      </Text>
    </Pressable>
  );
}
