import { StyleSheet} from "react-native";
import { Container } from "@/components/ui";
import { CharacterList, HousesCarousel } from "@/components";
import { useApiQuery } from "@/hooks/useApiQuery";

const PAGE_SIZE = 50;
export default function HomeScreen() {
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
  });

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
        ListHeaderComponent={HousesCarousel}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  }
});
