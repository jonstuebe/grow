import { KeyboardAccessoryView } from "@flyerhq/react-native-keyboard-accessory-view";
import emojiRegex from "emoji-regex";
import { Formik } from "formik";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VStack } from "react-native-stacks";
import * as Yup from "yup";

import FormikEmojiField from "../components/FormikEmojiField";
import FormikField from "../components/FormikField";
import FormikSubmit from "../components/FormikSubmit";
import { useKeyboard } from "../hooks/useKeyboard";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Please enter a name"),
  amount: Yup.number()
    .min(0, "Can't be a negative number")
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

      const regex = emojiRegex();
      const match = value.match(regex);

      if (match && match[0] === value) {
        return true;
      }

      return false;
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
  const insets = useSafeAreaInsets();
  const { keyboardWillShow } = useKeyboard();

  return (
    <Formik<FormikFields>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSave}
    >
      <KeyboardAccessoryView
        contentContainerStyle={{
          flex: 1,
          marginBottom: 0,
        }}
        scrollableContainerStyle={{
          flex: 1,
          marginTop: 16,
          marginBottom: 0,
        }}
        renderScrollable={(panHandlers) => (
          <ScrollView
            {...panHandlers}
            keyboardDismissMode="interactive"
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
          >
            <VStack spacing={8}>
              <FormikField
                name="title"
                label="Name"
                textInputProps={{
                  autoCapitalize: "none",
                  autoCompleteType: "off",
                  autoCorrect: false,
                  keyboardType: "default",
                }}
              />
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
            </VStack>
          </ScrollView>
        )}
      >
        <FormikSubmit
          style={{
            paddingTop: 16,
            borderRadius: 0,
            paddingBottom: keyboardWillShow ? 16 : insets.bottom,
          }}
        />
      </KeyboardAccessoryView>
    </Formik>
  );
}
