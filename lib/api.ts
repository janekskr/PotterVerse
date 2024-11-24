import axios from 'axios';
import { ApiResponse, ApiType, Character, FilterQuery } from './types';
import * as SecureStore from "expo-secure-store"

const API_URL = "https://api.potterdb.com/v1";

export const api = axios.create({
  baseURL: API_URL,
});

export const fetchFromApi = async <T>(type: ApiType, page: number, pageSize: number, filterQuery: FilterQuery | undefined) => {
  try {
    const { data } = await api.get<ApiResponse<T>>(`/${type}`, {
      params: {
        'page[number]': page,
        'page[size]': pageSize,
        ...filterQuery,
      },
    });

    return {
      data: data.data,
      pagination: data.meta.pagination,
    };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};


export const fetchCharacterDetail = async (id: string): Promise<Character> => {
  try {
    const { data } = await api.get<{ data: Character }>(`/characters/${id}`);
    if (!data) {
      throw new Error('No character data received');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

// likes

export const toggleLikeCharacter = async (characterId: string): Promise<string[]> => {
  const likedCharacters = await SecureStore.getItemAsync("likedCharactersIds");
  let likedArray = likedCharacters ? JSON.parse(likedCharacters) : [];

  if (likedArray.includes(characterId)) {
    likedArray = likedArray.filter((id: string) => id !== characterId);
  } else {
    likedArray.push(characterId);
  }

  await SecureStore.setItemAsync("likedCharactersIds", JSON.stringify(likedArray));
  return likedArray;
};

export const getLikes = async (): Promise<Character["id"][]> => {
  const likesId = await SecureStore.getItemAsync("likedCharactersIds");
  return likesId ? JSON.parse(likesId) : [];
}

export const fetchLikedCharacters = async (): Promise<Character[]> => {
  const likedCharacters = await getLikes();
  const characters = await Promise.all(
    likedCharacters.map((id: string) => fetchCharacterDetail(id))
  );
  return characters;
};

// searches

export const loadPreviousSearches = async (): Promise<string[]> => {
  const searches = await SecureStore.getItemAsync('previousSearches');
  return searches ? JSON.parse(searches) : []
};

export const savePreviousSearch = async (query: string, previousSearches: string[]) => {
  const updatedSearches = [
    query,
    ...previousSearches.filter((s) => s !== query),
  ];
  await SecureStore.setItemAsync('previousSearches', JSON.stringify(updatedSearches));
  return updatedSearches
};