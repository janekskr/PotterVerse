// SearchResultPage.tsx
import { useLocalSearchParams } from "expo-router";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Container, Text } from "@/components/ui";
import { CharacterList } from "@/components";
import { StyleSheet } from "react-native";
import { FilterQuery } from "@/lib/types";

const PAGE_SIZE = 50;

export default function SearchResultPage() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { result, ...filters } = params;

  const filterQuery: FilterQuery = {};

  Object.entries(filters).forEach(([key, value]) => {
    filterQuery[`filter[${key.split(' ').join('_')}_match]`] = value;
  });


  filterQuery["filter[name_cont]"] = result;

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
    filterQuery,
  });

  if (!data || data.pages.length === 0) {
    return (
      <Container style={styles.centerContainer}>
        <Text>No results found for "{result}"</Text>
      </Container>
    );
  }

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
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
