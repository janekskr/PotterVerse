import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { loadPreviousSearches } from '@/lib/api';

const categories = ['Houses', 'Characters', 'Spells', 'Potions'];
const filterFields = ['name', 'house', 'patronus', 'species', 'blood_status', 'role'];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPreviousSearches();
  }, []);

  const savePreviousSearch = async (query: string) => {
      const updatedSearches = [
        query,
        ...previousSearches.filter((s) => s !== query).slice(0, 4),
      ];
      await SecureStore.setItemAsync('previousSearches', JSON.stringify(updatedSearches));
      setPreviousSearches(updatedSearches);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() !== '') {
      setIsLoading(true);
      await savePreviousSearch(searchQuery);
      const query = `?filter[${selectedCategory.toLowerCase()}_cont]=${encodeURIComponent(searchQuery)}`;

      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFocusedInput(false);
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, type }: { item: string; type: 'category' | 'search' }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => type === 'category' ? handleCategorySelect(item) : setSearchQuery(item)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {selectedCategory && (
          <Text style={styles.selectedCategory}>{selectedCategory}: </Text>
        )}
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setTimeout(() => setFocusedInput(false), 200)}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#6200ee" />
          ) : (
            <Ionicons name="search" size={24} color="#6200ee" />
          )}
        </TouchableOpacity>
      </View>

      {focusedInput && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredCategories}
            renderItem={({ item }) => renderItem({ item, type: 'category' })}
            keyExtractor={(item) => item}
            ListHeaderComponent={() => (
              <Text style={styles.sectionTitle}>Categories</Text>
            )}
          />
          <FlatList
            data={previousSearches}
            renderItem={({ item }) => renderItem({ item, type: 'search' })}
            keyExtractor={(item, index) => `${item}-${index}`}
            ListHeaderComponent={() => (
              <Text style={styles.sectionTitle}>Previous Searches</Text>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  resultsContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    maxHeight: 300,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedCategory: {
    fontWeight: 'bold',
    marginRight: 5,
  },
});

