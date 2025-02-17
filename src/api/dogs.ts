import type { Dog, DogSearchParams, DogSearchResponse } from "../types";
import { apiClient, handleApiError } from "./config";

export const dogsApi = {
  async fetchBreeds(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>("/dogs/breeds");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async searchDogs(params: DogSearchParams): Promise<DogSearchResponse> {
    let cloneParams = { ...params };
    let decodeColon = cloneParams.from?.replace("%3A", ":");

    console.log(cloneParams.from?.replace("%3A", ":"));
    try {
      const response = await apiClient.get<DogSearchResponse>("/dogs/search", {
        params: {
          ...params,
          sort: params.sort || "breed:asc",
          breeds: params.breeds?.length ? params.breeds : undefined,
          from: decodeColon || undefined,
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async fetchDogs(dogIds: string[]): Promise<Dog[]> {
    try {
      // API limits to 100 dogs per request
      if (dogIds.length > 100) {
        throw new Error("Cannot fetch more than 100 dogs at once");
      }
      const response = await apiClient.post<Dog[]>("/dogs", dogIds);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async matchDog(dogIds: string[]): Promise<string> {
    try {
      const response = await apiClient.post<{ match: string }>(
        "/dogs/match",
        dogIds,
      );
      return response.data.match;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
