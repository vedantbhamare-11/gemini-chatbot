// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // This sets the default theme mode to dark
    primary: {
      main: '#000000', // Black for primary elements
      contrastText: '#ffffff', // White text on primary elements
    },
    secondary: {
      main: '#ffffff', // White for secondary elements
      contrastText: '#000000', // Black text on secondary elements
    },
    background: {
      default: '#ffffff', // White background
      paper: '#f5f5f5', // Slightly off-white for paper components
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#777777', // Dark gray text for less emphasis
    },
    divider: '#000000', // Black dividers
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#333333', // Darker shade on hover
          },
        },
        containedPrimary: {
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#222222',
          },
        },
        containedSecondary: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#dddddd',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#f9f9f9',
          color: '#000000',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000',
            },
            '&:hover fieldset': {
              borderColor: '#333333',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
          '& .MuiInputLabel-outlined': {
            color: '#333333',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: 'none',
          borderBottom: '2px solid #000000',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '2px solid #000000',
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#000000',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#777777',
          '&.Mui-selected': {
            color: '#000000',
          },
        },
      },
    },
  },
});

export default theme;
