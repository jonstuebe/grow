import { getAuth } from "firebase/auth";
import { doc, getFirestore, collection, addDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { app } from "../firebase";

import ItemForm, { FormikFields } from "../forms/ItemForm";

export default function AddItem({ close }: { close: VoidFunction }) {
  const { bottom } = useSafeAreaInsets();

  const onSave = useCallback(async (values: FormikFields) => {
    const user = getAuth(app).currentUser;
    await addDoc(collection(getFirestore(app), "items"), {
      title: values.title,
      icon: values.icon,
      amount: parseFloat(values.amount as any as string),
      totalAmount: parseFloat(values.totalAmount as any as string),
      uid: user?.uid,
    });

    close();
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
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
