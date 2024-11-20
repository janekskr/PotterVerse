import React from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { Container, ParallaxScrollView, Text } from "@/components/ui";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchCharacterDetail } from "@/lib/api";
import { Loader } from "@/components";
import { Character } from "@/lib/types";
import { ExternalLink } from "@/components/ExternalLink";
import { AntDesign } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const PLACEHOLDER_IMAGE = "https://avatarfiles.alphacoders.com/375/375208.png";

const toggleLikeCharacter = async (characterId: string) => {
  const likedCharacters = await SecureStore.getItemAsync('likedCharacters');
  let likedArray = likedCharacters ? JSON.parse(likedCharacters) : [];

  if (likedArray.includes(characterId)) {
    likedArray = likedArray.filter((id: string) => id !== characterId);
  } else {
    likedArray.push(characterId);
  }

  await SecureStore.setItemAsync('likedCharacters', JSON.stringify(likedArray));
  return likedArray;
};

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useSuspenseQuery({
    queryKey: ["characterDetail", id],
    queryFn: () => fetchCharacterDetail(id),
  });

  const { data: likedCharacters } = useSuspenseQuery({
    queryKey: ["likedCharacters"],
    queryFn: async () => {
      const likedIds = await SecureStore.getItemAsync('likedCharacters');
      return likedIds ? JSON.parse(likedIds) : [];
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleLikeCharacter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likedCharacters"] });
    },
  });

  React.useEffect(() => {
    if (data) {
      navigation.setOptions({title: data.attributes.name});
    }
  }, [data, navigation]);

  if (isLoading) return <Loader />;

  if (isError) {
    console.error("Error fetching character:", error);
    return (
      <Container style={styles.container}>
        <Text>Nie znaleziono postaci</Text>
        <Link href="/(tabs)">Powrót</Link>
      </Container>
    );
  }

  const isLiked = likedCharacters?.includes(id);

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={data.attributes.image || PLACEHOLDER_IMAGE}
          style={styles.characterImage}
          accessibilityLabel={`Image of ${data.attributes.name}`}
          contentFit="cover"
          contentPosition={"top"}
        />
      }
      headerHeight={300}
      style={{ padding: 0 }}
    >
      <CharacterContent data={data.attributes} />
      <TouchableOpacity onPress={() => toggleLikeMutation.mutate()} style={styles.likeButton}>
        <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color="red" />
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

function CharacterContent({ data }: { data: Character["attributes"] }) {
  return (
    <View style={styles.characterInfo}>
      <Text style={styles.characterName}>{data.name}</Text>
      
      {Object.entries(data).map(([key, value]) => {
        if (["slug","name", "image", "wiki"].includes(key)) {
          return null;
        }

        if (value && (typeof value === "string" || (Array.isArray(value) && value.length > 0))) {
          return (
            <Text key={key} style={styles.characterDetail}>
              {key.replace("_", " ")}: {Array.isArray(value) ? value.join(', ') : value}
            </Text>
          );
        }        
        return null;
      })}
      <ExternalLink href={data.wiki}><Text type="link">Link to wiki</Text></ExternalLink>
    </View>
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
  },
  characterInfo: {
    paddingHorizontal: 32,
    flex: 1,
    paddingVertical: 16,
  },
  characterName: {
    fontFamily: "MagicSchoolOne",
    fontSize: 50,
    lineHeight: 64,
    textAlign: "center",
  },
  characterDetail: {
    fontSize: 16,
    marginBottom: 8,
  },
  backLink: {
    padding: 16,
    alignItems: "center",
  },
  likeButton: {
    position: 'absolute',
    top: 310,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});