"use client";
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styles from './CustomButton.module.css';

interface CustomButtonProps extends Omit<ButtonProps, 'classes'> {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  isLoading?: boolean;
  fullWidth?: boolean; // Vuelve a agregar la prop fullWidth
  width?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  isLoading = false,
  width,
  fullWidth = true, // Establece el valor por defecto
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      classes={{
        root: styles.customButton,
        containedPrimary: styles.primary,
        containedSecondary: styles.secondary,
      }}
      className={className}
      disabled={disabled || isLoading}
      // La lógica del ancho ahora es más robusta
      style={{ width: width || (fullWidth ? '100%' : undefined) }}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loadingText}>CARGANDO...</span>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;