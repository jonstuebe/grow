import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays } from "date-fns";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { iOSColors, iOSUIKit } from "react-native-typography";

import { useNavigation } from "../hooks/useHomeNavigation";
import { useRoute } from "../hooks/useRoute";

import { doc, Timestamp, updateDoc } from "@firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { Stepper } from "../components/Stepper";
import { db } from "../firebase";
import Color from "color";
import { deserializeItem } from "../components/Item";

export default function Item() {
  const { setOptions, goBack } = useNavigation<"Add">();
  const { params } = useRoute<"Item">();
  const deserializedItem = useMemo(() => deserializeItem(params), [params]);
  const client = useQueryClient();

  const [name, setName] = useState<string>(() => deserializedItem.name);
  const [isError, setIsError] = useState(false);
  const [feedsNum, setFeedsNum] = useState<number>(
    () => deserializedItem.feedsNum
  );
  const [expiresAt, setExpiresAt] = useState<Date>(
    () => deserializedItem.expiresAt
  );

  const onSubmit = useCallback(async () => {
    if (name === "") {
      setIsError(true);
      return;
    }

    try {
      await updateDoc(doc(db, "items", deserializedItem.id), {
        name,
        feedsNum,
        expiresAt: Timestamp.fromDate(expiresAt),
      });
      await client.invalidateQueries(["items"]);

      goBack();
    } catch (e) {
      console.log(e);
    }
  }, [deserializedItem.id, client, name, feedsNum, expiresAt]);

  useEffect(() => {
    if (name !== "") setIsError(false);
  }, [name]);

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
  }, [goBack, onSubmit]);

  return (
    <ScrollView>
      <TableView appearance="dark">
        <Section hideSurroundingSeparators roundedCorners>
          <Cell
            title="Name"
            titleTextProps={{
              allowFontScaling: false,
            }}
            cellAccessoryView={
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Item name"
                  placeholderTextColor={
                    isError
                      ? Color(iOSColors.red).hsl().fade(0.4).string()
                      : undefined
                  }
                  autoComplete="off"
                  autoFocus
                  keyboardAppearance="dark"
                  value={name}
                  onChangeText={setName}
                  onSubmitEditing={() => onSubmit()}
                  style={{ flex: 1, color: "#fff", textAlign: "right" }}
                />
              </View>
            }
          />
          <Cell
            title="Expire Date"
            titleTextProps={{
              allowFontScaling: false,
            }}
            cellAccessoryView={
              <DateTimePicker
                mode="date"
                display="compact"
                minimumDate={addDays(new Date(), 1)}
                onChange={(_event, date) => date && setExpiresAt(date)}
                themeVariant="dark"
                value={expiresAt}
              />
            }
          />
          <Cell
            title="Feeds"
            titleTextProps={{
              allowFontScaling: false,
            }}
            cellAccessoryView={
              <Stepper value={feedsNum} minValue={1} onChange={setFeedsNum} />
            }
          />
        </Section>
      </TableView>
    </ScrollView>
  );
}
