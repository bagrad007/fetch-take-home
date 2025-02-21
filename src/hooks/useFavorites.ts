import { useState, useCallback } from 'react';
import { dogsApi } from '../api';
import type { Dog, FavoriteDog } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteDogs, setFavoriteDogs] = useState<FavoriteDog[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  const handleFavorite = useCallback(
    async (dogId: string) => {
      if (favorites.includes(dogId)) {
        setFavorites((prev) => prev.filter((id) => id !== dogId));
        setFavoriteDogs((prev) => prev.filter((dog) => dog.id !== dogId));
      } else {
        setFavorites((prev) => [...prev, dogId]);
        const [dogData] = await dogsApi.fetchDogs([dogId]);
        if (dogData) {
          setFavoriteDogs((prev) => [
            ...prev,
            {
              id: dogData.id,
              name: dogData.name,
              breed: dogData.breed,
            },
          ]);
        }
      }
    },
    [favorites],
  );

  const handleMatch = useCallback(async () => {
    if (favorites.length === 0) return;
    try {
      const matchId = await dogsApi.matchDog(favorites);
      const [matched] = await dogsApi.fetchDogs([matchId]);
      setMatchedDog(matched);
    } catch (error) {
      console.error('Failed to generate match:', error);
    }
  }, [favorites]);

  return {
    favorites,
    favoriteDogs,
    matchedDog,
    handleFavorite,
    handleMatch,
    setMatchedDog,
  };
};
