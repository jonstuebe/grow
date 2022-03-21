import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "react-native-stacks";
import * as Yup from "yup";
import Button from "../components/Button";
import FormikField from "../components/FormikField";
import FormikSubmit from "../components/FormikSubmit";
import { Text, useTextColor } from "../components/Themed";
import { app } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

export default function Login() {
  const { navigate } = useNavigation();
  const scheme = useColorScheme();

  const textColor = useTextColor("dim");

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
            <Ionicons
              name="leaf"
              size={36}
              color={textColor}
              style={{ marginRight: 8 }}
            />
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
                await signInWithEmailAndPassword(
                  getAuth(app),
                  values.email,
                  values.password
                );
              } catch (e) {
                // @todo handle error
                console.log(e);
              }
            }}
          >
            <VStack
              spacing={12}
              style={{ width: "100%", paddingHorizontal: 16 }}
            >
              <FormikField
                name="email"
                label="Email"
                textInputProps={{
                  autoCompleteType: "email",
                  autoCapitalize: "none",
                  autoCorrect: false,
                }}
              />
              <FormikField
                name="password"
                label="Password"
                textInputProps={{
                  autoCompleteType: "password",
                  secureTextEntry: true,
                  autoCapitalize: "none",
                  autoCorrect: false,
                }}
              />
              <FormikSubmit label="Submit" />
              <Text
                onPress={() => {
                  navigate("Register");
                }}
              >
                or{" "}
                <Text
                  style={{ color: scheme === "light" ? "#007aff" : "#3178c6" }}
                >
                  Sign up
                </Text>
              </Text>
            </VStack>
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
