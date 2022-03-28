import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "react-native-stacks";
import { Formik } from "formik";
import * as Yup from "yup";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import FormikTextInput from "../components/FormikTextInput";
import FormikSubmit from "../components/FormikSubmit";
import { app } from "../firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

export default function Register() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                await createUserWithEmailAndPassword(getAuth(app), values.email, values.password);
              } catch (e) {
                // @todo handle error
                console.log(e);
              }
            }}
          >
            <VStack spacing={12} style={{ width: "100%", paddingHorizontal: 16 }}>
              <FormikTextInput
                name="email"
                label="Email"
                textInputProps={{
                  autoCompleteType: "email",
                  autoCapitalize: "none",
                  autoCorrect: false,
                }}
              />
              <FormikTextInput
                name="password"
                label="Password"
                textInputProps={{
                  autoCompleteType: "password",
                  secureTextEntry: true,
                  autoCapitalize: "none",
                  autoCorrect: false,
                }}
              />
              <FormikSubmit label="Create Account" />
            </VStack>
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
