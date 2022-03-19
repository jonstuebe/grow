const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

const generic = {
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#4CD964",
  tealBlue: "#5AC8FA",
  blue: "#007AFF",
  purple: "#5856D6",
  pink: "#FF2D55",
  white: "#F2F2F2",
  customGray: "#EFEFF4",
  lightGray: "#E5E5EA",
  lightGray2: "#D1D1D6",
  midGray: "#C7C7CC",
  gray: "#8E8E93",
  black: "#000000",
};

export default {
  light: {
    text: {
      body: generic.black,
      title: generic.black,
      dim: generic.gray,
      error: generic.red,
    },
    background: generic.white,
    card: generic.lightGray2,
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: {
      body: generic.white,
      title: generic.white,
      dim: generic.midGray,
      error: generic.red,
    },
    background: generic.black,
    card: "#3B3B3D",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};
