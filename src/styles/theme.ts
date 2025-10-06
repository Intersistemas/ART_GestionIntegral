// src/themes.ts
import { createTheme } from '@mui/material/styles';

// Función para obtener variables CSS de forma segura, con valores de respaldo para SSR
const getCssVariable = (name: string, fallback: string) => {
  if (typeof window !== 'undefined') {
    const root = getComputedStyle(document.documentElement);
    const value = root.getPropertyValue(name).trim();
    return value || fallback;
  }
  return fallback;
};

// Se necesitan valores de respaldo para el SSR
const naranjaClaro = getCssVariable('--naranjaClaro', '#ffaf4c');
const naranja = getCssVariable('--naranja', '#E4840C');
const naranjaOscuro = getCssVariable('--naranjaOscuro', '#b66400');

const verdeOscuro = getCssVariable('--verdeOscuro', '#45661f');
const verdeClaro = getCssVariable('--verdeClaro', '#92bd68');
const verdeClaroClaro = getCssVariable('--verdeClaroClaro', '#f7f7f7');
const verde = getCssVariable('--verde', '#648C34');

const gris = getCssVariable('--gris', '#808080');
const grisOscuro = getCssVariable('--grisOscuro', '#474747');
const blanco = getCssVariable('--blanco', 'white');

const font = getCssVariable('--font', 'Outfit, sans-serif');
const fontSize = "2rem";

const fontSizeMenu = getCssVariable('--font-size-sidebar', '1.5rem');
const fontWeightMenu = getCssVariable('--font-weight-sidebar', '700');
const colorMenu = getCssVariable('--color-menu', 'white');
const hoverColorMenu = getCssVariable('--hover-color-menu', '#414141');

// Tipado para la paleta de colores personalizada
declare module '@mui/material/styles' {
  interface Palette {
    verdeClaroClaro: string;
    verdeClaro: string;
    verde: string;
    verdeOscuro: string;
    naranjaClaro: string;
    naranja: string;
    naranjaOscuro: string;
  }
  interface PaletteOptions {
    verdeClaroClaro: string;
    verdeClaro: string;
    verde: string;
    verdeOscuro: string;
    naranjaClaro: string;
    naranja: string;
    naranjaOscuro: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: naranja,
    },
    secondary: {
      main: verdeOscuro,
    },
    verdeClaroClaro: verdeClaroClaro,
    verdeClaro: verdeClaro,
    verde: verde,
    verdeOscuro: verdeOscuro,
    naranjaClaro: naranjaClaro,
    naranja: naranja,
    naranjaOscuro: naranjaOscuro,
  },
  typography: {
    fontFamily: font,
  },

  //MuiInputBase-root-MuiInput-root

  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          padding: '0px 0px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: verdeOscuro,
            },
            '& .MuiInputBase-input': {
              fontFamily: font,
              color: grisOscuro,
              fontSize: '1.5rem',
              height: '1rem',
              minHeight: 'auto',
            },
            '&:hover fieldset': {
              borderColor: naranjaOscuro,
            },
            '&.Mui-focused fieldset': {
              borderColor: naranja,
            },
          },
           '& .MuiInputLabel-root': {
            color: verdeOscuro,
            fontSize: '1.4rem',
            backgroundColor: blanco,
            padding: '0% 2%',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: naranjaOscuro,
            fontSize: '1.4rem',
          },
          '& .MuiFormHelperText-root': {
            fontSize: '1rem',
            lineHeight: '1',
          },
        },
      },
    },
    
    MuiInputBase: { 
      styleOverrides: {
        root: {
          fontSize: '1.8rem',
        },
      },
    },

    MuiTableHead: { /* Data Table HEADER */
      styleOverrides: {
        root: {
          backgroundColor: verdeOscuro, /* Si en el module.css del DataTable tiene !IMPORTANT, entonces tomará esa definicion que es mas especifica*/
        },
      },
    },
    
    MuiTableCell: { /* Data Table CELL */
      styleOverrides: {
        head: {
          color: blanco,
          fontFamily: font,
          fontWeight: 700,
          fontSize: '2rem',
          borderBottom: `2px solid ${naranja}`,
        },
        body: {
          fontFamily: font,
          fontSize: '1.3rem',
          color: gris,
          borderBottom: `1px solid #e0e0e0`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '0% 3%', //esto afecta a los iconos del Grid Table, los que aparecen en el cell.
          color: naranja,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: verdeOscuro,
            },
            '&:hover fieldset': {
              borderColor: naranjaOscuro,
            },
            '&.Mui-focused fieldset': {
              borderColor: naranja,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiSelect-select': {
          },
          '& .MuiSvgIcon-root': {
            color: naranjaOscuro,
          },
        },
      },
    },
    
    /*MuiPaper-root-MuiPopover-paper-MuiMenu-paper*/

    MuiPaper: {
      styleOverrides: {
        root: {
          '&.MuiPopover-paper': {
            marginTop: '2%',
          }, 
      },
    },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
              color: blanco,
              fontWeight: 'bold',
              backgroundColor: naranja,
               '&:hover': {
                  backgroundColor: naranjaClaro,
                },
            },
            '&:hover': {
              backgroundColor: naranjaClaro,
            },
            fontSize: '1.2rem',
        }, 
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: fontSizeMenu,
          fontWeight: fontWeightMenu,
          color: colorMenu,
        },
      },
    },
    
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: hoverColorMenu,
          },
        },
      },
    },
  },
});

export default theme;