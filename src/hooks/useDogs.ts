import { useState, useCallback } from 'react';
import { dogsApi, locationsApi } from '../api';
import type { Dog, Location, DogSearchParams } from '../types';

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
        size: 25,
        from: params.from,
      });

      // The API returns full URL paths as cursors (e.g., "/dogs/search?sort=breed:asc&size=25&from=25")
      // We need to extract just the 'from' value to use as the offset for pagination

      const extractFromValue = (url: string | undefined) => {
        if (!url) return undefined;
        const searchParams = new URLSearchParams(url.split('?')[1]);
        return searchParams.get('from') || undefined;
      };

      setNextCursor(extractFromValue(searchResult.next));
      setPrevCursor(extractFromValue(searchResult.prev));

      if (searchResult.resultIds.length > 0) {
        const dogData = await dogsApi.fetchDogs(searchResult.resultIds);
        const validDogs = dogData.filter(
          (dog): dog is Dog => dog !== null && dog !== undefined,
        );
        setDogs(validDogs);
        setTotalDogs(searchResult.total);

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
      setError('Failed to load dogs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadNextPage = useCallback(
    (currentParams: DogSearchParams) => {
      if (nextCursor) {
        loadDogs({
          ...currentParams,
          from: nextCursor,
        });
      }
    },
    [nextCursor, loadDogs],
  );

  const loadPrevPage = useCallback(
    (currentParams: DogSearchParams) => {
      if (prevCursor) {
        loadDogs({
          ...currentParams,
          from: prevCursor,
        });
      }
    },
    [prevCursor, loadDogs],
  );

  return {
    dogs,
    locations,
    totalDogs,
    nextCursor,
    prevCursor,
    isLoading,
    error,
    loadDogs,
    loadNextPage,
    loadPrevPage,
  };
};
