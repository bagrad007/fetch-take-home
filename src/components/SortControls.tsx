import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDirectionToggle = () => {
    onSortChange(sortField, sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <FormControl
        size="small" // Always small size for compact layout
        sx={{
          minWidth: isMobile ? "100px" : "120px",
          "& .MuiOutlinedInput-root": {
            height: "40px", // Fixed height for consistency
          },
        }}
      >
        <Select
          value={sortField}
          onChange={(e) => onSortChange(e.target.value, sortDirection)}
          displayEmpty
          renderValue={(value) => `Sort: ${value}`}
        >
          <MenuItem value="breed">Breed</MenuItem>
          <MenuItem value="age">Age</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
      </FormControl>

      <Tooltip
        title={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
      >
        <IconButton
          onClick={handleDirectionToggle}
          size="small"
          sx={{
            p: 0.5,
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {sortDirection === "asc" ? (
            <>
              <ArrowUpward fontSize="small" />
            </>
          ) : (
            <>
              <ArrowDownward fontSize="small" />
            </>
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SortControls;
