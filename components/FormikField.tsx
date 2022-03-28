import { useField } from "formik";
import { isNumber } from "lodash-es";
import { ForwardedRef, forwardRef } from "react";
import { TextInput } from "react-native";
import FormField, { FormFieldProps } from "./FormField";

export type FormikFieldProps = Omit<FormFieldProps, "onChange" | "value" | "error">

const FormikField = forwardRef(function FormikField(
  { name, label, textInputProps, ...props }: FormikFieldProps,
  ref: ForwardedRef<TextInput>
) {
  const [{ value }, { touched, error }, { setValue, setTouched }] =
    useField(name);

  return (
    <FormField
      ref={ref}
      name={name}
      label={label}
      value={isNumber(value) ? value.toString() : value}
      error={touched && error ? error : undefined}
      onChange={(_name, value) => {
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

export default FormikField;
