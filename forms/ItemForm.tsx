import { Formik } from "formik";
import { VStack } from "react-native-stacks";
import * as Yup from "yup";
import isEmoji from "is-standard-emoji";

import FormikEmojiField from "../components/FormikEmojiField";
import FormikField from "../components/FormikField";
import FormikSubmit from "../components/FormikSubmit";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Please enter a name"),
  amount: Yup.number()
    .positive("Must be a positive number")
    .typeError("Must be a number")
    .required("Please enter an amount"),
  totalAmount: Yup.number()
    .typeError("Must be a number")
    .positive("Must be a positive number")
    .required("Please enter a goal amount"),
  icon: Yup.string()
    .required("Please select an icon")
    .test("emoji", "Please select an ${path}", (value, _context) => {
      if (!value) return false;

      return isEmoji(value);
    }),
});

export type FormikFields = {
  title: string;
  amount: number | undefined;
  totalAmount: number | undefined;
  icon: string;
};

export interface ItemFormProps {
  initialValues: FormikFields;
  onSave: (values: FormikFields) => void;
}

export default function ItemForm({ initialValues, onSave }: ItemFormProps) {
  return (
    <Formik<FormikFields>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSave}
    >
      <VStack spacing={8}>
        <FormikField name="title" label="Name" />
        <FormikEmojiField name="icon" label="Icon" />
        <FormikField
          name="amount"
          label="Amount"
          textInputProps={{
            keyboardType: "numeric",
          }}
        />
        <FormikField
          name="totalAmount"
          label="Goal Amount"
          textInputProps={{
            keyboardType: "numeric",
          }}
        />
        <FormikSubmit />
      </VStack>
    </Formik>
  );
}
