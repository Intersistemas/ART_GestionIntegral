"use client";

import React from 'react';
import { Autocomplete, TextField, AutocompleteProps } from '@mui/material';

type CustomSelectSearchProps<T> = Omit<
  AutocompleteProps<T, false, false, false>,
  'options' | 'getOptionLabel' | 'renderInput' | 'filterOptions'
> & {
  options: T[];
  getOptionLabel: (option: T | null) => string;
  filterOptions?: (options: T[], state: { inputValue: string }) => T[];
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  noOptionsText?: string;
  loadingText?: string;
};

export const CustomSelectSearch = <T,>({
  options,
  getOptionLabel,
  filterOptions,
  label = 'Seleccionar',
  error = false,
  helperText,
  disabled = false,
  placeholder = 'Buscar...',
  noOptionsText = 'No se encontraron opciones',
  loadingText = 'Cargando...',
  value,
  onChange,
  ...props
}: CustomSelectSearchProps<T>) => {
  // Función de filtrado por defecto que busca en el label
  const defaultFilterOptions = (
    options: T[],
    { inputValue }: { inputValue: string }
  ): T[] => {
    if (!inputValue) return options;

    const searchTerm = inputValue.toLowerCase().trim();

    return options.filter((option) => {
      const label = getOptionLabel(option);
      return label.toLowerCase().includes(searchTerm);
    });
  };

  return (
    <Autocomplete<T, false, false, false>
      options={options}
      getOptionLabel={getOptionLabel}
      filterOptions={filterOptions || defaultFilterOptions}
      value={value || null}
      onChange={onChange}
      disabled={disabled}
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          fullWidth
        />
      )}
    />
  );
};

export default CustomSelectSearch;

