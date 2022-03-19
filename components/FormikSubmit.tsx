import { Pressable } from "react-native";
import { useFormikContext } from "formik";
import useColorScheme from "../hooks/useColorScheme";
import Color from "color";
import { Text } from "./Themed";

export default function FormikSubmit() {
  const scheme = useColorScheme();
  const { submitForm } = useFormikContext();

  return (
    <Pressable
      onPress={() => submitForm()}
      style={({ pressed }) => ({
        width: "100%",
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
      })}
    >
      <Text weight="semibold" size={20} style={{ color: "white" }}>
        Save
      </Text>
    </Pressable>
  );
}
