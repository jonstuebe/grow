import { useEffect, useMemo } from "react";
import Confetti from "react-native-confetti";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import { MotiView } from "moti";
import { Pressable, Text, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import { Portal } from "react-native-portalize";
import { FIREBASE_AUTH_DOMAIN } from "@env";

import Colors from "../Colors";

import { useNavigation } from "../hooks/useHomeNavigation";
import { useConfetti } from "../hooks/useConfetti";

import { useItemsQuery } from "../queries/useItemsQuery";

import Item from "../components/Item";
import { emitter } from "../emitter";

export default function Home() {
  const { navigate } = useNavigation<"Home">();
  const { colors } = useTheme();

  const { confettiRef, startConfetti } = useConfetti();
  const itemsQuery = useItemsQuery();

  useEffect(() => {
    emitter.on("confetti", startConfetti);

    return () => {
      emitter.off("confetti");
    };
  }, [startConfetti]);

  const totalAmount = useMemo(() => {
    if (!itemsQuery.isSuccess || !itemsQuery.data) {
      return undefined;
    }

    const amountInCents = itemsQuery.data.reduce((acc, cur) => {
      return (
        acc +
        cur.amounts.reduce((acc, cur) => {
          switch (cur.type) {
            case "deposit":
              return acc + cur.amount;
            case "withdrawal":
              return acc - cur.amount;
            default:
              return acc;
          }
        }, 0)
      );
    }, 0);

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(amountInCents / 100);
  }, [itemsQuery]);

  return (
    <>
      <SafeAreaView
        mode="padding"
        edges={["top", "bottom"]}
        style={{ flex: 1 }}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 550,
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              iOSUIKit.largeTitleEmphasizedWhite,
              {
                marginTop: 16,
                marginBottom: 16,
                marginLeft: 16,
              },
            ]}
          >
            {itemsQuery.isSuccess &&
            itemsQuery.data &&
            itemsQuery.data.length > 0
              ? `${totalAmount}`
              : "Items"}
          </Text>
          <Pressable
            onPress={() => navigate("Settings")}
            style={{
              backgroundColor: colors.card,
              borderRadius: 32 / 2,

              width: 32,
              height: 32,

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="ios-cog"
              size={20}
              style={{
                marginLeft: 2,
              }}
              color={Color("#fff").hsl().darken(0.6).string()}
            />
          </Pressable>
        </MotiView>
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 8, scale: 0.7 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0, scale: 1 }] }}
          transition={{
            type: "timing",
            duration: 350,
          }}
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 24,
            paddingVertical: 12,
            position: "relative",
          }}
        >
          {itemsQuery.data?.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[iOSUIKit.title3White]}>No Items</Text>
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  onRefresh={itemsQuery.refetch}
                  refreshing={itemsQuery.isRefetching}
                />
              }
              contentContainerStyle={{
                flex: 1,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              {itemsQuery.data?.map((item, index) => (
                <Item
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  amounts={item.amounts}
                  goal={item.goal}
                  goalDate={item.goalDate}
                  style={{
                    marginBottom:
                      itemsQuery.data?.length === index + 1 ? undefined : 12,
                  }}
                />
              ))}
            </ScrollView>
          )}
        </MotiView>
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 200 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{
            type: "timing",
            duration: 750,
          }}
          style={{
            marginTop: 12,
          }}
        >
          <Pressable
            style={{
              alignItems: "center",
              justifyContent: "center",

              width: "100%",
              borderRadius: 24,
              paddingVertical: 16,
              paddingHorizontal: 12,

              backgroundColor: Colors.blue,
            }}
            onPress={() => navigate("Add")}
          >
            <Text
              allowFontScaling={false}
              style={[iOSUIKit.bodyEmphasizedWhite, { fontSize: 20 }]}
            >
              Add
            </Text>
          </Pressable>
        </MotiView>
      </SafeAreaView>
      <Portal>
        <Confetti ref={confettiRef} confettiCount={100} />
      </Portal>
    </>
  );
}
