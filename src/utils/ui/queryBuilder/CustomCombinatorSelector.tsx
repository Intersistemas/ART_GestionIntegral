// src/utils/ui/queryBuilder/CustomCombinatorSelector.tsx
import React from 'react';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Box,
    Typography,
} from '@mui/material';
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
    className,
}) => {

    // La función de cambio para RadioGroup
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        // El valor del Radio seleccionado ya está en event.target.value
        const newCombinator = event.target.value;
        handleOnChange(newCombinator);
    };

    return (
        <FormControl component="fieldset" className={className} size="small">
            <RadioGroup
                row // Organiza los botones en una fila
                name="combinator-selector"
                value={value} // 'and' o 'or'
                onChange={handleChange}
                sx={{ gap: 0 }} // Espacio entre los botones
            >
                {/* Usamos las opciones definidas internamente */}
                {internalCombinators.map((combinator) => (
                    <FormControlLabel
                        key={combinator.name}
                        value={combinator.name}
                        control={
                            <Radio
                                size="medium"
                                sx={{
                                    // Colores del radio
                                    color: combinator.name === 'and' ? '#1976d2' : '#f44336', // Color del círculo
                                    '&.Mui-checked': {
                                        color: combinator.name === 'and' ? '#0d47a1' : '#c62828', // Color del círculo seleccionado
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography
                                variant="button"
                                sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: combinator.name === 'and' ? '#1976d2' : '#f44336', // Color del texto
                                }}
                            >
                                {combinator.label}
                            </Typography>
                        }
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default CustomCombinatorSelector;