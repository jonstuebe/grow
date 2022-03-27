import React, {
  Children,
  ReactNode,
  isValidElement,
  cloneElement,
} from "react";
import { ViewStyle } from "react-native";
import { useTheme } from "../theme";
import { Text } from "./Text";

export const getRowBorderStyle = (
  type: "first" | "last" | null,
  borderColor: string
): ViewStyle => {
  switch (type) {
    case "first":
      return {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
      };
    case "last":
      return {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      };
    default:
      return {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
      };
  }
};

export interface FormGroupProps {
  children: ReactNode;
  title?: string;
}

export function FormGroup({ title, children }: FormGroupProps) {
  const { colors } = useTheme();

  return (
    <>
      {title ? (
        <Text
          color="textDim"
          size={14}
          weight="semibold"
          style={{
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {title}
        </Text>
      ) : null}
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          const isFirstRow = index === 0;
          const isLastRow = index + 1 === Children.count(children);
          const type = isFirstRow ? "first" : isLastRow ? "last" : null;
          const style = getRowBorderStyle(type, colors.border);

          return cloneElement(child, {
            style: {
              ...child.props.style,
              ...style,
            },
          });
        }

        return child;
      })}
    </>
  );
}
