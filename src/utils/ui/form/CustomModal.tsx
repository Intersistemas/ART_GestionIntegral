/* src/utils/ui/form/CustomModal.tsx*/

"use client";
import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import styles from './CustomModal.module.css';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'mid' | 'large';
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  size = 'large',
  children,
  actions,
}) => {
  const modalSizeClass = styles[size];

  const handleClose = (event: {}, reason?: string) => {
    // Prevenir cierre accidental por backdrop click si es necesario
    if (reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      aria-labelledby="custom-modal-title"
      disableAutoFocus
      disableEnforceFocus
    >
      <Box className={`${styles.modalContainer} ${modalSizeClass}`}>
        {/* Nuevo div para el encabezado del modal */}
        <div className={styles.modalHeader}>
          <Typography id="custom-modal-title" variant="h6" component="h2" className={styles.modalTitle}>
            {title}
          </Typography>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {children}
        </div>
        {actions && (
          <div className={styles.modalActions}>
            {actions}
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;