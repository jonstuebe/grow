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

  const onSave = useCallback(async (values: FormikFields) => {
    const user = getAuth(app).currentUser;

    const amount = parseFloat(values.amount as any) * 100;
    const totalAmount = parseFloat(values.totalAmount as any) * 100;

    await addDoc(collection(getFirestore(app), "items"), {
      title: values.title,
      icon: values.icon,
      amount,
      totalAmount,
      uid: user?.uid,
    });
    navigation.goBack();
  }, []);

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
          amount: undefined,
          totalAmount: undefined,
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
