// src/utils/ui/queryBuilder/CustomCombinatorSelector.tsx
import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { CombinatorSelectorProps } from 'react-querybuilder';

// Definimos internamente las opciones de combinador necesarias (Y/O)
const internalCombinators = [
    { name: 'and', label: 'Y' },
    { name: 'or', label: 'O' },
];

const CustomCombinatorSelector: React.FC<CombinatorSelectorProps> = ({
  // La prop 'value' es el combinador actual ('and' o 'or')
  value,
  // La prop 'handleOnChange' se usa para actualizar el combinador
  handleOnChange,
  // Eliminamos 'combinators' de las props desestructuradas
  className,
}) => {
  
  // La función de cambio de ToggleButtonGroup pasa el nuevo valor a handleOnChange
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newCombinator: string | null,
  ) => {
    // Si se hace clic en el botón actualmente seleccionado, newCombinator será null.
    // Prevenimos que se deseleccione, manteniendo el valor actual.
    if (newCombinator !== null) {
      handleOnChange(newCombinator);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={value} // 'and' o 'or'
      onChange={handleChange}
      className={className}
      size="small"
      sx={{ height: '32px' }}
    >
      {/* Usamos las opciones definidas internamente */}
      {internalCombinators.map((combinator) => (
        <ToggleButton
          key={combinator.name}
          value={combinator.name}
          aria-label={combinator.label}
          sx={{
            fontWeight: 'bold',
            // Estilos para distinguir 'Y' de 'O'
            backgroundColor: combinator.name === 'and' ? '#808080' : '#808080', // Azul para 'Y', Rojo para 'O'
            color: 'white',
            // Estilos para el botón activo
            '&.Mui-selected': {
                backgroundColor: combinator.name === 'and' ? '#0d47a1' : '#c62828', // Color más oscuro al seleccionar
                color: 'white',
                '&:hover': {
                    backgroundColor: combinator.name === 'and' ? '#0d47a1' : '#c62828',
                },
            },
            // Estilos para el botón inactivo
            '&:not(.Mui-selected)': {
                opacity: 0.6,
                '&:hover': {
                    opacity: 0.8,
                },
            },
            // Ajuste para el texto (Y/O)
            fontSize: '0.8rem',
            padding: '4px 12px',
          }}
        >
          {combinator.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default CustomCombinatorSelector;