import Dinero from "dinero.js";

import type { SavingsItem } from "./types";

export function getItemAmount(item: SavingsItem): number {
  return parseFloat(
    item.amounts
      .reduce((acc, cur) => {
        return acc + (cur.type === "withdrawal" ? -1 : 1) * cur.amount;
      }, 0)
      .toFixed(2)
  );
}

export const formatCurrency = (value: number) => {
  const amount = Dinero({ amount: parseFloat(value.toFixed(2)) * 100, currency: "USD" });

  if (amount.hasSubUnits()) {
    return amount.toFormat("$0,0.00");
  }

  return amount.toFormat("$0,0");
};
