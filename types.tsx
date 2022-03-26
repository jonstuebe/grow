/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface SavingsItem {
  id: string;
  title: string;
  icon: string;
  amount: number;
  totalAmount: number;
}

export type RootStackParamList = {
  Home: undefined;
  AddItem: undefined;
  EditItem: SavingsItem;
  Login: undefined;
  Register: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabScreenProps = NativeStackScreenProps<RootStackParamList>;
