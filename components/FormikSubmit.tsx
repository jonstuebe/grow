import { ViewStyle } from "react-native";
import { useFormikContext } from "formik";

import Button from "./Button";

export default function FormikSubmit({
  label = "Save",
  submittingLabel = "Saving...",
  style,
  ...props
}: {
  label?: string;
  submittingLabel?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}) {
  const { submitForm, isSubmitting } = useFormikContext();

  return (
    <Button onPress={() => submitForm()} style={style} {...props}>
      {isSubmitting && submittingLabel ? submittingLabel : label}
    </Button>
  );
}
