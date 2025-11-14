// src/utils/ui/queryBuilder/CustomNotToggle.tsx
import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import { NotToggleProps } from 'react-querybuilder';
import { Typography } from '@mui/material';

const CustomNotToggle: React.FC<NotToggleProps> = ({
  checked,
  handleOnChange,
  title,
  className,
}) => {
  // Cuando 'checked' es true, el grupo está en estado NEGADO (NOT) -> Muestra 'NO'
  // Cuando 'checked' es false, el grupo está en estado normal -> Muestra 'SI'
  const content = checked ? 'NO' : 'SI';

  return (
    <ToggleButton
      value="check"
      size="small"
      title={title}
      selected={checked} // Controla el color/estado de selección
      onClick={() => handleOnChange(!checked)}
      className={className}
      // Estilos para asegurar que se vea como un control de filtrado
      sx={{
        textTransform: 'none', // Previene MAYÚSCULAS automáticas
        minWidth: '75px',
        height: '3rem',
        '&.Mui-selected': {
          // Estilo para el estado 'NO' (Negación activa)
          backgroundColor: 'var(--naranjaOscuro)', // Asumiendo que 'warning' es naranja
          color: 'white',
          '&:hover': {
                      backgroundColor: 'var(--naranjaOscuro50)',
                    },
        },
        '&:not(.Mui-selected)': {
          // Estilo para el estado 'SI' (Regla activa)
          backgroundColor: 'var(--naranjaOscuro)', // Asumiendo que 'success' es verde
          color: 'white',
          '&:hover': {
                     backgroundColor: 'var(--naranjaOscuro50)',
                    },
        },
      }}
    >
      <Typography variant="button" component="span" sx={{ marginLeft: '0.3rem', fontWeight: 'bold' }}>
        <span style={{fontSize: "1.2rem"}}>{content}</span> Contiene
      </Typography>
    </ToggleButton>
  );
};

export default CustomNotToggle;