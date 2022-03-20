import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTextColor } from "./Themed";
import Color from "color";

export default function ActionSheetButton({
  onPress,
}: {
  onPress: VoidFunction;
}) {
  const insets = useSafeAreaInsets();
  const textColor = useTextColor("dim");

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        top: insets.top > 0 ? insets.top : 12,
        right: 12,
      }}
    >
      {({ pressed }) => (
        <Ionicons
          name="ellipsis-horizontal-circle-outline"
          color={pressed ? Color(textColor).lighten(0.2).hex() : textColor}
          size={32}
        />
      )}
    </Pressable>
  );
}
