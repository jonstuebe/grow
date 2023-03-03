import Ionicons from "@expo/vector-icons/Ionicons";
import { doc, updateDoc } from "@firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import Color from "color";
import { useCallback, useLayoutEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { iOSColors } from "react-native-typography";
import { z } from "zod";

import { db } from "../firebase";
import { useNavigation } from "../hooks/useHomeNavigation";
import { useRoute } from "../hooks/useRoute";
import { getItemsQueryKey } from "../queries/useItemsQuery";
import {
  convertToCents,
  stripCharacters,
  updateCurrencyOnBlur,
} from "../utils";

const schema = z.object({
  amount: z.string().min(1),
});

export default function ItemDeposit() {
  const { setOptions, goBack } = useNavigation<"Add">();
  const queryClient = useQueryClient();
  const { params } = useRoute<"Deposit">();

  const [amount, setAmount] = useState<string | undefined>();
  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    try {
      const response = await schema.parseAsync({ amount });

      await updateDoc(doc(db, "items-v2", params.id), {
        amounts: [
          ...params.amounts,
          {
            amount: convertToCents(response.amount),
            dateAdded: new Date().toISOString(),
            type: "deposit",
          },
        ],
      });
      await queryClient.invalidateQueries(getItemsQueryKey());
      goBack();
    } catch (e) {
      setIsError(true);
    }
  }, [amount, goBack]);

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <Pressable onPress={() => goBack()}>
          <Ionicons name="close" color={iOSColors.gray} size={24} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={onSubmit}>
          <Ionicons name="checkmark" color={iOSColors.green} size={24} />
        </Pressable>
      ),
    });
  }, [params, goBack, onSubmit]);

  return (
    <View>
      <TableView appearance="dark">
        <Section hideSurroundingSeparators roundedCorners>
          <Cell
            title="Amount"
            titleTextProps={{
              allowFontScaling: false,
            }}
            cellAccessoryView={
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Enter amount"
                  placeholderTextColor={
                    isError
                      ? Color(iOSColors.red).hsl().fade(0.4).string()
                      : undefined
                  }
                  onBlur={(e) =>
                    updateCurrencyOnBlur(e.nativeEvent.text, setAmount)
                  }
                  autoFocus
                  autoComplete="off"
                  keyboardType="numeric"
                  keyboardAppearance="dark"
                  value={amount}
                  onChangeText={(text) => stripCharacters(text, setAmount)}
                  blurOnSubmit
                  onSubmitEditing={onSubmit}
                  style={{ flex: 1, color: "#fff", textAlign: "right" }}
                />
              </View>
            }
          />
        </Section>
      </TableView>
    </View>
  );
}
