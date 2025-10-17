import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme.js';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes.jsx';

// 👉 Importá Provider y tu store
import { Provider } from 'react-redux';
import { store } from './stores/store'; // ajustá la ruta si difiere

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
