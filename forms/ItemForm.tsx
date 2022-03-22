import { Formik } from "formik";
import { HStack, VStack } from "react-native-stacks";
import * as Yup from "yup";
import emojiRegex from "emoji-regex";

import FormikEmojiField from "../components/FormikEmojiField";
import FormikField from "../components/FormikField";
import FormikSubmit from "../components/FormikSubmit";
import { Pressable, View } from "react-native";
import { useTextColor } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Color from "color";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "../firebase";

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
  id?: string;
  initialValues: FormikFields;
  onSave: (values: FormikFields) => void;
  type?: "new" | "edit";
}

export default function ItemForm({
  initialValues,
  onSave,
  type = "new",
  id,
}: ItemFormProps) {
  const errorColor = useTextColor("error");

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
        {type === "edit" ? (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Pressable
              onPress={async () => {
                try {
                  await deleteDoc(
                    doc(getFirestore(app), "items", id as string)
                  );
                  close();
                } catch (e) {
                  // @todo handle error
                  console.log(e);
                }
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? Color(errorColor).lighten(0.1).hex()
                  : errorColor,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginRight: 12,
              })}
            >
              <Ionicons name="trash" size={24} color="white" />
            </Pressable>
            <FormikSubmit
              fullWidth={false}
              style={{
                flex: 1,
              }}
            />
          </View>
        ) : (
          <FormikSubmit style={{ paddingVertical: 16 }} />
        )}
      </VStack>
    </Formik>
  );
}
