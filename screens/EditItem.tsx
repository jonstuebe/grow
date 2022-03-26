import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useCallback, useLayoutEffect } from "react";
import { ActionSheetIOS, Pressable, StyleSheet, View } from "react-native";

import { app } from "../firebase";

import type { SavingsCardProps } from "../components/SavingsCard";
import { useTextColor } from "../components/Themed";
import ItemForm from "../forms/ItemForm";

import { RootStackParamList } from "../types";

export default function EditItem() {
  const errorColor = useTextColor("error");
  const navigation = useNavigation();
  const { params: item } =
    useRoute<RouteProp<RootStackParamList, "EditItem">>();

  const onSaveChanges = useCallback(
    async ({ id, ...item }: SavingsCardProps) => {
      const user = getAuth(app).currentUser;
      const amount = parseFloat(item.amount as any) * 100;
      const totalAmount = parseFloat(item.totalAmount as any) * 100;

      await updateDoc(doc(getFirestore(app), "items", id), {
        title: item.title,
        icon: item.icon,
        amount,
        totalAmount,
        uid: user?.uid,
      });

      navigation.goBack();
    },
    []
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                title: "Delete Item",
                message: "Are you sure you want to delete this item?",
                options: ["Cancel", "Delete"],
                cancelButtonIndex: 0,
                destructiveButtonIndex: 1,
              },
              async (buttonIndex) => {
                if (buttonIndex === 1) {
                  try {
                    await deleteDoc(doc(getFirestore(app), "items", item.id));
                    close();
                  } catch (e) {
                    // @todo handle error
                    console.log(e);
                  }
                }
              }
            );
          }}
        >
          <Ionicons name="trash" size={24} color={errorColor} />
        </Pressable>
      ),
    });
  }, []);

  return (
    <View style={[styles.container]}>
      <ItemForm
        initialValues={item}
        onSave={(values) => {
          onSaveChanges({
            title: values.title,
            amount: values.amount ?? 0,
            totalAmount: values.totalAmount ?? 0,
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
  },
});
