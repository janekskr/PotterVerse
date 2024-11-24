import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { House } from "@/lib/types";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { houseImages } from "@/constants/data";
import { getHouseColor } from "@/lib/utils";
import { useThemeColor } from "@/hooks/useThemeColor";
import Shadows from "@/constants/Shadows";

export default function HouseTile({ houseName }: { houseName: House }) {
  const color = getHouseColor(houseName);
  const backgroundColor = useThemeColor(
    { light: undefined, dark: undefined },
    "background"
  );

  return (
    <Link
      key={houseName}
      asChild
      href={{
        pathname: "/house/[houseName]",
        params: { houseName },
      }}
      style={{backgroundColor, ...Shadows.shadowBase}}
    >
      <Pressable
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Image source={houseImages[houseName]} style={styles.houseImage} />
        <Text style={[styles.houseName, color && { color }]}>{houseName}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  houseItem: {
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  houseImage: {
    height: 125,
    aspectRatio: 0.9,
  },
  houseName: {
    textAlign: "center",
    fontFamily: "MagicSchoolOne",
    textTransform: "capitalize",
    fontSize: 25,
    lineHeight: 30,
    marginTop: 3,
  },
});
