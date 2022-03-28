import { useField } from "formik";
import { isNumber } from "lodash-es";
import { ForwardedRef, forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";
import { TextInput, TextInputProps } from "./TextInput";

export interface FormikTextInputProps extends Omit<TextInputProps, "onChange" | "value"> {
  name: string;
}

const FormikTextInput = forwardRef(function FormikTextInput(
  { name, label, textInputProps, ...props }: FormikTextInputProps,
  ref: ForwardedRef<RNTextInput>
) {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  return (
    <TextInput
      ref={ref}
      label={label}
      value={isNumber(value) ? value.toString() : value}
      error={touched && error ? error : undefined}
      onChange={(value) => {
        if (!touched) {
          setTouched(true);
        }
        setValue(value);
      }}
      textInputProps={{
        ...textInputProps,
        onBlur: () => {
          setTouched(true);
        },
      }}
      {...props}
    />
  );
});

export default FormikTextInput;
