// src/utils/ui/button/CustomButton.tsx

"use client";
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styles from './CustomButton.module.css';

interface CustomButtonProps extends Omit<ButtonProps, 'classes' | 'size' | 'fullWidth'> {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error';
  isLoading?: boolean;
  width?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'mid' | 'large'; 
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  isLoading = false,
  width,
  className = '',
  disabled = false,
  icon,
  size = 'mid',
  ...props
}) => {
  const sizeClass = {
    small: styles.small,
    mid: styles.mid,
    large: styles.large,
  };
  
  const isSecondaryStyle = color === 'secondary';

  return (
    <Button
      variant={variant}
      classes={{
        root: `${styles.customButton} ${isSecondaryStyle ? styles.secondary : ''} ${disabled || isLoading ? styles.disabled : ''} ${sizeClass[size]}`,
        containedPrimary: styles.primary,
      }}
      className={className}
      disabled={disabled || isLoading}
      style={{ width: width || 'fit-content' }}
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