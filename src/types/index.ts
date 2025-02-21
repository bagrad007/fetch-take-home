export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface DogSearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

export interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string | undefined;
  prev?: string | undefined;
}

export type FavoriteDog = Pick<Dog, 'id' | 'name' | 'breed'>;

export interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onFavoriteToggle: (dogId: string) => void;
  location?: string;
}

export interface BreedFilterProps {
  breeds: string[];
  selectedBreeds: string[];
  onSelect: (breeds: string[]) => void;
}

export interface SortControlsProps {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
}

export interface LoginFormProps {
  onSubmit: (name: string, email: string) => void;
}
