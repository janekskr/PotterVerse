export interface Character {
    id: string;
    type: string;
    attributes: {
      slug: string;
      alias_names: string[];
      animagus: string | null;
      blood_status: string | null;
      boggart: string | null;
      born: string | null;
      died: string | null;
      eye_color: string | null;
      family_members: string[];
      gender: string | null;
      hair_color: string | null;
      height: string | null;
      house: string | null;
      image: string | null;
      jobs: string[];
      marital_status: string | null;
      name: string;
      nationality: string | null;
      patronus: string | null;
      romances: string[];
      skin_color: string | null;
      species: string | null;
      titles: string[];
      wands: string[];
      weight: string | null;
      wiki: string;
    };
    links: {
      self: string;
    };
  }

export type House = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';

export type Pagination = {
  current: number;
  last: number;
  next: number | null;
}

export type ApiType = 'characters' | 'movies' | 'potions' | 'spells';

export interface ApiResponse<T> {
  data: T[];
  meta: {
    pagination: Pagination;
  };
}

export interface CharactersResponse {
  data: Character[];
  pagination: Pagination;
}

export type FilterQuery = { [key: string]: string | undefined }