import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ItemForm, { FormikFields } from "../forms/ItemForm";

export default function AddItem() {
  const { bottom } = useSafeAreaInsets();

  const onSave = useCallback(async (values: FormikFields) => {
    // @todo implement with firebase
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
