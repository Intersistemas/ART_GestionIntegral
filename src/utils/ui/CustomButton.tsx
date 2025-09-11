"use client";
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styles from './CustomButton.module.css';

interface CustomButtonProps extends Omit<ButtonProps, 'classes'> {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  isLoading = false,
  fullWidth = true,
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
        // Puedes agregar más variantes si lo necesitas
      }}
      className={className}
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
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