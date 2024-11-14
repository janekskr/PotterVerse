import React, { useCallback } from "react";
import { Image, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  Container,
  ParallaxScrollView,
  ScrollableContainer,
  Text,
  View,
} from "@/components/ui";
import { useCharacters } from "@/hooks/useCharacters";
import { Character } from "@/lib/types";
import { Link } from "expo-router";

const PAGE_SIZE = 100;
const PLACEHOLDER_IMAGE = "https://avatarfiles.alphacoders.com/375/375208.png";

export default function HomeScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCharacters(PAGE_SIZE);

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
      <Link href={{
        pathname: "/character/[id]",
        params: {id: item.id}
      }} asChild>
        <Pressable>
          <View style={styles.characterCard}>
            <Image
              source={{ uri: item.attributes.image || PLACEHOLDER_IMAGE }}
              style={styles.characterImage}
              accessibilityLabel={`Image of ${item.attributes.name}`}
            />
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{item.attributes.name}</Text>
              {item.attributes.house && (
                <Text style={styles.characterHouse}>
                  House: {item.attributes.house}
                </Text>
              )}
              {item.attributes.species && (
                <Text style={styles.characterSpecies}>
                  Species: {item.attributes.species}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      </Link>
    ),
    []
  );

  const keyExtractor = useCallback((item: Character) => item.id, []);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListFooterComponent = useCallback(
    () =>
      isFetchingNextPage ? (
        <ActivityIndicator style={{ marginVertical: 16 }} />
      ) : null,
    [isFetchingNextPage]
  );

  if (isLoading) {
    return (
      <Container style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Error: {error?.message}</Text>
      </Container>
    );
  }

  return (
    <FlashList
      data={data.pages[0].data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={PAGE_SIZE}
      onEndReached={() => console.log("end reached")}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooterComponent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 8,
  },
  characterCard: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  characterInfo: {
    padding: 12,
  },
  characterName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  characterHouse: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  characterSpecies: {
    fontSize: 14,
    color: "#666",
  },
});