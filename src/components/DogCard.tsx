import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Dog } from "../types";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onFavoriteToggle: (dogId: string) => void;
  location?: string;
}

const DogCard = ({
  dog,
  isFavorite,
  onFavoriteToggle,
  location,
}: DogCardProps) => {
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    "https://via.placeholder.com/200x200?text=No+Image+Available";

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={imageError ? fallbackImage : dog.img}
        alt={dog.name}
        onError={() => setImageError(true)}
        sx={{
          objectFit: "cover",
          bgcolor: "grey.200",
        }}
      />
      <CardContent>
        <Typography variant="h6">{dog.name}</Typography>
        <Typography>Breed: {dog.breed}</Typography>
        <Typography>Age: {dog.age}</Typography>
        {location && <Typography>Location: {location}</Typography>}
        <IconButton
          onClick={() => onFavoriteToggle(dog.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default DogCard;
