import { useMemo } from "react";
import { useTheme as _useTheme, DarkTheme, Theme as ThemeType } from "@react-navigation/native";
import { darken } from "polished";

export const Theme: ThemeType = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    card: "#3c3d40",
  },
};

export function useTheme() {
  const theme = _useTheme();

  return useMemo(() => {
    const error = "#ff4539";
    const warning = "#ffb34e";

    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: "#3178c6",
        textDim: darken(0.2, theme.colors.text),
        success: "#6ccc6d",
        error,
        warning,
        errorBackground: darken(0.2, error),
        warningBackground: darken(0.2, warning),
      },
    };
  }, [theme]);
}
