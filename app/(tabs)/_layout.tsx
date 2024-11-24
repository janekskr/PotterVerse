import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import Colors from "@/constants/Colors";
import Logo from "@/components/Logo";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  const backgroundColor = useThemeColor({},"background")
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarLabelStyle: { marginBottom: -15 },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.primary,
        headerStyle: {backgroundColor},
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
