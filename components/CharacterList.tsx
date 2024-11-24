import { ActivityIndicator, StyleSheet } from "react-native";
import { useCallback } from "react";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { getLikes } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Character } from "@/lib/types";
import CharacterCard from "./CharacterCard";
import { Container, Text } from "./ui";

interface CharacterListProps<T> extends Omit<FlashListProps<T>, "renderItem">{
  data: any[];
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
}

const PAGE_SIZE = 50;

const CharacterList = <T extends Character>({
  data,
  isFetchingNextPage,
  isLoading,
  isError,
  hasNextPage,
  fetchNextPage,
  ...rest
}: CharacterListProps<T>) => {
  const { data: likedCharacters = [] } = useSuspenseQuery({
    queryKey: ["likedCharactersIds"],
    queryFn: () => getLikes(),
  });

  const renderItem = ({ item }: { item: Character }) => (
    <CharacterCard
      character={item}
      isLiked={likedCharacters.includes(item.id)}
    />
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage && fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListFooterComponent = useCallback(
    () =>
      isFetchingNextPage ? (
        <ActivityIndicator style={styles.activityIndicator} />
      ) : null,
    [isFetchingNextPage]
  );

  if (isLoading) {
    return (
      <Container style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container style={styles.centerContainer}>
        <Text type="title">Error 😭</Text>
      </Container>
    );
  }

  return (
    <FlashList
      {...rest}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      estimatedItemSize={PAGE_SIZE}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={styles.listContentContainer}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
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
});

export default CharacterList;
