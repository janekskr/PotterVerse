import React from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { Container, Text, View } from '@/components/ui';
import * as SecureStore from 'expo-secure-store';
import { fetchCharacterDetail } from '@/lib/api';
import { Character } from '@/lib/types';
import CharacterCard from '@/components/CharacterCard';
import { Loader } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const getLikedCharacterIds = async (): Promise<string[]> => {
  const likedCharacters = await SecureStore.getItemAsync('likedCharacters');
  return likedCharacters ? JSON.parse(likedCharacters) : [];
};

const fetchLikedCharacters = async (): Promise<Character[]> => {
  const likedCharacters = await getLikedCharacterIds();
  const characters = await Promise.all(likedCharacters.map(id => fetchCharacterDetail(id)));
  return characters;
};

export default function LikesScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['likedCharacters'],
    queryFn: fetchLikedCharacters,
  });

  const renderItem: ListRenderItem<Character> = ({ item }) => (
    <CharacterCard character={item} />
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <Container style={{}}>
        <Text style={styles.errorText}>Error loading liked characters</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Text style={styles.title}>Liked Characters</Text>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No liked characters yet.</Text>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
    color: 'red',
  },
});