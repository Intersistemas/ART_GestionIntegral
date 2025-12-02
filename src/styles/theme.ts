// src/styles/themes.ts
import { createTheme } from '@mui/material/styles';

// Valores por defecto para evitar diferencias entre servidor y cliente
// Estos valores deben coincidir con los valores en globals.css para consistencia
const naranjaClaro = '#ffaf4c';
const naranja = '#E4840C';
const naranjaOscuro = '#b66400';

const verdeOscuro = '#45661f';
const verdeClaro = '#92bd68';
const verdeClaroClaro = '#d7e9c6';
const verde = '#648C34';

const gris = '#808080';
const grisOscuro = '#474747';
const blanco = 'white';

const font = 'Outfit, sans-serif';

// Valores que coinciden con globals.css para evitar diferencias
const fontSizeMenu = '1.6rem'; // Coincide con --font-size-sidebar en globals.css
const fontWeightMenu = '700'; // Coincide con --font-weight-sidebar en globals.css
const colorMenu = 'white'; // Coincide con --color-menu en globals.css
const hoverColorMenu = '#414141'; // Coincide con --hover-color-menu en globals.css

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

    MuiList: {
      styleOverrides: {
        root: {
          // Estilos por defecto, pero permitir que el Sidebar los sobrescriba
          padding: '8px 0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          // Estilos por defecto, pero permitir que el Sidebar los sobrescriba
          paddingTop: '4px',
          paddingBottom: '4px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: hoverColorMenu,
          },
          // Estilos por defecto, pero permitir que el Sidebar los sobrescriba
          paddingLeft: '16px',
          paddingRight: '16px',
        },
      },
    },
  },
});

export default theme;