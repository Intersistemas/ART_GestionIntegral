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
        '&.Mui-selected': {
          // Estilo para el estado 'NO' (Negación activa)
          backgroundColor: 'warning.main', // Asumiendo que 'warning' es naranja
          color: 'white',
        },
        '&:not(.Mui-selected)': {
          // Estilo para el estado 'SI' (Regla activa)
          backgroundColor: 'success.main', // Asumiendo que 'success' es verde
          color: 'white',
        },
      }}
    >
      <Typography variant="caption" component="span" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
        
      </Typography>
      <Typography variant="button" component="span" sx={{ marginLeft: '0.3rem', fontWeight: 'bold' }}>
        {content} Contiene
      </Typography>
    </ToggleButton>
  );
};

export default CustomNotToggle;