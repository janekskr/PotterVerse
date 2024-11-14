import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Container, Text, View } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacterDetail } from "@/lib/api";
import { Loader } from "@/components";

const PLACEHOLDER_IMAGE = "https://avatarfiles.alphacoders.com/375/375208.png";

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["characterDetail", id],
  //   queryFn: () => fetchCharacterDetail(id),
  //   enabled: !!id,
  //   retry: false,
  // });

  // if (isLoading) return <Loader />;

  // if (isError || !data) {
  //   console.error("Error fetching character:", error);
  //   return (
  //     <Container style={styles.container}>
  //       <Text>Nie znaleziono postaci</Text>
  //       <Text>id: {id}</Text>
  //       <Text>Error: {error instanceof Error ? error.message : 'Unknown error'}</Text>
  //       <Link href="/">Powrót</Link>
  //     </Container>
  //   );
  // }

  // const data ={
  //     id: "dde712de-4fce-487f-a365-e15bf01d31ce",
  //     type: "character",
  //     attributes: {
  //       slug: "unidentified-8-year-old-muggle-girl",
  //       alias_names: [],
  //       animagus: null,
  //       blood_status: "Muggle",
  //       boggart: null,
  //       born: "1983",
  //       died: null,
  //       eye_color: null,
  //       family_members: [],
  //       gender: "Female",
  //       hair_color: null,
  //       height: null,
  //       house: null,
  //       image: null,
  //       jobs: [],
  //       marital_status: null,
  //       name: "8-year-old Muggle girl",
  //       nationality: null,
  //       patronus: null,
  //       romances: [],
  //       skin_color: null,
  //       species: "Human",
  //       titles: [],
  //       wands: [],
  //       weight: null,
  //       wiki: "https://harrypotter.fandom.com/wiki/Unidentified_8-year-old_Muggle_girl"
  //     },
  //     links: {
  //       self: "/v1/characters/dde712de-4fce-487f-a365-e15bf01d31ce"
  //   }
  // } 

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: data.attributes.image || PLACEHOLDER_IMAGE }}
        style={styles.characterImage}
        accessibilityLabel={`Image of ${data.attributes.name}`}
      />
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{data.attributes.name}</Text>
        {Object.entries(data.attributes).map(([key, value]) => {
          if (value && typeof value === "string") {
            return (
              <Text key={key} style={styles.characterDetail}>
                {key.replace("_", " ")}: {value}
              </Text>
            );
          }
          return null;
        })}
      </View>
      <Link href="/" style={styles.backLink}>
        <Text>Back to Characters</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  characterImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  characterInfo: {
    padding: 16,
  },
  characterName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  characterDetail: {
    fontSize: 16,
    marginBottom: 8,
  },
  backLink: {
    padding: 16,
    alignItems: 'center',
  },
});