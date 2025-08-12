// Path: app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TabBarBackground } from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint || "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // allows transparent blur background
            backgroundColor: "transparent",
          },
          default: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              symbol={focused ? "🏠" : "🏘️"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              symbol={focused ? "🔍" : "🔎"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Events",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              symbol={focused ? "🎫" : "🎟️"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              symbol={focused ? "👤" : "👥"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          title: "Not Found",
          tabBarIcon: ({ color }) => (
            <IconSymbol symbol="❓" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
