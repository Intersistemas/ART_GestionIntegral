import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    verde: string;
    verdeClaro: string;
    verdeOscuro: string;
    naranja: string;
  }
  interface PaletteOptions {
    verde: string;
    verdeClaro: string;
    verdeOscuro: string;
    naranja: string;
  }
}

// Función para obtener variables CSS de forma segura
const getCssVariable = (name: string): string => {
  if (typeof window === 'undefined') {
    return ''; // Devuelve una cadena vacía en el lado del servidor (SSR)
  }
  const root = getComputedStyle(document.documentElement);
  return root.getPropertyValue(name).trim();
};

const commonOptions: ThemeOptions = {
  palette: {
    primary: {
      main: getCssVariable('--verdeOscuro') || '#496726',
    },
    secondary: {
      main: getCssVariable('--naranja') || '#E4840C',
    },
    verde: getCssVariable('--verde') || '#648C34',
    verdeClaro: getCssVariable('--verdeClaro') || '#7FB142',
    verdeOscuro: getCssVariable('--verdeOscuro') || '#496726',
    naranja: getCssVariable('--naranja') || '#E4840C',
  },
  typography: {
    fontFamily: getCssVariable('--fuentePrincipal') || [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiListItemText: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            fontSize: getCssVariable('--font-size-menu') || '1.1rem',
            fontWeight: getCssVariable('--font-weight-menu') || 700,
            color: getCssVariable('--color-menu') || 'white',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: getCssVariable('--hover-color-menu') || '#414141',
          },
        },
      },
    },
  },
};

const theme = createTheme(commonOptions);

export default theme;