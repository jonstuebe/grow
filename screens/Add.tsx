import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Color from "color";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { Pressable, Switch, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { iOSColors } from "react-native-typography";

import { useNavigation } from "../hooks/useHomeNavigation";
import { useRoute } from "../hooks/useRoute";

import { addDoc, collection } from "@firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { MotiView } from "moti";
import { z } from "zod";
import { serializeItem } from "../components/Item";
import { auth, db } from "../firebase";
import { getItemsQueryKey } from "../queries/useItemsQuery";
import {
  convertToCents,
  stripCharacters,
  updateCurrencyOnBlur,
} from "../utils";
import { emitter } from "../emitter";

const schema = z
  .object({
    title: z.string().min(1),
    initialAmount: z.string().min(1),
    isGoal: z.boolean(),
    goalAmount: z.string().min(1).optional(),
    goalDate: z.date().optional(),
  })
  .refine(
    (schema) => {
      if (schema.isGoal === true) {
        return !!schema.goalAmount && !!schema.goalDate;
      }

      return true;
    },
    {
      message: "Goal fields are required",
    }
  );

type FormFieldNames =
  | "title"
  | "initialAmount"
  | "isGoal"
  | "goalAmount"
  | "goalDate";

type FormErrors = Partial<Record<FormFieldNames, boolean>>;

export default function Add() {
  const { setOptions, goBack } = useNavigation<"Add">();
  const { params } = useRoute<"Add">();
  const client = useQueryClient();

  const [errors, setErrors] = useState<FormErrors>({});
  const [title, setTitle] = useState<string | undefined>();
  const [isGoal, setIsGoal] = useState<boolean>(false);
  const [goal, setGoal] = useState<string | undefined>();
  const [goalDate, setGoalDate] = useState<Date>(() => new Date());
  const [initialAmount, setInitialAmount] = useState<string | undefined>();

  const onSubmit = useCallback(async () => {
    try {
      const response = await schema.parseAsync({
        title,
        initialAmount,
        isGoal,
        goalAmount: goal,
        goalDate,
      });

      const serializedItem = serializeItem({
        id: "",
        title: response.title,
        goal: convertToCents(response.goalAmount),
        goalDate: response.goalDate,
        amounts: [
          {
            amount: convertToCents(initialAmount),
            dateAdded: new Date(),
            type: "deposit",
          },
        ],
      });

      await addDoc(collection(db, "items-v2"), {
        title,
        goal: serializedItem.goal,
        goalDate: serializedItem.goalDate,
        amounts: serializedItem.amounts,
        uid: auth.currentUser?.uid,
      });

      emitter.emit("confetti");
      await client.invalidateQueries(getItemsQueryKey());
      goBack();
    } catch (e) {
      if (e instanceof z.ZodError) {
        for (const issue of e.issues) {
          for (const fieldName of issue.path) {
            setErrors((prev) => {
              prev[fieldName as FormFieldNames] = true;
              return prev;
            });
          }
        }

        return;
      }
    }
  }, [title, initialAmount, isGoal, goal, goalDate]);

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
    <>
      <ScrollView>
        <TableView appearance="dark">
          <Section hideSurroundingSeparators roundedCorners>
            <Cell
              title="Title"
              titleTextProps={{
                allowFontScaling: false,
              }}
              cellAccessoryView={
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Item name"
                    placeholderTextColor={
                      errors.title
                        ? Color(iOSColors.red).hsl().fade(0.4).string()
                        : undefined
                    }
                    autoComplete="off"
                    autoFocus
                    keyboardAppearance="dark"
                    value={title}
                    onChangeText={setTitle}
                    style={{ flex: 1, color: "#fff", textAlign: "right" }}
                  />
                </View>
              }
            />
            <Cell
              title="Initial Amount"
              titleTextProps={{
                allowFontScaling: false,
              }}
              cellAccessoryView={
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Enter amount"
                    placeholderTextColor={
                      errors.initialAmount
                        ? Color(iOSColors.red).hsl().fade(0.4).string()
                        : undefined
                    }
                    onBlur={(e) =>
                      updateCurrencyOnBlur(e.nativeEvent.text, setInitialAmount)
                    }
                    autoComplete="off"
                    keyboardType="numeric"
                    keyboardAppearance="dark"
                    value={initialAmount}
                    onChangeText={(text) =>
                      stripCharacters(text, setInitialAmount)
                    }
                    blurOnSubmit
                    onSubmitEditing={() => {
                      if (!isGoal) {
                        onSubmit();
                      }
                    }}
                    style={{ flex: 1, color: "#fff", textAlign: "right" }}
                  />
                </View>
              }
            />
          </Section>
          <Section hideSeparator hideSurroundingSeparators roundedCorners>
            <Cell
              title="Goal"
              cellAccessoryView={
                <Switch
                  value={isGoal}
                  onValueChange={setIsGoal}
                  style={{
                    transform: [{ scale: 0.8 }],
                    marginRight: -8,
                  }}
                />
              }
            />
            {isGoal ? (
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Cell
                  title="Goal Amount"
                  cellAccessoryView={
                    <View style={{ flex: 1 }}>
                      <TextInput
                        placeholder="Enter amount"
                        placeholderTextColor={
                          errors.goalAmount
                            ? Color(iOSColors.red).hsl().fade(0.4).string()
                            : undefined
                        }
                        onBlur={(e) =>
                          updateCurrencyOnBlur(e.nativeEvent.text, setGoal)
                        }
                        onChangeText={(text) => stripCharacters(text, setGoal)}
                        autoComplete="off"
                        keyboardType="numeric"
                        keyboardAppearance="dark"
                        value={goal}
                        style={{ flex: 1, color: "#fff", textAlign: "right" }}
                      />
                    </View>
                  }
                />
                <Cell
                  title="Goal Date"
                  titleTextProps={{
                    allowFontScaling: false,
                  }}
                  cellAccessoryView={
                    <DateTimePicker
                      mode="date"
                      display="compact"
                      minimumDate={new Date()}
                      onChange={(_event, date) => date && setGoalDate(date)}
                      themeVariant="dark"
                      style={{
                        transform: [{ scale: 0.8 }],
                        marginRight: -16,
                      }}
                      value={goalDate}
                    />
                  }
                />
              </MotiView>
            ) : null}
          </Section>
        </TableView>
      </ScrollView>
    </>
  );
}
