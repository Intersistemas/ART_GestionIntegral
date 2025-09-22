// src/utils/ui/button/CustomButton.tsx

"use client";
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styles from './CustomButton.module.css';

interface CustomButtonProps extends Omit<ButtonProps, 'classes'> {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'success' | 'error' | 'info' | 'warning';
  isLoading?: boolean;
  fullWidth?: boolean;
  width?: string;
  icon?: React.ReactNode;
  exit?: boolean;
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
  ...props
}) => {
  return (
    <Button
      variant={variant}
      classes={{
        root: `${styles.customButton} ${exit ? styles.exit : ''} ${disabled || isLoading ? styles.disabled : ''}`, 
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