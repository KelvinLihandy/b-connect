import { createTheme } from "@mui/material/styles";

const brand = {
  50: "#eef4fb",
  100: "#d8e7f6",
  200: "#b1d0ed",
  300: "#84b2e0",
  400: "#5691d2",
  500: "#2e71c2",
  600: "#2E5077",
  700: "#25425f",
  800: "#1d344a",
  900: "#132233",
};

export const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand[600],
      dark: brand[700],
      light: brand[400],
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#217A9D",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: ["Poppins", "Inter", "Archivo", "system-ui", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 20,
          fontWeight: 600,
        },
      },
    },
  },
});

export default muiTheme;
