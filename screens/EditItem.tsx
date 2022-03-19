import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { SavingsCardProps } from "../components/SavingsCard";
import ItemForm from "../forms/ItemForm";

export default function EditItem({
  item,
  onSaveChanges,
}: {
  item: SavingsCardProps;
  onSaveChanges: (item: SavingsCardProps) => void;
}) {
  const { bottom } = useSafeAreaInsets();

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
        initialValues={item}
        onSave={(values) => {
          onSaveChanges({
            title: values.title,
            amount: values.amount as number,
            totalAmount: values.totalAmount as number,
            icon: values.icon,
            id: item.id,
          });
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
