import {
  Autocomplete,
  Chip,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface BreedFilterProps {
  breeds: string[];
  selectedBreeds: string[];
  onSelect: (breeds: string[]) => void;
}

const BreedFilter = ({
  breeds,
  selectedBreeds,
  onSelect,
}: BreedFilterProps) => {
  return (
    <Autocomplete
      multiple
      size="small"
      options={breeds}
      value={selectedBreeds}
      onChange={(_, newValue) => onSelect(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Filter breeds..."
          sx={{
            width: "100%",
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            label={option}
            size="small"
            sx={{
              maxWidth: "120px",
              "& .MuiChip-label": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        ))
      }
      sx={{
        width: "100%",
        "& .MuiAutocomplete-inputRoot": {
          flexWrap: "wrap",
          maxHeight: "100px", // Set a max height
          overflowY: "auto", // Make it scrollable
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
            "&:hover": {
              background: "#555",
            },
          },
        },
        "& .MuiAutocomplete-tag": {
          maxWidth: "120px",
          margin: "2px",
        },
      }}
    />
  );
};

export default BreedFilter;
