import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ActionSheetIOS, Pressable, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { ScrollView } from "react-native-gesture-handler";
import { orderBy } from "lodash-es";
import { dequal } from "dequal/lite";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

import { useTheme } from "../theme";
import { formatCurrency, getItemAmount } from "../utils";
import { app } from "../firebase";

import { Text } from "../components/Text";
import { Transaction } from "../components/Transaction";

import { RootStackParamList, SavingsItem, SavingsItemAmount } from "../types";

export default function Item() {
  const route = useRoute<RouteProp<RootStackParamList, "Item">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList, "Item">>();
  const { colors } = useTheme();

  const [item, setItem] = useState<SavingsItem>(() => route.params);

  const amount = useMemo(() => {
    return getItemAmount(item);
  }, [item]);

  const goalPerc = useMemo(() => {
    const perc = (amount / item.goal) * 100;

    if (perc > 100) return 100;
    return perc;
  }, [amount, item.goal]);

  const onDeleteTransaction = useCallback(
    async (transaction: SavingsItemAmount) => {
      await updateDoc(doc(getFirestore(app), "items-v2", item.id), {
        amounts: item.amounts.filter((i) => {
          return !dequal(i, transaction);
        }),
      });

      const docSnap = await getDoc(doc(getFirestore(app), "items-v2", item.id));

      if (docSnap.exists()) {
        setItem({
          id: docSnap.id,
          amounts: [] as SavingsItemAmount[],
          ...docSnap.data(),
        } as SavingsItem);
      }
    },
    [item.amounts, item.id]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: item.title,
      headerRight: () => (
        <Pressable
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                userInterfaceStyle: "dark",
                options: ["Edit", "Cancel"],
                cancelButtonIndex: 1,
              },
              (buttonIndex) => {
                if (buttonIndex !== 1) {
                  navigation.navigate("EditItem", item);
                }
              }
            );
          }}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
        </Pressable>
      ),
    });
  }, [colors.notification, colors.primary, navigation, item, item.title]);

  return (
    <ScrollView contentContainerStyle={{ flex: 1, marginVertical: 16, marginHorizontal: 16 }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 16,
          marginBottom: 32,
        }}
      >
        <CircularProgress
          value={goalPerc}
          radius={72}
          activeStrokeColor={colors.success}
          inActiveStrokeColor={colors.border}
          activeStrokeWidth={8}
          inActiveStrokeWidth={8}
          circleBackgroundColor={colors.background}
          valueSuffix="%"
          title={`${formatCurrency(amount)}`}
          titleFontSize={20}
          titleColor={colors.text}
          subtitle={`of ${formatCurrency(item.goal)}`}
          subtitleColor={colors.textDim}
          showProgressValue={false}
        />
      </View>

      <Text
        color="textDim"
        size={14}
        weight="semibold"
        style={{
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        transactions
      </Text>
      <View
        style={{
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {orderBy(item.amounts, ["dateAdded"], ["desc"]).map((amount, idx) => (
          <Transaction
            key={idx}
            data={amount}
            onDelete={onDeleteTransaction}
            style={[
              {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          />
        ))}
      </View>
    </ScrollView>
  );
}
