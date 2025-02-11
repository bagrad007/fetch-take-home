import {
  Pets,
  RestartAlt,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Divider,
  Fade,
  Grid,
  Modal,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dog, fetchBreeds, fetchDogs, matchDog, searchDogs } from "../api/dogs";
import { fetchLocations, Location } from "../api/locations";
import BreedFilter from "../components/BreedFilter";
import DogCard from "../components/DogCard";
import SortControls from "../components/SortControls";
import { useAuth } from "../contexts/AuthContext";

type FavoriteDog = {
  id: string;
  name: string;
  breed: string;
};

const SearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortField, setSortField] = useState("breed");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteDogs, setFavoriteDogs] = useState<FavoriteDog[]>([]);
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

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const getLocation = (zip: string) => {
    if (!zip) return "";
    const location = locations.find((loc) => loc?.zip_code === zip);
    return location ? `${location.city}` : "";
  };

  const handleFavorite = async (dogId: string) => {
    if (favorites.includes(dogId)) {
      setFavorites((prev) => prev.filter((id) => id !== dogId));
      setFavoriteDogs((prev) => prev.filter((dog) => dog.id !== dogId));
    } else {
      setFavorites((prev) => [...prev, dogId]);
      const [dogData] = await fetchDogs([dogId]);
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

      <Box
        sx={{
          position: "sticky",
          top: 16,
          zIndex: 1200,
          mb: 3,
        }}
      >
        <Collapse in={favorites.length > 0}>
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              display: "flex",
              gap: 2,
              overflowX: "auto",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                pl: 1,
                whiteSpace: "nowrap",
                color: "primary.main",
                fontWeight: "medium",
              }}
            >
              Favorites:
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "nowrap",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: 3,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: 3,
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              {favoriteDogs.map((dog) => (
                <Chip
                  key={dog.id}
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="body2">{dog.name}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        ({dog.breed})
                      </Typography>
                    </Box>
                  }
                  onDelete={() => handleFavorite(dog.id)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    minWidth: "fit-content",
                    "& .MuiChip-label": {
                      whiteSpace: "nowrap",
                    },
                  }}
                />
              ))}
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={handleMatch}
              sx={{
                ml: "auto",
                whiteSpace: "nowrap",
              }}
              startIcon={<Pets />}
            >
              Find Match
            </Button>
          </Paper>
        </Collapse>
      </Box>
      <Fade in timeout={1000}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            position: "relative",
          }}
        >
          {/* Left side - Breed Filter that stretches but stops before sort controls */}
          <Box
            sx={{
              width: "calc(100% - 250px)", // Reserve exact space for sort controls
              maxWidth: "calc(100% - 250px)", // Ensure it doesn't grow beyond this
            }}
          >
            <BreedFilter
              breeds={breeds}
              selectedBreeds={selectedBreeds}
              onSelect={setSelectedBreeds}
            />
          </Box>

          {/* Right side - Sort Controls */}
          <Box
            sx={{
              width: "240px", // Fixed width for sort controls
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <SortControls
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={(field, dir) => {
                setSortField(field);
                setSortDirection(dir);
              }}
            />
          </Box>
        </Box>
      </Fade>

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
            onClick={async () => {
              await loadDogs(prevCursor);
              navigate(location.pathname + location.search, {
                replace: true,
                state: { scrollToTop: true },
              });
            }}
            variant="contained"
            size={isMobile ? "medium" : "large"}
          >
            Previous Page
          </Button>

          <Button
            disabled={!nextCursor || isLoading}
            onClick={async () => {
              await loadDogs(nextCursor);
              navigate(location.pathname + location.search, {
                replace: true,
                state: { scrollToTop: true },
              });
            }}
            variant="contained"
            size={isMobile ? "medium" : "large"}
          >
            Next Page
          </Button>
        </Box>
      </Paper>

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
