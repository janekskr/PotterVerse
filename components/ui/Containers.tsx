import React from "react";
import { ThemedView, ThemedViewProps } from "./ThemedView";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

interface ContainerProps extends ThemedViewProps {
  children: React.ReactNode,
  style?: ViewStyle
}

function ScrollableContainer({
  children,
  style,
  ...rest
}: ContainerProps) {
  return (
    <ScrollView
      style={{ flex: 1}}
      contentContainerStyle={[styles.container, style]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

function Container({
  children,
  style,
  ...rest
}: ContainerProps) {
  return (
    <ThemedView
      style={[
        {
          flex: 1,
        },
        styles.container,
        style
      ]}
      {...rest}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 16,
  },
});

export { ScrollableContainer, Container };