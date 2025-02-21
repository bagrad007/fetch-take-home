import { Pets } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Fade,
  Grid,
  Modal,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dogsApi } from '../api';
import BreedFilter from '../components/BreedFilter';
import DogCard from '../components/DogCard';
import SortControls from '../components/SortControls';
import { useAuth } from '../contexts/AuthContext';
import { useDogs } from '../hooks/useDogs';
import { useFavorites } from '../hooks/useFavorites';

const SearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortField, setSortField] = useState('breed');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const {
    dogs,
    locations,
    nextCursor,
    prevCursor,
    isLoading,
    error,
    loadDogs,
    loadNextPage,
    loadPrevPage,
    totalDogs,
  } = useDogs();

  const {
    favorites,
    favoriteDogs,
    matchedDog,
    handleFavorite,
    handleMatch,
    setMatchedDog,
  } = useFavorites();

  useEffect(() => {
    const initBreeds = async () => {
      try {
        const breeds = await dogsApi.fetchBreeds();
        setBreeds(breeds);
      } catch (error) {
        console.error('Failed to fetch breeds:', error);
      }
    };
    initBreeds();
  }, []);

  useEffect(() => {
    loadDogs({
      breeds: selectedBreeds,
      sort: `${sortField}:${sortDirection}`,
      size: 25,
    });
  }, [selectedBreeds, sortField, sortDirection, loadDogs]);

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  const getLocation = (zip: string) => {
    if (!zip) return '';
    const location = locations.find((loc) => loc?.zip_code === zip);
    return location ? `${location.city}` : '';
  };

  const DogCardSkeleton = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
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
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
              Find and Match With Your Favorite Dogs!
            </Typography>
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="primary"
              size={isMobile ? 'medium' : 'large'}
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
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                loadDogs({
                  breeds: selectedBreeds,
                  sort: `${sortField}:${sortDirection}`,
                  size: 25,
                })
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          position: 'sticky',
          top: 16,
          zIndex: 1200,
          mb: 3,
          pl: 1,
        }}
      >
        <Collapse in={favorites.length > 0}>
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                pl: 1,
                whiteSpace: 'nowrap',
                color: 'primary.main',
              }}
            >
              Favorites:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'nowrap',
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555',
                },
              }}
            >
              {favoriteDogs.map((dog) => (
                <Chip
                  key={dog.id}
                  label={
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Typography variant="body2">{dog.name}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
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
                    minWidth: 'fit-content',
                    '& .MuiChip-label': {
                      whiteSpace: 'nowrap',
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
                width: '90px', // Gives the button a fixed width
                flexShrink: 0, // Prevents the button from shrinking in a flex container
                whiteSpace: 'nowrap', // Ensures the text and icon do not wrap
              }}
            >
              Match <ArrowForwardIcon />
            </Button>
          </Paper>
        </Collapse>
      </Box>

      <Fade in timeout={1000}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            position: 'relative',
            px: { xs: 1, md: 2 },
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0,
          }}
        >
          <Box
            sx={{
              width: isMobile ? '100%' : 'calc(100% - 250px)',
              maxWidth: isMobile ? '100%' : 'calc(100% - 250px)',
            }}
          >
            <BreedFilter
              breeds={breeds}
              selectedBreeds={selectedBreeds}
              onSelect={setSelectedBreeds}
            />
          </Box>

          <Box
            sx={{
              width: isMobile ? '100%' : '240px',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: isMobile ? 'flex-start' : 'flex-end',
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

      <Box sx={{ ml: isMobile ? '26%' : '39%' }}>
        <Typography variant="body1" color="text.secondary">
          Showing {dogs.length} of {totalDogs} dogs
        </Typography>
      </Box>

      {/* Grid for dogs */}

      <Grid container spacing={3} sx={{ mb: 10 }}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <DogCardSkeleton />
            </Grid>
          ))
        ) : dogs.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Pets sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
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

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          bottom: 5,
          margin: 'auto',
          width: '50%',
          padding: '10px',
        }}
      >
        <Button
          disabled={!prevCursor || isLoading}
          onClick={() => {
            loadPrevPage({
              breeds: selectedBreeds,
              sort: `${sortField}:${sortDirection}`,
            });
            navigate('.', { state: { scrollToTop: true } });
          }}
        >
          Previous Page
        </Button>

        <Button
          disabled={!nextCursor || isLoading}
          onClick={() => {
            loadNextPage({
              breeds: selectedBreeds,
              sort: `${sortField}:${sortDirection}`,
            });
            navigate('.', { state: { scrollToTop: true } });
          }}
          size={isMobile ? 'medium' : 'large'}
        >
          Next Page
        </Button>
      </Box>

      <Modal
        open={!!matchedDog}
        onClose={() => setMatchedDog(null)}
        closeAfterTransition
      >
        <Fade in={!!matchedDog}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              p: isMobile ? 2 : 4,
              maxWidth: 600,
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: 2,
            }}
          >
            {matchedDog && (
              <>
                <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
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
