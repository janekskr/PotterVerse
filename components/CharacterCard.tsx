import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui";
import { Link } from "expo-router";
import { Character } from "@/lib/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import Shadows from "@/constants/Shadows";
// import LikeButton from "./LikeButton";

interface CharacterCardProps {
  character: Character;
  isLiked: boolean
}

export default function CharacterCard({ character,isLiked }: CharacterCardProps) {
  const backgroundColor = useThemeColor(
    { dark: "#1c1c1c" },
    "background"
  );
  
  return (
    <Link
      href={{
        pathname: "/character/[id]",
        params: { id: character.id },
      }}
      asChild
    >
      <Pressable
        style={{
          marginBottom: 20,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor,
          ...Shadows.shadowSm,
        }}
      >
        <Image
          source={
            character.attributes?.image ??
            require("@/assets/images/placeholder.png")
          }
          contentPosition="center"
          style={styles.characterImage}
        />
        <View style={styles.characterInfo}>
          <Text style={styles.characterName} numberOfLines={1}>
            {character.attributes?.name}
          </Text>
          {/* <LikeButton id={character.id} isLiked={isLiked} /> */}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  characterImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  characterInfo: {
    padding: 12,
    gap: 5,
  },
  characterName: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
    flex: 1,
  },
});
