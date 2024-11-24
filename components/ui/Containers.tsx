import React from "react";
import { ThemedView, ThemedViewProps } from "./ThemedView";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ContainerProps extends ThemedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function ScrollableContainer({ children, style, ...rest }: ContainerProps) {
  const backgroundColor = useThemeColor(
    {},
    "background"
  );
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[styles.container, { backgroundColor }, style]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

function Container({ children, style, ...rest }: ContainerProps) {
  return (
    <ThemedView
      style={[
        {
          flex: 1,
        },
        styles.container,
        style,
      ]}
      {...rest}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 16,
  },
});

export { ScrollableContainer, Container };
