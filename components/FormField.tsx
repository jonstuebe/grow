import React, { useRef, useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import Color from "color";

import { Text, useTextColor, useThemeColor } from "./Themed";
import useColorScheme from "../hooks/useColorScheme";

export interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
  textInputProps?: Omit<TextInputProps, "value" | "onChangeText">;
}

export default function FormField({
  name,
  label,
  value,
  error,
  onChange,
  textInputProps,
}: FormFieldProps) {
  const textInputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const scheme = useColorScheme();

  const rowBackgroundColor = useThemeColor("card");
  const inputTextColor = useTextColor("body");

  return (
    <View style={{ width: "100%" }}>
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
      <TextInput
        ref={textInputRef}
        onChangeText={(text) => {
          onChange(name, text);
        }}
        style={{
          backgroundColor: rowBackgroundColor,
          fontFamily: "System",
          fontWeight: "600",
          fontSize: 16,
          color: inputTextColor,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: isFocused
            ? scheme === "light"
              ? Color(rowBackgroundColor).darken(0.2).hex()
              : Color(rowBackgroundColor).lighten(0.5).hex()
            : rowBackgroundColor,
        }}
        onFocus={(e) => {
          setIsFocused(true);

          if (textInputProps?.onFocus) {
            textInputProps.onFocus(e);
          }
        }}
        onBlur={(e) => {
          setIsFocused(false);

          if (textInputProps?.onBlur) {
            textInputProps.onBlur(e);
          }
        }}
        value={value}
        {...textInputProps}
      />
      {error && error !== "" ? (
        <View
          style={{
            marginTop: 8,
          }}
        >
          <Text color="error">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
