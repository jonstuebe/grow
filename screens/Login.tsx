import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useRef } from "react";
import { KeyboardAvoidingView, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "react-native-stacks";
import * as Yup from "yup";
import FormikField from "../components/FormikField";
import FormikSubmit from "../components/FormikSubmit";
import FormikTextInput from "../components/FormikTextInput";
import { Text } from "../components/Text";
import { app } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useTheme } from "../theme";
import { RootStackParamList } from "../types";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

export default function Login() {
  const { colors } = useTheme();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const scheme = useColorScheme();
  const passwordRef = useRef<TextInput>(null);

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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="leaf" size={36} color={colors.textDim} style={{ marginRight: 8 }} />
            <Text size={42} weight="bold">
              Grow
            </Text>
          </View>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                await signInWithEmailAndPassword(getAuth(app), values.email, values.password);
              } catch (e) {
                // @todo handle error
                console.log(e);
              }
            }}
          >
            {({ submitForm }) => (
              <VStack spacing={8} style={{ width: "100%", paddingHorizontal: 16 }}>
                <FormikTextInput
                  name="email"
                  label="Email"
                  textInputProps={{
                    autoCompleteType: "email",
                    autoCapitalize: "none",
                    autoCorrect: false,
                    returnKeyType: "next",
                    onSubmitEditing: () => {
                      passwordRef?.current?.focus();
                    },
                  }}
                />
                <FormikTextInput
                  ref={passwordRef}
                  name="password"
                  label="Password"
                  textInputProps={{
                    autoCompleteType: "password",
                    secureTextEntry: true,
                    autoCapitalize: "none",
                    autoCorrect: false,
                    returnKeyType: "done",
                    onSubmitEditing: () => {
                      submitForm();
                    },
                  }}
                />
                <FormikSubmit label="Login" submittingLabel="Logging in..." />
                <Text
                  onPress={() => {
                    navigate("Register");
                  }}
                >
                  or{" "}
                  <Text
                    style={{
                      color: scheme === "light" ? "#007aff" : "#3178c6",
                    }}
                  >
                    Sign up
                  </Text>
                </Text>
              </VStack>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
