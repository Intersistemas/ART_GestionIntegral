// src/styles/themes.ts
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
      main: verde,
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
          '& .MuiFormHelperText-root': {
            fontSize: '1rem',
            lineHeight: '1',
          },
        },
      },
    },
    
     MuiInputLabel: {
      styleOverrides: {
        root: { //LABEL CUANDO NO TIENE CONTENIDO EL ENTRY
            color: verdeOscuro,
            fontSize: 'smaller',
            fontWeight: "bold",
            //backgroundColor: blanco, lo quito por ahora
            left: '-2px',       
          },
        shrink: {  //SOLO PARA QUE APLIQUE AL LABEL CUANDO ESTA ENCIMA
          fontSize: 'medium',
        },
        },
      },

    MuiInputBase: { 
      styleOverrides: {
        root: {
          fontSize: '1.6rem',
        },
      },
    },

    MuiTableHead: { /* Data Table HEADER */
      styleOverrides: {
        root: {
          backgroundColor: verde, /* Si en el module.css del DataTable tiene !IMPORTANT, entonces tomará esa definicion que es mas especifica*/
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

   MuiTab: {
      styleOverrides: {
        root: {
          '& .Mui-selected': {
            background: naranjaOscuro,
            backgroundColor: naranjaOscuro,
          },
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