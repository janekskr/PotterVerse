import React, { useEffect } from "react";
import { StyleSheet, View, ColorValue } from "react-native";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { Container, ParallaxScrollView, Text } from "@/components/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchCharacterDetail, getLikes } from "@/lib/api";
import { LikeButton, Loader } from "@/components";
import { Character } from "@/lib/types";
import { ExternalLink } from "@/components/ExternalLink";
import { houseImages } from "@/constants/data";
import { getHouseColor } from "@/lib/utils";
import Shadows from "@/constants/Shadows";

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { data, isLoading, isError } = useSuspenseQuery({
    queryKey: ["characterDetail", id],
    queryFn: () => fetchCharacterDetail(id),
  });

  const { data: likedCharacters } = useSuspenseQuery({
    queryKey: ["likedCharactersIds"],
    queryFn: () => getLikes(),
  });

  const houseColor = getHouseColor(data.attributes.house);
  const isLiked = likedCharacters.includes(id);

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        title: data.attributes.name,
        headerTitleStyle: { color: houseColor },
        headerTintColor: houseColor,
      });
    }
  }, [data, navigation, houseColor]);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <Container style={styles.container}>
        <Text>Nie znaleziono postaci</Text>
        <Link href="/">Powrót</Link>
      </Container>
    );
  }

  return (
    <ParallaxScrollView
      minHeight
      headerImage={
        <View style={{ position: "relative" }}>
          <Image
            source={
              data.attributes.image ||
              require("@/assets/images/placeholder.png")
            }
            style={styles.characterImage}
            accessibilityLabel={`Image of ${data.attributes.name}`}
            contentFit="cover"
            contentPosition={"center"}
          />
          <LikeButton style={styles.likeButton} id={id} isLiked={isLiked} />
        </View>
      }
      headerHeight={300}
      style={{ padding: 0 }}
    >
      <CharacterContent data={data.attributes} houseColor={houseColor} />
    </ParallaxScrollView>
  );
}

function CharacterContent({
  data,
  houseColor,
}: {
  data: Character["attributes"];
  houseColor: ColorValue | null;
}) {
  const houseImage = data.house
    ? houseImages[data.house.toLowerCase() as keyof typeof houseImages]
    : null;
  return (
    <View style={styles.characterInfo}>
      <View style={styles.nameContainer}>
        <Text style={styles.characterName} numberOfLines={2}>
          {data.name}
        </Text>
        {houseImage && <Image source={houseImage} style={styles.houseImage} />}
      </View>

      {Object.entries(data).map(([key, value]) => {
        if (["slug", "name", "image", "wiki"].includes(key)) {
          return null;
        }

        if (
          value &&
          (typeof value === "string" ||
            (Array.isArray(value) && value.length > 0))
        ) {
          return (
            <View key={key} style={styles.characterDetailItem}>
              <Text>
                <Text style={styles.characterDetailLabel}>
                  {key.replace("_", " ")}:{" "}
                </Text>
                {!Array.isArray(value) && (
                  <Text
                    style={[
                      styles.characterDetailValue,
                      key === "house" && houseColor && { color: houseColor },
                    ]}
                  >
                    {value}
                  </Text>
                )}
              </Text>
              {Array.isArray(value) && (
                <View style={styles.characterDetailList}>
                  {value.map((item, index) => (
                    <Text key={index} style={styles.characterDetailListItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          );
        }
        return null;
      })}
      <ExternalLink href={data.wiki}>
        <Text type="link" style={houseColor && { color: houseColor }}>
          Link to wiki
        </Text>
      </ExternalLink>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  characterName: {
    fontFamily: "MagicSchoolOne",
    fontSize: 45,
    lineHeight: 50,
    textAlign: "center",
  },
  houseImage: {
    width: 55,
    aspectRatio: 1,
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
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "white",
    borderRadius: 100,
    padding: 10,
    ...Shadows.shadowBase,
  },
  characterDetailItem: {
    marginBottom: 16,
  },
  characterDetailLabel: {
    fontSize: 16,
    fontWeight: "bold",
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
