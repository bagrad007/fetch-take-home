import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease-in-out",
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export default theme;
