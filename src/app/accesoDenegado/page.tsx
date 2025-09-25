// src/app/accesoDenegado/page.tsx
import Link from 'next/link';
import Image from "next/image";
import Box from '@mui/material/Box';
import CustomButton from "@/utils/ui/button/CustomButton";
import styles from "./accesoDenegado.module.css";

export default function AccessDeniedPage() {
  return (
    <Box className={styles.loginContainer}>
      <Box className={styles.rightCard}>
        <Box className={styles.smallLogoWrap}>
          <Image
            src="/icons/ARTIcon_SVG.svg"
            alt="logo small"
            width={75}
            height={75}
            priority
          />
        </Box>

            <Box className={styles.rightCardContent}>
              <h1 className={styles.formTitle}>Acceso Denegado</h1>
              <h1 className={styles.fieldLabel}>No tienes los permisos necesarios para ver esta página.</h1>
            <Box >
                  
            <Link href="/login">
              <CustomButton>
                Volver a la Pantalla de Ingreso
              </CustomButton>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}