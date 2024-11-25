import { useLocalSearchParams } from "expo-router";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Container, Text } from "@/components/ui";
import { CharacterList } from "@/components";
import { StyleSheet } from "react-native";
import { FilterQuery } from "@/lib/types";
import Colors from "@/constants/Colors";

const PAGE_SIZE = 50;



export default function SearchResultPage() {
  const params = useLocalSearchParams<{[key: string]: string}>();
  const { result, ...filters } = params;

  const filterQuery: FilterQuery = {};

  Object.entries(filters).forEach(([key, value]) => {
    filterQuery[`filter[${key.split(' ').join('_')}_matches]`] = value;
  });

  if (result && result !=="[result]") {
    filterQuery["filter[name_cont]"] = result;
  }

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


  const allCharacters = data?.pages.flatMap((page: any) => page.data) || [];

  if (!data || allCharacters.length === 0) { 
    return ( 
      <Container style={styles.centerContainer}> 
        <Text>No results found for <Text style={{color: Colors.primary, fontWeight: "bold"}}>"{result}"</Text></Text>
        {Object.entries(filters).length > 0 && (
          <Text style={styles.filtersText}>
            Filters: 
            {Object.entries(filters).map(([key, value]) => (
              <Text key={key} style={styles.filterItem}>
                {value}
              </Text>
            ))}
          </Text>
        )}
      </Container> 
    ); 
  } 


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
  filtersText: {
    marginRight: 10
  },
  filterItem: {
    color: Colors.primary,
    fontWeight: "bold",
    fontStyle: "italic"
  },
});
