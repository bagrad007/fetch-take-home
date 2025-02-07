import client from "./client";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export const fetchBreeds = async (): Promise<string[]> => {
  const response = await client.get<string[]>("/dogs/breeds");
  return response.data;
};

export const searchDogs = async (params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}): Promise<DogSearchResponse> => {
  const response = await client.get<DogSearchResponse>("/dogs/search", {
    params,
  });
  return response.data;
};

export const fetchDogs = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await client.post<Dog[]>("/dogs", dogIds);
  return response.data;
};

export const matchDog = async (dogIds: string[]): Promise<string> => {
  const response = await client.post<{ match: string }>("/dogs/match", dogIds);
  return response.data.match;
};
