import Color from "color";
import { iOSColors } from "react-native-typography";

const blue = "#007bff";
const darkGray = Color(iOSColors.gray).darken(0.2).hsl().string();

export default {
  blue,
  darkGray,
};
