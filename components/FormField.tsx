import React, { ForwardedRef, forwardRef, useMemo, useRef } from "react";
import { Pressable, StyleProp, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import useMergedRef from "@react-hook/merged-ref";
import { lighten, transparentize } from "polished";
import { Ionicons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Dinero from "dinero.js";

import { useModalize } from "../hooks/useModalize";

import { Text } from "./Text";
import { useTheme } from "../theme";

export interface FormFieldProps {
  name: string;
  type?: "text" | "currency";
  label: string;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
  textInputProps?: Omit<TextInputProps, "value" | "onChangeText">;
  style?: StyleProp<ViewStyle>;
}

const FormField = forwardRef(function FormField(
  { name, type = "text", label, value, error, onChange, textInputProps, style }: FormFieldProps,
  ref: ForwardedRef<TextInput>
) {
  const { ref: modalRef, open, close } = useModalize();
  const { colors } = useTheme();
  const textInputRef = useRef<TextInput>(null);
  const combinedRef = useMergedRef(ref, textInputRef);

  const formattedValue: string = useMemo(() => {
    if (value && type === "currency") {
      return Dinero({ amount: Number(value) * 100, currency: "USD" }).toFormat("$0,0.00");
    }

    return value ?? "";
  }, [value, type]);

  return (
    <Pressable
      onPress={() => {
        open();
      }}
      style={({ pressed }) => [
        {
          width: "100%",
          backgroundColor: pressed ? transparentize(0.05, colors.card) : colors.card,
          borderRadius: 8,
          overflow: "hidden",
        },
        style,
      ]}
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
          <Text weight={"medium"} color="textDim" size={16} style={{ marginRight: 8 }}>
            {formattedValue}
          </Text>
          <Ionicons name="chevron-forward-outline" size={20} color={colors.textDim} />
        </View>
      </View>
      {error && error !== "" ? (
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
      <Portal>
        <Modalize
          ref={modalRef}
          adjustToContentHeight
          childrenStyle={{
            backgroundColor: colors.background,
            padding: 16,
          }}
        >
          <Text weight="medium" color="text" size={20} style={{ marginBottom: 8 }}>
            {label}
          </Text>
          <View
            style={{
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                position: "relative",
                borderRadius: 8,
              }}
            >
              <TextInput
                {...textInputProps}
                ref={combinedRef}
                autoFocus
                onChangeText={(text) => {
                  onChange(name, text);
                }}
                style={{
                  backgroundColor: colors.card,
                  fontFamily: "System",
                  fontWeight: "600",
                  fontSize: 16,
                  color: colors.text,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
                returnKeyType="done"
                onSubmitEditing={() => {
                  close();
                }}
                value={value}
              />
              {value && value !== "" ? (
                <Pressable
                  onPress={() => {
                    onChange(name, "");
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 12,
                    width: 20,
                    height: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="close-circle" size={20} color={lighten(0.2, colors.card)} />
                </Pressable>
              ) : null}
            </View>
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
        </Modalize>
      </Portal>
    </Pressable>
  );
});

export default FormField;
