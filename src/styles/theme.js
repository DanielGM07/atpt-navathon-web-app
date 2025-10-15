import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A5F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4DB6E2',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#7BDCB5',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E3A5F',
      secondary: '#4DB6E2',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    body1: { color: '#1E3A5F' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '8px 20px',
        },
      },
    },
  },
})

export default theme
