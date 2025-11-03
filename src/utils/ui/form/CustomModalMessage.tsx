"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';
import CustomButton from '../button/CustomButton';

type MessageType = 'success' | 'error' | 'warning' | 'info';

interface CustomModalMessageProps {
  open: boolean;
  message: string;
  type: MessageType;
  onClose: () => void;
  title?: string;
}

const CustomModalMessage: React.FC<CustomModalMessageProps> = ({
  open,
  message,
  type,
  onClose,
  title = "Atención requerida"
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      default:
        return <Info />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Alert 
          severity={type} 
          icon={getIcon()}
          sx={{ mb: 2 }}
        >
          <Typography variant="body1">
            {message}
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={onClose} color="primary">
          Cerrar
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModalMessage;