import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import Colors from "@/constants/Colors";

function TabBarIcon({
  focused,
  name,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>["name"]> & { focused: boolean }) {
  return (
    <Ionicons
      size={28}
      style={{ marginBottom: -3 }}
      name={focused ? name as any : `${name}-outline`}
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
    }}
    >
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="search" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="home"
              focused={focused}
              color={color}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
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
