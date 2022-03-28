import { ForwardedRef, forwardRef } from "react";
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View } from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";

export interface TextInputProps {
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  textInputProps: Omit<RNTextInputProps, "onChange" | "onChangeText" | "value">;
}

export const TextInput = forwardRef(function TextInput(
  { error = "", label, value, onChange, textInputProps }: TextInputProps,
  ref: ForwardedRef<RNTextInput>
) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <Text
        weight={"medium"}
        color="text"
        size={16}
        style={{
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <RNTextInput
          ref={ref}
          style={{
            backgroundColor: colors.card,
            fontFamily: "System",
            fontWeight: "600",
            fontSize: 16,
            color: colors.text,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
          value={value}
          onChangeText={onChange}
          {...textInputProps}
        />
        {error && error !== "" ? (
          <View
            style={{
              borderTopColor: colors.border,
              borderTopWidth: 1,
              backgroundColor: colors.errorBackground,
              marginHorizontal: 0,
              marginBottom: 0,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Text color="text">{error}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});
