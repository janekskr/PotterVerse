import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import Colors from "@/constants/Colors";
import { Text, View } from "@/components/ui";
import Logo from "@/components/Logo";

function TabBarIcon({
  focused,
  name,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>["name"]> & { focused: boolean }) {
  return (
    <Ionicons
      size={28}
      style={{ marginBottom: -3 }}
      name={focused ? (name as any) : `${name}-outline`}
      {...rest}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarLabelStyle: { marginBottom: -15 },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.yellow,
        headerTitle: () => (
          <Logo/>
        ),
        headerShadowVisible: false
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="search" color={color} focused={focused} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" focused={focused} color={color} />
          ),
          
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="heart" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
