import React, { useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Container, Text } from "@/components/ui";
import { CharacterCard, CharacterList } from "@/components";
import { Character } from "@/lib/types";
import { getHouseColor } from "@/lib/utils";
import { houseImages } from "@/constants/data";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { getLikes } from "@/lib/api";
import { useApiQuery } from "@/hooks/useApiQuery";

const PAGE_SIZE = 50;

export default function HousePage() {
  const { houseName } = useLocalSearchParams<{ houseName: string }>();
  const navigation = useNavigation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useApiQuery({
    type: "characters",
    pageSize: PAGE_SIZE,
    filterQuery: {'filter[house_matches]': houseName}
  });

  const houseColor = getHouseColor(houseName);

  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.houseHeader}>
        <Image source={houseImages[houseName]} style={styles.houseImage} />
        <Text style={[styles.houseName, houseColor && { color: houseColor }]}>
          {houseName}
        </Text>
      </View>
    ),
    [houseName, houseColor]
  );

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        headerTintColor: houseColor
      });
    }
  }, [navigation, data, houseColor]);


  const allCharacters = data?.pages.flatMap((page: any) => page.data) || [];

  return (
    <Container style={styles.container}>
      <CharacterList
        data={allCharacters}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isError={isError}
        ListHeaderComponent={ListHeaderComponent}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContentContainer: {
    paddingHorizontal: 20,
  },
  activityIndicator: {
    marginVertical: 16,
  },
  houseHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  houseImage: {
    height: 150,
    aspectRatio: 0.93,
  },
  houseName: {
    textAlign: "center",
    fontFamily: "MagicSchoolOne",
    textTransform: "capitalize",
    fontSize: 40,
    lineHeight: 45,
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});
