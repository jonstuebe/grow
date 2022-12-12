import { useQuery } from "@tanstack/react-query";
import {
  query,
  collection,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from "@firebase/firestore";

import { auth, db } from "../firebase";
import { AmountType, ItemType } from "../components/Item";
import { parseISO } from "date-fns";

// @todo maybe we should add a UID so that if you had multiple user accounts the cache would be separate
export const getItemsQueryKey = () => ["items"];
export function useItemsQuery() {
  return useQuery({
    queryKey: getItemsQueryKey(),
    queryFn: async () => {
      const user = auth.currentUser;
      const q = query(
        collection(db, "items-v2"),
        where("uid", "==", user?.uid),
        orderBy("title", "asc")
      );
      const snapshots = await getDocs(q);

      const items: ItemType[] = [];
      snapshots.docs.forEach((item) => {
        const data = item.data();

        items.push({
          id: item.id,
          title: data.title as string,
          goal: data.goal as number,
          goalDate: parseISO(data.goalDate),
          amounts: data.amounts.map((item: any) => ({
            amount: item.amount as number,
            dateAdded: parseISO(item.dateAdded),
            type: item.type as AmountType,
          })),
        });
      });

      return items;
    },
  });
}
