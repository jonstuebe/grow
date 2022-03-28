import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { app } from "../firebase";

import ItemForm, { FormikFields } from "../forms/ItemForm";

export default function AddItem() {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  const onSave = useCallback(
    async (values: FormikFields) => {
      const user = getAuth(app).currentUser;
      const goal = parseFloat(values.goal as unknown as string);

      await addDoc(collection(getFirestore(app), "items-v2"), {
        title: values.title,
        icon: values.icon,
        goal,
        uid: user?.uid,
      });
      navigation.goBack();
    },
    [navigation]
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottom,
        },
      ]}
    >
      <ItemForm
        onSave={onSave}
        initialValues={{
          title: "",
          goal: undefined,
          icon: "",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
