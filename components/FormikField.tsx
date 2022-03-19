import { useField } from "formik";
import { isNumber } from "lodash-es";
import FormField, { FormFieldProps } from "./FormField";

export interface FormikFieldProps
  extends Omit<FormFieldProps, "onChange" | "value" | "error"> {}

export default function FormikField({ name, label }: FormikFieldProps) {
  const [{ value }, { touched, error }, { setValue, setTouched }] =
    useField(name);

  return (
    <FormField
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
        onBlur: () => {
          setTouched(true);
        },
      }}
    />
  );
}
