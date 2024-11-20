import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Text, View } from "@/components/ui";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { Character } from "@/lib/types";

const placeholder = "https://avatarfiles.alphacoders.com/375/375208.png";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  // const houseColor = Colors[character.attributes.house as keyof typeof Colors];
  return (
    <Link
      href={{
        pathname: "/character/[id]",
        params: { id: character.id },
      }}
      asChild
    >
      <Pressable style={styles.characterCardWrapper}>
        {/* <LinearGradient
          colors={[Colors.Black, (houseColor as string) ?? "transparent"]}
        > */}
          <Image
            source={character.attributes?.image ?? placeholder}
            contentPosition="center"
            style={styles.characterImage}
          />
          <View style={styles.characterInfo}>
            <Text style={styles.characterName}>
              {character.attributes?.name}
            </Text>
            <Text style={styles.characterHouse}>
              {character.attributes?.house}
            </Text>
          </View>
        {/* </LinearGradient> */}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  characterCardWrapper: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  characterImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  characterInfo: {
    padding: 12,
  },
  characterName: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: "bold"
    // fontFamily: "MagicSchoolOne",
  },
  characterHouse: {
    fontSize: 16,
    fontFamily: "HarryP",
  },
});