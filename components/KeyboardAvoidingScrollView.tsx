import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
} from "react-native";

export interface KeyboardAvoidingScrollViewProps extends ScrollViewProps {}

export function KeyboardAvoidingScrollView({
  children,
  contentContainerStyle,
  style,
  ...props
}: KeyboardAvoidingScrollViewProps) {
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined} // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
    >
      <ScrollView
        style={[styles.root, style]}
        contentContainerStyle={[
          // { padding: 16, paddingBottom: 32 },
          contentContainerStyle,
        ]} // Accounting for the bottom inset being never on the parent's SafeAreaView
        scrollIndicatorInsets={{ right: Platform.OS === "ios" ? 1 : 0 }} // iOS 13 bug: https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
        keyboardDismissMode="interactive"
        {...props}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
