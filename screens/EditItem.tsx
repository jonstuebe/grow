import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useCallback, useLayoutEffect } from "react";
import { ActionSheetIOS, Pressable, StyleSheet, View } from "react-native";

import { app } from "../firebase";

import ItemForm from "../forms/ItemForm";

import type { RootStackParamList, SavingsItem } from "../types";
import { useTheme } from "../theme";

export default function EditItem() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { params: item } = useRoute<RouteProp<RootStackParamList, "EditItem">>();

  const onSaveChanges = useCallback(
    async ({ id, ...item }: Omit<SavingsItem, "amounts">) => {
      const goal = parseFloat(item.goal as unknown as string);

      await updateDoc(doc(getFirestore(app), "items-v2", id), {
        title: item.title,
        icon: item.icon,
        goal,
      });

      navigation.goBack();
    },
    [navigation]
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
                userInterfaceStyle: "dark",
              },
              async (buttonIndex) => {
                if (buttonIndex === 1) {
                  try {
                    await deleteDoc(doc(getFirestore(app), "items-v2", item.id));
                    navigation.goBack();
                  } catch (e) {
                    // @todo handle error
                    console.log(e);
                  }
                }
              }
            );
          }}
        >
          <Ionicons name="trash" size={24} color={colors.error} />
        </Pressable>
      ),
    });
  }, [colors.error, item.id, navigation]);

  return (
    <View style={[styles.container]}>
      <ItemForm
        initialValues={item}
        onSave={(values) => {
          onSaveChanges({
            title: values.title,
            goal: values.goal ?? 0,
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
