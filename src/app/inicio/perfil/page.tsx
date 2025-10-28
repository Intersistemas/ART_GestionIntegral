// src/app/inicio/profile/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Paper,
  Divider,
  Avatar
} from '@mui/material';

import Grid from '@mui/material/Grid';

import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import CodeIcon from '@mui/icons-material/Code';

import styles from './perfil.module.css';
import Formato from "@/utils/Formato";

function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Grid container justifyContent="center" alignItems="center" className={styles.fullHeight}>
        <Typography variant="h5">Cargando...</Typography>
      </Grid>
    );
  }

  if (!session || !session.user) {
    return (
      <Grid container justifyContent="center" alignItems="center" className={styles.fullHeight}>
        <Typography variant="h5">No has iniciado sesión.</Typography>
      </Grid>
    );
  }

  const { rol, nombre, cuit } = session.user as any;

  return (
    <Box className={styles.pagePadding}>
      <Typography variant="h4" component="h1" gutterBottom className={styles.title}>
        Perfil de Usuario
      </Typography>

      <Paper elevation={3} className={styles.profileContainer}>
        <Box className={styles.header}>
          <Avatar 
            alt={nombre || session.user?.name} 
            src={session.user?.image || undefined} 
            className={styles.avatar}
          />
          <Typography variant="h5" className={styles.headerText}>
            {nombre || session.user?.name}
          </Typography>
        </Box>

        <Grid container spacing={4} className={styles.gridPadding}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card raised className={styles.card}>
              <CardContent>
                <Typography variant="h6" gutterBottom className={styles.sectionTitle}>
                  <AccountCircleIcon className={styles.iconSectionTitle} />
                  Información Personal
                </Typography>
                <Divider className={styles.dividerMargin} />
                
                <Box className={styles.dataItem}>
                  <MailIcon className={styles.icon} />
                  <Typography variant="body1" component="span">
                    <span className={styles.label}>Email: {session.user?.email}</span>  
                  </Typography>
                </Box>
                
                <Box className={styles.dataItem}>
                  <BadgeIcon className={styles.icon} />
                  <Typography variant="body1" component="span">
                    <span className={styles.label}>CUIT/CUIL: {Formato.CUIP(cuit) ?? "N/A"}</span> 
                  </Typography>
                </Box>
                
                <Box className={styles.dataItem}>
                  <CodeIcon className={styles.icon} />
                  <Typography variant="body1" component="span">
                    <span className={styles.label}>Rol: {rol ?? "N/A"}</span> 
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card raised className={styles.card}>
              <CardContent>
                <Typography variant="h6" gutterBottom className={styles.sectionTitle}>
                  Detalles de la Sesión
                </Typography>
                <Divider className={styles.dividerMargin} />
                <pre className={styles.pre}>
                  {JSON.stringify(session, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Paper>
    </Box>
  );
}

export default ProfilePage;