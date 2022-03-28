import { Ionicons } from "@expo/vector-icons";
import { useField } from "formik";
import { useState } from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmojiKeyboard from "rn-emoji-keyboard";
import { useTheme } from "../theme";

import { FormikFieldProps } from "./FormikField";
import { Text } from "./Text";

export default function FormikEmojiField({ name, label, style }: FormikFieldProps) {
  const { colors } = useTheme();
  const [{ value }, { error, touched }, { setValue }] = useField(name);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const insets = useSafeAreaInsets();

  return (
    <>
      <Pressable
        style={[
          {
            width: "100%",
            backgroundColor: colors.card,
            overflow: "hidden",
            borderRadius: 8,
          },
          style,
        ]}
        onPress={() => setShowEmojiPicker(true)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <Text weight={"medium"} color="text" size={16}>
            {label}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginRight: 8 }}>
              {value ? <Text size={16}>{value}</Text> : <Text>Choose {label}</Text>}
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={colors.textDim} />
          </View>
        </View>
        {error && touched && error !== "" ? (
          <View
            style={{
              borderTopColor: colors.border,
              borderTopWidth: 1,
              backgroundColor: colors.errorBackground,
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text color="text">{error}</Text>
          </View>
        ) : null}
      </Pressable>
      <EmojiKeyboard
        categoryPosition="bottom"
        open={showEmojiPicker}
        expandable
        enableSearchBar
        disableSafeArea
        searchBarStyles={{
          backgroundColor: colors.card,
          borderRadius: 8,
        }}
        searchBarTextStyles={{
          color: colors.text,
        }}
        containerStyles={{
          backgroundColor: colors.background,
          paddingBottom: insets.bottom,
        }}
        headerStyles={{
          color: colors.text,
        }}
        searchBarPlaceholderColor={colors.textDim}
        categoryContainerColor={colors.card}
        categoryColor={colors.textDim}
        activeCategoryColor={colors.card}
        activeCategoryContainerColor={colors.textDim}
        onEmojiSelected={(emoji) => {
          setValue(emoji.emoji);
        }}
        onClose={() => {
          setShowEmojiPicker(false);
        }}
      />
    </>
  );
}
