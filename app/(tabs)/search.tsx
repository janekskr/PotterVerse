import React, { useCallback, useMemo, useState, useRef } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { Container, Text, View as ThemedView } from "@/components/ui";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { loadPreviousSearches, savePreviousSearch } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import Shadows from "@/constants/Shadows";
import {CategoryFilters} from "@/components";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function SearchPage() {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const textInputRef = useRef<TextInput>(null);

  const color = useThemeColor({}, "text")
  const queryClient = useQueryClient();

  const previousSearches = useSuspenseQuery({
    queryKey: ["previousSearches"],
    queryFn: () => loadPreviousSearches(),
  });

  const filteredSearches = useMemo(() => {
    if (!search) return previousSearches.data;
    return previousSearches.data.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [previousSearches, search]);

  const handleSearch = async () => {
    if (search.trim() !== "") {
      mutation.mutate();
      
      router.navigate({
        pathname: "/search/[result]",
        params: { result: search, ...selectedFilters },
      });
    }
  };

  const mutation = useMutation({
    mutationFn: () => savePreviousSearch(search, previousSearches.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["previousSearches"] });
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <Link
        href={{
          pathname: "/search/[result]",
          params: { result: item },
        }}
        asChild
      >
        <Pressable>
          <Text style={styles.searchItem}>{item}</Text>
        </Pressable>
      </Link>
    ),
    []
  );

  const ListHeaderComponent = useCallback(
    () => (
      <Text type="subtitle" style={{ marginBottom: 10 }}>
        Recent Searches
      </Text>
    ),
    []
  );

  const handleFilterPress = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[category] === value) {
        delete newFilters[category];
      } else {
        newFilters[category] = value;
      }
      return newFilters;
    });
  };

  return (
    <Container style={{ paddingVertical: 0, paddingHorizontal: 0 }}>
      <ThemedView
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 20,
          paddingVertical: 10,
          ...Shadows.shadowSm,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {isFocus && (
            <Pressable
              onPress={() => {
                setIsFocus(false);
                textInputRef.current?.blur();
              }}
            >
              <Ionicons name="arrow-back" size={24} color={color} />
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              if (isFocus) {
                handleSearch();
                setIsFocus(false);
                textInputRef.current?.blur();
              } else {
                textInputRef.current?.focus();
              }
            }}
          >
            <Ionicons name="search" size={24} color={color} />
          </Pressable>
          <TextInput
            ref={textInputRef}
            value={search}
            placeholder="Search by name"
            style={{ flex: 1, fontSize: 16, color }}
            onFocus={() => setIsFocus(true)}
            onEndEditing={handleSearch}
            returnKeyType="search"
            onBlur={() => setIsFocus(false)}
            onChangeText={(text) => setSearch(text)}
            placeholderTextColor={useColorScheme() === "dark" ? Colors.gray:undefined}
          />
          {isFocus && (
            <Pressable onPress={() => textInputRef.current?.clear()}>
              <Ionicons name="close" size={24} color={color} />
            </Pressable>
          )}
        </View>
      </ThemedView>
      {isFocus ? (
        <FlatList
          data={filteredSearches}
          renderItem={renderItem}
          style={{ paddingHorizontal: 20 }}
          ListHeaderComponent={ListHeaderComponent}
          keyExtractor={(item, index) => `${item}-${index}`}
        />
      ) : (
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ marginVertical: 10, fontSize: 22, fontWeight: "bold" }}>Categories:</Text>
          <CategoryFilters
            selectedFilters={selectedFilters}
            handleFilterPress={handleFilterPress}
          />
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchItem: {
    marginBottom: 25,
    color: Colors.gray,
  },
});
