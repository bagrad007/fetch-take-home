import { useState, useCallback } from "react";
import { dogsApi, locationsApi } from "../api";
import type { Dog, Location, DogSearchParams } from "../types";

export const useDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalDogs, setTotalDogs] = useState(0);
  const [nextCursor, setNextCursor] = useState<string>();
  const [prevCursor, setPrevCursor] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDogs = useCallback(async (params: DogSearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResult = await dogsApi.searchDogs({
        ...params,
        from: params.from || undefined,
      });

      // Store cursors
      setNextCursor(searchResult.next);
      setPrevCursor(searchResult.prev);

      if (searchResult.resultIds.length > 0) {
        const dogData = await dogsApi.fetchDogs(searchResult.resultIds);
        const validDogs = dogData.filter(
          (dog): dog is Dog => dog !== null && dog !== undefined,
        );
        setDogs(validDogs);
        setTotalDogs(searchResult.total);

        // Fetch locations
        const zipCodes = validDogs.map((dog) => dog.zip_code);
        const locationData = await locationsApi.fetchLocations(zipCodes);
        setLocations(
          locationData.filter((loc): loc is Location => loc !== null),
        );
      } else {
        setDogs([]);
        setTotalDogs(0);
        setLocations([]);
      }
    } catch (error) {
      setError("Failed to load dogs. Please try again.");
      console.error("Failed to load dogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    dogs,
    locations,
    totalDogs,
    nextCursor,
    prevCursor,
    isLoading,
    error,
    loadDogs,
  };
};
