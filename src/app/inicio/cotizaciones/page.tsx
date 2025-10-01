// app/inicio/cotizaciones/page.tsx

"use client";
import styles from './cotizaciones.module.css';
import CustomButton from "@/utils/ui/button/CustomButton";

const EXTERNAL_QUOTE_URL = "http://arttest.intersistemas.ar:8687/Cotizador";

function CotizacionesPage() {
  const handleOpenExternalLink = () => {
    // 'noopener,noreferrer' son importantes por seguridad.
    window.open(EXTERNAL_QUOTE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.inicioContainer}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Cotizador Online:</h1>

         <CustomButton
            onClick={handleOpenExternalLink}
            width="fit-content" 
          >
            Abrir Cotizador
          </CustomButton>
          
      </div>
    </div>
  )
}

export default CotizacionesPage;

