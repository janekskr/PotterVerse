import React from 'react';
import { StyleSheet, View, TouchableOpacity, ColorValue } from "react-native";
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
import Colors from '@/constants/Colors';
import { houseImages } from '@/constants/data';

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
      navigation.setOptions({title: data.attributes.name, headerTitleStyle: {color: Colors.yellow}});
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
          source={data.attributes.image ||  require("@/assets/images/placeholder.png")}
          style={styles.characterImage}
          accessibilityLabel={`Image of ${data.attributes.name}`}
          contentFit="cover"
          contentPosition={"center"}
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
  const houseImage = data.house ? houseImages[data.house.toLowerCase() as keyof typeof houseImages] : null;
  const houseColor = data.house ? Colors[data.house as keyof typeof Colors] : null;
  return (
    <View style={styles.characterInfo}>
      <View style={styles.nameContainer}>
        <Text style={styles.characterName}>{data.name}</Text>
        {houseImage && (
          <Image
            source={houseImage}
            style={styles.houseImage}
          />
        )}
      </View>
      
      
      {Object.entries(data).map(([key, value]) => {
        if (["slug", "name", "image", "wiki"].includes(key)) {
          return null;
        }

        if (value && (typeof value === "string" || (Array.isArray(value) && value.length > 0))) {
          return (
            <View key={key} style={styles.characterDetailItem}>
              <Text>
                <Text style={styles.characterDetailLabel}>{key.replace("_", " ")}: </Text>
                {!Array.isArray(value) && (
                  <Text style={[
                    styles.characterDetailValue,
                    key === "house" && { color: houseColor as ColorValue }
                  ]}>
                    {value}
                  </Text>
                )}
              </Text>
              {Array.isArray(value) && (
                <View style={styles.characterDetailList}>
                  {value.map((item, index) => (
                    <Text key={index} style={styles.characterDetailListItem}>• {item}</Text>
                  ))}
                </View>
              )}
            </View>
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  characterName: {
    fontFamily: "MagicSchoolOne",
    fontSize: 50,
    lineHeight: 64,
    textAlign: "center",
  },
  houseImage: {
    width: 55,
    aspectRatio:1,
    marginLeft: 16,
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
  characterDetailItem: {
    marginBottom: 16,
  },
  characterDetailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: "capitalize",
    marginBottom: 4,
  },
  characterDetailValue: {
    fontSize: 16,
  },
  characterDetailList: {
    paddingLeft: 16,
  },
  characterDetailListItem: {
    fontSize: 16,
    marginBottom: 2,
  },
});

