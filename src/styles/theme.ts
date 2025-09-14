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

const getCssVariable = (name: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  const root = getComputedStyle(document.documentElement);
  return root.getPropertyValue(name).trim();
};

const commonOptions: ThemeOptions = {
  palette: {
    primary: {
      main: getCssVariable('--naranja') || '#E4840C',
    },
    secondary: {
      main: getCssVariable('--verdeOscuro') || '#496726',
    },
    verde: getCssVariable('--verde') || '#648C34',
    verdeClaro: getCssVariable('--verdeClaro') || '#7FB142',
    verdeOscuro: getCssVariable('--verdeOscuro') || '#496726',
    naranja: getCssVariable('--naranja') || '#E4840C',
  },
  typography: {
    fontFamily: getCssVariable('--font') || 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: getCssVariable('--verdeOscuro'),
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: getCssVariable('--blanco'),
          fontFamily: getCssVariable('--font'),
          fontWeight: 700,
          fontSize: '1rem',
          borderBottom: `2px solid ${getCssVariable('--naranja')}`,
        },
        body: {
          fontFamily: getCssVariable('--font'),
          fontSize: '0.9rem',
          color: getCssVariable('--grisOscuro'),
          borderBottom: `1px solid #e0e0e0`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: getCssVariable('--naranja'),
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontFamily: getCssVariable('--font'),
            color: getCssVariable('--grisOscuro'),
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: getCssVariable('--gris'),
            },
            '&:hover fieldset': {
              borderColor: getCssVariable('--verde'),
            },
            '&.Mui-focused fieldset': {
              borderColor: getCssVariable('--verde'),
            },
          },
          '& .MuiInputLabel-root': {
            color: getCssVariable('--gris'),
          },
        },
      },
    },
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