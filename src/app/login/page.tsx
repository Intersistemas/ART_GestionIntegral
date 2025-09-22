// app/signin/page.tsx
"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Person, Lock } from "@mui/icons-material";
import CustomButton from "@/utils/ui/button/CustomButton";
import styles from "./Signin.module.css";

export default function Signin() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      loginUser: formData.get("loginUser"),
      loginPassword: formData.get("loginPassword"),
      redirect: false,
    });

    if (res?.error) setError(res.error as string);
    if (res?.ok) return router.push("/");

    setIsLoading(false);
  };

  return (
    <Box className={styles.loginContainer}>
      {/* LEFT PANEL */}
      <Box className={styles.leftCard}>
        <Box className={styles.centeredBlock}>
          
        </Box>
        
        <Box className={styles.logoBlock}>
          <Box className={styles.centeredBlock}>
              <h1 className={styles.mainTitle}>Gestión</h1>
              <Box className={styles.titleUnderline} />
          </Box>
         
          <Image
            src="/icons/LogoTexto.svg"
            alt="Logo ART Mutual Rural"
            width={500}
            height={500}
            className={styles.logo}
            priority
          />
        </Box>

        <Box className={styles.footerArea}>
          <Box className={styles.greenStripeFooter} />
          <h1 className={styles.footerText}>
            Aseguradora de Riesgos del Trabajo
            <br />
            del sector Agropecuario
          </h1>
        </Box>
      </Box>

      {/* RIGHT PANEL */}
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
          <h1 className={styles.formTitle}>Iniciar Sesión</h1>

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <Alert severity="error" className={styles.error}>
                {error}
              </Alert>
            )}

            <label className={styles.fieldLabel}>Usuario / Email</label>
            <TextField
              fullWidth
              id="loginUser"
              name="loginUser"
              placeholder="Ingrese clave"
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#567a2e" }} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: 'var(--verde)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--verde)',
                    borderWidth: '2px',
                  },
                },
              }}
            />

            <label className={styles.fieldLabel}>Contraseña</label>
            <TextField
              fullWidth
              id="loginPassword"
              name="loginPassword"
              type="password"
              placeholder="Ingrese su contraseña"
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#567a2e" }} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: 'var(--verde)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--verde)',
                    borderWidth: '2px',
                  },
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  disabled={isLoading}
                  sx={{
                    color: "#567a2e",
                    "&.Mui-checked": { color: "#567a2e" },
                  }}
                />
              }
              label="Recordar Sesión"
              className={styles.rememberContainer}
            />

            <CustomButton
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              fullWidth
            >
              INGRESAR AL SISTEMA
            </CustomButton>

            <Box className={styles.forgotPassword}>
              <a className={styles.forgotLink} href="#">
                Olvidaste la contraseña?
              </a>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}