import {
  Box,
  Button,
  Container,
  Grid,
  Modal,
  Typography,
  Paper,
  Divider,
  Alert,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Dog, fetchBreeds, fetchDogs, matchDog, searchDogs } from "../api/dogs";
import { fetchLocations, Location } from "../api/locations";
import BreedFilter from "../components/BreedFilter";
import DogCard from "../components/DogCard";
import SortControls from "../components/SortControls";
import { RestartAlt, Pets } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { logout } = useAuth();
  const navigate = useNavigate();

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initBreeds = async () => {
      try {
        const breeds = await fetchBreeds();
        setBreeds(breeds);
      } catch (error) {
        console.error("Failed to fetch breeds:", error);
        setError("Failed to load breeds. Please try again.");
      }
    };
    initBreeds();
  }, []);

  useEffect(() => {
    loadDogs();
  }, [selectedBreeds, sortField, sortDirection]);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const handleReset = () => {
    setSelectedBreeds([]);
    setSortField("breed");
    setSortDirection("asc");
    loadDogs();
  };

  const getLocation = (zip: string) => {
    if (!zip) return "";
    const location = locations.find((loc) => loc?.zip_code === zip);
    return location ? `${location.city}, ${location.state}` : "";
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

  const hasActiveFilters = sortField !== "breed" || selectedBreeds.length > 0;

  const loadDogs = async (cursor?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = {
        breeds: selectedBreeds,
        sort: `${sortField}:${sortDirection}`,
        size: 25,
        ...(cursor && { from: cursor }),
      };
      const searchResult = await searchDogs(searchParams);
      const dogData = await fetchDogs(searchResult.resultIds);

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
      setError("Failed to load dogs. Please try again.");
      console.error("Failed to load dogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const DogCardSkeleton = () => (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" sx={{ mt: 1 }} />
      <Skeleton variant="text" width="60%" />
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3,
            mb: 3,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "medium" }}>
              Dog Search
            </Typography>
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="primary"
              size={isMobile ? "medium" : "large"}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Fade>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => loadDogs()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Fade in timeout={1000}>
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 1 : 2, // Reduced padding for desktop too
            mb: 3,
            position: "sticky",
            top: 16,
            zIndex: 1100,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? 1 : 3, // Reduced gap for desktop
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
            }}
          >
            {/* Combined Filters and Sort Section */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flex: 1,
                width: isMobile ? "100%" : "auto",
              }}
            >
              {/* Breed Filter */}
              <Box sx={{ minWidth: isMobile ? "120px" : "200px" }}>
                <BreedFilter
                  breeds={breeds}
                  selectedBreeds={selectedBreeds}
                  onSelect={setSelectedBreeds}
                />
              </Box>

              {/* Sort Controls */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SortControls
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={(field, dir) => {
                    setSortField(field);
                    setSortDirection(dir);
                  }}
                />
              </Box>

              {/* Reset Button */}
              {hasActiveFilters && (
                <Tooltip title="Clear all filters and sorting">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleReset}
                    startIcon={<RestartAlt />}
                    sx={{ ml: 1 }}
                  >
                    Reset
                  </Button>
                </Tooltip>
              )}
            </Box>

            {/* Favorites Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                ml: isMobile ? 0 : "auto", // Push to right on desktop
              }}
            >
              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                sx={{ color: "primary.main" }}
              >
                {favorites.length} Favorites
              </Typography>
              <Tooltip
                title={
                  favorites.length === 0
                    ? "Add some favorites first!"
                    : "Find your perfect match"
                }
              >
                <span>
                  <Button
                    onClick={handleMatch}
                    disabled={favorites.length === 0}
                    variant="contained"
                    size="small"
                  >
                    Find Match
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Fade>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            disabled={!prevCursor || isLoading}
            onClick={() => loadDogs(prevCursor)}
            variant="contained"
            size={isMobile ? "medium" : "large"}
          >
            Previous Page
          </Button>
          <Typography variant="h6">Total Results: {totalDogs}</Typography>
          <Button
            disabled={!nextCursor || isLoading}
            onClick={() => loadDogs(nextCursor)}
            variant="contained"
            size={isMobile ? "medium" : "large"}
          >
            Next Page
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 10 }}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <DogCardSkeleton />
            </Grid>
          ))
        ) : dogs.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Pets sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No dogs found
              </Typography>
              <Typography color="text.secondary">
                Try adjusting your filters or search criteria
              </Typography>
            </Paper>
          </Grid>
        ) : (
          dogs.map((dog) => (
            <Grid item key={dog.id} xs={12} sm={6} md={4}>
              <Fade in timeout={1200}>
                <Box>
                  <DogCard
                    dog={dog}
                    isFavorite={favorites.includes(dog.id)}
                    onFavoriteToggle={handleFavorite}
                    location={getLocation(dog.zip_code)}
                  />
                </Box>
              </Fade>
            </Grid>
          ))
        )}
      </Grid>

      <Modal
        open={!!matchedDog}
        onClose={() => setMatchedDog(null)}
        closeAfterTransition
      >
        <Fade in={!!matchedDog}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: isMobile ? 2 : 4,
              maxWidth: 600,
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: 2,
            }}
          >
            {matchedDog && (
              <>
                <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
                  🎉 Your Perfect Match! 🎉
                </Typography>
                <DogCard
                  dog={matchedDog}
                  isFavorite={favorites.includes(matchedDog.id)}
                  onFavoriteToggle={handleFavorite}
                  location={getLocation(matchedDog.zip_code)}
                />
              </>
            )}
          </Paper>
        </Fade>
      </Modal>
    </Container>
  );
};

export default SearchPage;
