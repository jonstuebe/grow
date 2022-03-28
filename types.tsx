/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    type RootParamList = RootStackParamList;
  }
}

export interface SavingsItemAmount {
  amount: number;
  dateAdded: string;
  type: "deposit" | "withdrawal";
}

export interface SavingsItem {
  id: string;
  title: string;
  icon: string;
  amounts: SavingsItemAmount[];
  goal: number;
}

export type RootStackParamList = {
  Home: undefined;
  Item: SavingsItem;
  AddItem: undefined;
  EditItem: SavingsItem;
  Login: undefined;
  Register: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabScreenProps = NativeStackScreenProps<RootStackParamList>;
