import { createTheme } from '@mui/material/styles';

export const darkRedTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff1744', // Vivid Gaming Red
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d50000', // Deep Crimson Accent
    },
    background: {
      default: '#0a0a0a', // True Black/Dark Gray
      paper: '#141414',   // Elevated Card Surface
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #222222',
        },
      },
    },
  },
});