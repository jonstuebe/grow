import { useField } from "formik";
import { useState } from "react";
import { View, Pressable } from "react-native";
import EmojiKeyboard from "rn-emoji-keyboard";
import { FormikFieldProps } from "./FormikField";

import { Text, useTextColor, useThemeColor } from "./Themed";

export default function FormikEmojiField({ name, label }: FormikFieldProps) {
  const [{ value }, { error, touched }, { setValue, setTouched }] =
    useField(name);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const backgroundColor = useThemeColor("background");
  const rowBackgroundColor = useThemeColor("card");
  const searchBarPlaceholderColor = useTextColor("dim");
  const textColor = useTextColor("body");

  return (
    <>
      <View
        style={{
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text
          weight={"medium"}
          color="title"
          size={20}
          style={{
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
        <Pressable
          style={[
            value
              ? {
                  width: 52,
                  height: 52,
                }
              : {
                  paddingVertical: 16,
                },
            {
              backgroundColor: rowBackgroundColor,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={() => setShowEmojiPicker(true)}
        >
          {value ? <Text size={24}>{value}</Text> : <Text>Choose {label}</Text>}
        </Pressable>
        {error && touched && error !== "" ? (
          <View
            style={{
              marginTop: 8,
            }}
          >
            <Text color="error">{error}</Text>
          </View>
        ) : null}
      </View>
      <EmojiKeyboard
        categoryPosition="bottom"
        open={showEmojiPicker}
        expandable={true}
        defaultHeight="52%"
        enableSearchBar
        searchBarStyles={{
          backgroundColor: rowBackgroundColor,
          borderRadius: 8,
        }}
        searchBarTextStyles={{
          color: textColor,
        }}
        containerStyles={{
          backgroundColor,
        }}
        headerStyles={{
          color: textColor,
        }}
        searchBarPlaceholderColor={searchBarPlaceholderColor}
        categoryContainerColor={rowBackgroundColor}
        categoryColor={searchBarPlaceholderColor}
        activeCategoryColor={rowBackgroundColor}
        activeCategoryContainerColor={searchBarPlaceholderColor}
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
