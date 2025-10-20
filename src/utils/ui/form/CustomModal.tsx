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
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  size = 'large',
  children,
}) => {
  const modalSizeClass = styles[size];

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="custom-modal-title">
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
      </Box>
    </Modal>
  );
};

export default CustomModal;