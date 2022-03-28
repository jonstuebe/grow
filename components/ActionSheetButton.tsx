import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lighten } from "polished";
import { useTheme } from "../theme";

export default function ActionSheetButton({ onPress }: { onPress: VoidFunction }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

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
          color={pressed ? lighten(0.1, colors.textDim) : colors.textDim}
          size={32}
        />
      )}
    </Pressable>
  );
}
