import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#16A34A',
      dark: '#15803D',
      light: '#DCFCE7'
    },
    secondary: {
      main: '#64748B'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B'
    },
    error: {
      main: '#DC2626'
    },
    warning: {
      main: '#F59E0B'
    },
    success: {
      main: '#16A34A'
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600
  },
  shape: {
    borderRadius: 6
  }
});

export default theme;
