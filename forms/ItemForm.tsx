import { KeyboardAccessoryView } from "@flyerhq/react-native-keyboard-accessory-view";
import emojiRegex from "emoji-regex";
import { Formik } from "formik";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import FormikEmojiField from "../components/FormikEmojiField";
import FormikField from "../components/FormikField";
import FormikSubmit from "../components/FormikSubmit";
import { useKeyboard } from "../hooks/useKeyboard";
import { FormGroup } from "../components/FormGroup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Please enter a name"),
  goal: Yup.number()
    .typeError("Must be a number")
    .positive("Must be a positive number")
    .required("Please enter a goal amount"),
  icon: Yup.string()
    .required("Please select an icon")
    .test("emoji", "Please select an ${path}", (value) => {
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
  goal: number | undefined;
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
          paddingTop: 16,
        }}
        renderScrollable={(panHandlers) => (
          <ScrollView
            {...panHandlers}
            keyboardDismissMode="interactive"
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
          >
            <FormGroup title="Details">
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
                name="goal"
                type="currency"
                label="Goal Amount"
                textInputProps={{
                  keyboardType: "numeric",
                }}
              />
            </FormGroup>
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
