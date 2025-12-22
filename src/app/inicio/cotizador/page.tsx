// app/inicio/cotizador/page.tsx

"use client";
import { useState } from 'react';
import styles from './cotizador.module.css';
import CustomButton from "@/utils/ui/button/CustomButton";
import CustomModal from "@/utils/ui/form/CustomModal";
import { CotizadorForm } from './CotizadorForm';

function CotizacionesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.inicioContainer}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Cotizador Online:</h1>

        <CustomButton
          onClick={handleOpenModal}
          width="fit-content" 
        >
          Abrir Cotizador
        </CustomButton>
      </div>

      <CustomModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Cotizador"
        size="large"
      >
        <CotizadorForm onClose={handleCloseModal} />
      </CustomModal>
    </div>
  )
}

export default CotizacionesPage;

