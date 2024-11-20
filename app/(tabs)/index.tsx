'use client'

import React, { useCallback } from "react"
import { StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Pressable } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { Container, Text, View } from "@/components/ui"
import { useCharacters } from "@/hooks/useCharacters"
import { Character } from "@/lib/types"
import { CharacterCard } from "@/components"
import { Ionicons } from '@expo/vector-icons'
import { router } from "expo-router"

const PAGE_SIZE = 50

export default function HomeScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCharacters(PAGE_SIZE)

  const renderItem = ({ item }: { item: Character }) => <CharacterCard character={item} />

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const ListFooterComponent = useCallback(
    () =>
      isFetchingNextPage ? (
        <ActivityIndicator style={styles.activityIndicator}/>
      ) : null,
    [isFetchingNextPage]
  )

  const handleSearchFocus = () => {
    router.navigate("/(tabs)/search")
  }

  if (isLoading) {
    return (
      <Container style={styles.loadingContainer}>
        <ActivityIndicator size="large"/>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
      </Container>
    )
  }

  return (
    <Container>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters..."
          onFocus={handleSearchFocus}
        />
        <Pressable onPress={handleSearchFocus} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#6200ee" />
        </Pressable>
      </View>
      <View>
          <Text>Ulubione postacie: </Text>
      </View> 
      <FlashList
        data={data.pages.flatMap((page: any) => page.data)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={PAGE_SIZE}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={styles.listContentContainer}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    padding: 5,
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
  errorText: {
    fontFamily: "MagicSchoolOne",
    fontSize: 24,
  },
  listContentContainer: {
    paddingTop: 10,
  },
  activityIndicator: {
    marginVertical: 16,
  },
})