// src/utils/ui/button/CustomButton.tsx

"use client";
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styles from './CustomButton.module.css';

interface CustomButtonProps extends Omit<ButtonProps, 'classes' | 'size'> {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'success' | 'error' | 'info' | 'warning';
  isLoading?: boolean;
  fullWidth?: boolean;
  width?: string;
  icon?: React.ReactNode;
  exit?: boolean;
  size?: 'small' | 'mid' | 'large'; // ✅ Agregada la prop de tamaño
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  isLoading = false,
  width,
  fullWidth = true,
  className = '',
  disabled = false,
  icon,
  exit = false,
  size = 'mid', // ✅ Valor por defecto 'mid'
  ...props
}) => {
  const sizeClass = {
    small: styles.small,
    mid: styles.mid,
    large: styles.large,
  };
  
  return (
    <Button
      variant={variant}
      classes={{
        // ✅ Agregada la clase de tamaño al root del botón
        root: `${styles.customButton} ${exit ? styles.exit : ''} ${disabled || isLoading ? styles.disabled : ''} ${sizeClass[size]}`,
        containedPrimary: styles.primary,
      }}
      className={className}
      disabled={disabled || isLoading}
      style={{ width: width || (fullWidth ? '100%' : undefined) }}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loadingText}>CARGANDO...</span>
      ) : (
        <div className={styles.contentWrapper}>
          {icon && <span className={styles.iconWrapper}>{icon}</span>}
          {children}
        </div>
      )}
    </Button>
  );
};

export default CustomButton;