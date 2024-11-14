import axios from 'axios';
import { Character } from './types';

const API_URL = "https://api.potterdb.com/v1";

export const api = axios.create({
  baseURL: API_URL,
});

export type Pagination = {
  current: number;
  last: number;
  next: number | null;
}

interface ApiResponse {
  data: Character[];
  meta: {
    pagination: Pagination
  };
}

export interface CharactersResponse {
  data: Character[];
  pagination: Pagination;
}

export const fetchCharacters = async (page: number, pageSize: number): Promise<CharactersResponse> => {
  const { data } = await api.get<ApiResponse>("/characters", {
    params: {
      'page[number]': page,
      'page[size]': pageSize,
    },
  });

  return {
    data: data.data,
    pagination: data.meta.pagination,
  };
};

export const fetchCharacterDetail = async (id: string): Promise<Character> => {
  if (!id) {
    throw new Error('Character ID is required');
  }

  try {
    const { data } = await api.get<{ data: Character }>(`/characters/${id}`);
    
    if (!data || !data.data) {
      throw new Error('No character data received');
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching character ${id}:`, error.message);
    } else {
      console.error(`Unknown error fetching character ${id}:`, error);
    }
    throw error;
  }
};