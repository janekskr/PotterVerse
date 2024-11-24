import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { Container, Text } from "@/components/ui";
import { fetchLikedCharacters } from "@/lib/api";
import { CharacterList, Loader } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "@/constants/Colors";

export default function LikesScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["likedCharacters"],
    queryFn: fetchLikedCharacters,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isRefetching || isLoading) {
    return <Loader />;
  }

  if (!data || data.length === 0)
    return (
      <Container style={styles.centerContainer}>
        <Text type="title" style={{color: Colors.yellow}}>No liked characters yet.</Text>
      </Container>
    );

  return (
    <Container style={styles.container}>
      <Text type="title" style={styles.title}>
        Liked Characters:
      </Text>
      <CharacterList
        isError={isError}
        data={data}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
});
