import { Box, Button, Container, Grid, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dog, fetchBreeds, fetchDogs, matchDog, searchDogs } from "../api/dogs";
import { fetchLocations, Location } from "../api/locations";
import BreedFilter from "../components/BreedFilter";
import DogCard from "../components/DogCard";
import SortControls from "../components/SortControls";
import { useAuth } from "../contexts/AuthContext";
import { RestartAlt } from "@mui/icons-material";

const SearchPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortField, setSortField] = useState("breed");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [totalDogs, setTotalDogs] = useState(0);
  const [nextCursor, setNextCursor] = useState<string>();
  const [prevCursor, setPrevCursor] = useState<string>();
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const initBreeds = async () => {
      try {
        const breeds = await fetchBreeds();
        setBreeds(breeds);
      } catch (error) {
        console.error("Failed to fetch breeds:", error);
      }
    };
    initBreeds();
  }, []);

  const loadDogs = async (cursor?: string) => {
    try {
      const searchParams = {
        breeds: selectedBreeds,
        sort: `${sortField}:${sortDirection}`,
        size: 25,
        ...(cursor && { from: cursor }),
      };
      const searchResult = await searchDogs(searchParams);
      const dogData = await fetchDogs(searchResult.resultIds);

      // Filter out invalid dogs (null/undefined)
      const validDogs = dogData.filter(
        (dog): dog is Dog => dog !== null && dog !== undefined,
      );

      setDogs(validDogs);
      setFilteredDogs(validDogs);
      setTotalDogs(searchResult.total);
      setNextCursor(searchResult.next);
      setPrevCursor(searchResult.prev);

      const zipCodes = validDogs.map((dog) => dog.zip_code);
      const locationData = await fetchLocations(zipCodes);

      const validLocations = locationData.filter(
        (loc): loc is Location => loc !== null && loc !== undefined,
      );
      setLocations(validLocations);
    } catch (error) {
      console.error("Failed to load dogs:", error);
    }
  };
  useEffect(() => {
    loadDogs();
  }, [selectedBreeds, sortField, sortDirection]);

  const handleLogout = async () => {
    try {
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleFavorite = (dogId: string) => {
    setFavorites((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId],
    );
  };

  const handleMatch = async () => {
    if (favorites.length === 0) return;
    try {
      const matchId = await matchDog(favorites);
      const [matched] = await fetchDogs([matchId]);
      setMatchedDog(matched);
    } catch (error) {
      console.error("Failed to generate match:", error);
    }
  };

  const handleReset = () => {
    setSelectedBreeds([]);
    setSortField("breed");
    setSortDirection("asc");
    loadDogs();
  };

  const hasActiveFilters = sortField !== "breed" || selectedBreeds.length > 0;

  const getLocation = (zip: string) => {
    if (!zip) return "";
    const location = locations.find((loc) => loc?.zip_code === zip);
    return location ? `${location.city}, ${location.state}` : "";
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 4,
        }}
      >
        <Typography variant="h4">Dog Search</Typography>
        <Button onClick={handleLogout} variant="outlined">
          Logout
        </Button>
      </Box>

      <BreedFilter
        breeds={breeds}
        selectedBreeds={selectedBreeds}
        onSelect={setSelectedBreeds}
      />
      <SortControls
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={(field, dir) => {
          setSortField(field);
          setSortDirection(dir);
        }}
      />

      {hasActiveFilters && (
        <Button
          variant="outlined"
          startIcon={<RestartAlt />}
          onClick={handleReset}
          sx={{ height: "fit-content" }}
        >
          Reset Search
        </Button>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Button
          disabled={!prevCursor}
          onClick={() => loadDogs(prevCursor)}
          variant="contained"
        >
          Previous
        </Button>
        <Typography>Total results: {totalDogs}</Typography>
        <Button
          disabled={!nextCursor}
          onClick={() => loadDogs(nextCursor)}
          variant="contained"
        >
          Next
        </Button>
      </Box>

      <Grid container spacing={3}>
        {dogs.map((dog) => (
          <Grid item key={dog.id} xs={12} sm={6} md={4}>
            <DogCard
              dog={dog}
              isFavorite={favorites.includes(dog.id)}
              onFavoriteToggle={handleFavorite}
              location={getLocation(dog.zip_code)}
            />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <Typography variant="h6">Favorites: {favorites.length}</Typography>
        <Button
          onClick={handleMatch}
          disabled={favorites.length === 0}
          variant="contained"
        >
          Generate Match
        </Button>
      </Box>

      <Modal open={!!matchedDog} onClose={() => setMatchedDog(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
          }}
        >
          {matchedDog && (
            <>
              <Typography variant="h5">Your Perfect Match!</Typography>
              <DogCard
                dog={matchedDog}
                isFavorite={favorites.includes(matchedDog.id)}
                onFavoriteToggle={handleFavorite}
                location={getLocation(matchedDog.zip_code)}
              />
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default SearchPage;
