import { signOut } from "@firebase/auth";
import { ScrollView } from "react-native-gesture-handler";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { auth } from "../firebase";

export default function Settings() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="interactive"
      style={{ flex: 1 }}
    >
      <TableView
        appearance="dark"
        style={{
          marginHorizontal: 16,
        }}
      >
        <Section roundedCorners hideSurroundingSeparators>
          <Cell
            title="Logout"
            accessory="DisclosureIndicator"
            onPress={() => {
              signOut(auth).catch((e) => {
                //
              });
            }}
          />
        </Section>
      </TableView>
    </ScrollView>
  );
}
