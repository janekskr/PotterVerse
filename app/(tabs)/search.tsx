import React, { useState, useEffect } from 'react'
import { StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable } from 'react-native'
import { View, Text } from '@/components/ui'
import { Ionicons } from '@expo/vector-icons'
import { useCharacters } from '@/hooks/useCharacters'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';

const filterPredicates = [
  'eq', 'cont', 'start', 'end', 'gt', 'lt', 'gteq', 'lteq', 'present', 'blank', 'null', 'not_null'
]

const filterFields = ['name', 'house', 'patronus', 'species', 'blood_status', 'role']

async function save(key:string, value:string) {
    await SecureStore.setItemAsync(key, value);
}


export default function SearchScreen() {

  const [searchQuery, setSearchQuery] = useState('')
  const [field, setField] = useState('name')
  const [predicate, setPredicate] = useState('cont')
  const [filterQuery, setFilterQuery] = useState('')
  const [previousSearches, setPreviousSearches] = useState<string[]>([])

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useCharacters(20, filterQuery)

  useEffect(() => {
    loadPreviousSearches()
  }, [])

  const loadPreviousSearches = async () => {
    try {
      const searches = await SecureStore.getItemAsync('previousSearches')
      if (searches) {
        setPreviousSearches(JSON.parse(searches))
      }
    } catch (e) {
      console.error('Failed to load previous searches', e)
    }
  }

  const savePreviousSearch = async (query: string) => {
    try {
      const updatedSearches = [query, ...previousSearches.filter(s => s !== query).slice(0, 9)]
      await save('previousSearches', JSON.stringify(updatedSearches))
      setPreviousSearches(updatedSearches)
    } catch (e) {
      console.error('Failed to save search', e)
    }
  }

  const handleSearch = async () => {
    const query = `filter[${field}_${predicate}]=${searchQuery}`
    setFilterQuery(query)
    await savePreviousSearch(searchQuery)
    await refetch()
    router.navigate("/(tabs)")
  }

  const handlePreviousSearch = (query: string) => {
    setSearchQuery(query)
    handleSearch()
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#6200ee" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {filterFields.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, field === f && styles.selectedChip]}
            onPress={() => setField(f)}
          >
            <Text style={[styles.chipText, field === f && styles.selectedChipText]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {filterPredicates.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.chip, predicate === p && styles.selectedChip]}
            onPress={() => setPredicate(p)}
          >
            <Text style={[styles.chipText, predicate === p && styles.selectedChipText]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Pressable onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>

      <Text style={styles.previousSearchesTitle}>Previous Searches</Text>
      <FlatList
        data={previousSearches}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.previousSearchItem}
            onPress={() => handlePreviousSearch(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
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
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#6200ee',
  },
  chipText: {
    color: 'black',
  },
  selectedChipText: {
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'MagicSchoolOne',
    fontSize: 24,
  },
  previousSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  previousSearchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
})