import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
} from "@mui/material";

interface SortControlsProps {
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}

const SortControls = ({
  sortField,
  sortDirection,
  onSortChange,
}: SortControlsProps) => {
  const handleFieldChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value, sortDirection);
  };

  const handleDirectionChange = (event: SelectChangeEvent) => {
    onSortChange(sortField, event.target.value as "asc" | "desc");
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2, mt: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ gap: 2 }}>Sort By</InputLabel>
        <Select value={sortField} onChange={handleFieldChange} label="Sort by">
          <MenuItem value="breed">Breed</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="age">Age</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Direction</InputLabel>
        <Select
          value={sortDirection}
          onChange={handleDirectionChange}
          label="Direction"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortControls;
