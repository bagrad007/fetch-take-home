import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Dog } from "../api/dogs";

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
}: DogCardProps) => (
  <Card sx={{ maxWidth: 345, m: 2 }}>
    <CardMedia component="img" height="200" image={dog.img} alt={dog.name} />
    <CardContent>
      <Typography variant="h6">{dog.name}</Typography>
      <Typography>Breed: {dog.breed}</Typography>
      <Typography>Age: {dog.age}</Typography>
      {location && <Typography>Location: {location}</Typography>}
      <IconButton onClick={() => onFavoriteToggle(dog.id)}>
        {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
    </CardContent>
  </Card>
);

export default DogCard;
