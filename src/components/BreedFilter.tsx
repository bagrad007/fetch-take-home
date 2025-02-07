import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface BreedFilterProps {
  breeds: string[];
  selectedBreeds: string[];
  onSelect: (selected: string[]) => void;
}

const BreedFilter = ({
  breeds,
  selectedBreeds,
  onSelect,
}: BreedFilterProps) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    onSelect(event.target.value as string[]);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Filter by Breed</InputLabel>
      <Select
        multiple
        value={selectedBreeds}
        onChange={handleChange}
        label="Filter by Breed"
      >
        {breeds.map((breed) => (
          <MenuItem key={breed} value={breed}>
            {breed}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BreedFilter;
