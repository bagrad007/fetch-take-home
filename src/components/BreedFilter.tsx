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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Autocomplete
      multiple
      size="small" // Always small size
      options={breeds}
      value={selectedBreeds}
      onChange={(_, newValue) => onSelect(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Filter breeds..."
          sx={{
            minWidth: isMobile ? "120px" : "200px",
            "& .MuiOutlinedInput-root": {
              height: "40px", // Fixed height for consistency
              paddingTop: "2px",
              paddingBottom: "2px",
            },
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
              maxWidth: "150px",
              "& .MuiChip-label": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        ))
      }
    />
  );
};

export default BreedFilter;
