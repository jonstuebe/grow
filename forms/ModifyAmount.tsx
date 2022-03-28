import { View, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import { Text } from "../components/Text";
import { useTheme } from "../theme";

const validationSchema = Yup.object().shape({
  amount: Yup.number().positive().required("Please enter a value"),
});

export function ModifyAmount({
  onSubmit,
}: {
  onSubmit: (values: { amount: string }) => Promise<void>;
}) {
  const { colors } = useTheme();

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        amount: "",
      }}
      onSubmit={onSubmit}
    >
      {({ submitForm, setFieldValue, setFieldTouched, values, errors }) => (
        <>
          <Text
            size={16}
            weight="medium"
            style={{
              marginVertical: 8,
              marginLeft: 16,
            }}
          >
            Amount
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 8,
              position: "relative",
              marginBottom: 16,
              marginHorizontal: 16,
            }}
          >
            <TextInput
              autoFocus
              style={{
                fontFamily: "System",
                fontWeight: "600",
                fontSize: 16,
                color: colors.text,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              keyboardType="numeric"
              returnKeyType="done"
              value={values.amount}
              onChangeText={(text) => {
                if (values.amount !== text) {
                  setFieldTouched("amount", true);
                }

                setFieldValue("amount", text);
              }}
              onSubmitEditing={() => {
                submitForm();
              }}
              onBlur={() => {
                setFieldTouched("amount", true);
              }}
            />
            {errors.amount && errors.amount !== "" ? (
              <View
                style={{
                  borderTopColor: colors.border,
                  borderTopWidth: 1,
                  backgroundColor: colors.errorBackground,
                  marginHorizontal: 0,
                  marginBottom: 0,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Text color="text">{errors.amount}</Text>
              </View>
            ) : null}
          </View>
        </>
      )}
    </Formik>
  );
}
