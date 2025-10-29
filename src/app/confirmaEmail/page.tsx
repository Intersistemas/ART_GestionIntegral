"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Fade,
  Grow,
} from "@mui/material";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import CustomButton from "@/utils/ui/button/CustomButton";
import UsuarioAPI from "@/data/usuarioAPI";

type ConfirmationState = "loading" | "success" | "error";

const ConfirmarEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<ConfirmationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // Leer parámetros de la URL
    const emailFromUrl = searchParams.get("email");
    const tokenFromUrl = searchParams.get("token");

    if (!emailFromUrl || !tokenFromUrl) {
      setState("error");
      setErrorMessage("Parámetros de confirmación inválidos. Verifique el enlace recibido por email.");
      return;
    }

    setEmail(emailFromUrl);
    setToken(tokenFromUrl);

    // Simular un delay mínimo para mostrar la animación de loading
    const timer = setTimeout(async () => {
      try {
        await UsuarioAPI.confirmarEmail(tokenFromUrl, emailFromUrl);
        setState("success");
      } catch (error: any) {
        console.error("Error al confirmar email:", error);
        setState("error");
        setErrorMessage(
          error?.response?.data?.message ||
          error?.message ||
          "Error al confirmar el email. El enlace puede haber expirado o ser inválido."
        );
      }
    }, 2000); // 2 segundos de loading mínimo

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const LoadingComponent = () => (
    <Fade in={state === "loading"} timeout={500}>
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" sx={{ mb: 2 }}>
          Confirmando tu email...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Por favor espera mientras verificamos tu cuenta
        </Typography>
        {email && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Email: {email}
          </Typography>
        )}
      </Box>
    </Fade>
  );

  const SuccessComponent = () => (
    <Grow in={state === "success"} timeout={800}>
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 3 }} />
        <Typography variant="h4" sx={{ mb: 2, color: "success.main" }}>
          ¡Email Confirmado!
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Tu cuenta ha sido activada exitosamente
        </Typography>
        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Felicidades! Tu email <strong>{email}</strong> ha sido confirmado. 
            Ahora puedes acceder a tu cuenta con las credenciales proporcionadas.
          </Typography>
        </Alert>
        <CustomButton 
          onClick={handleLoginClick}
          size="large"
          style={{ minWidth: "200px" }}
        >
          Ir al Login
        </CustomButton>
      </Box>
    </Grow>
  );

  const ErrorComponent = () => (
    <Grow in={state === "error"} timeout={800}>
      <Box sx={{ textAlign: "center", py: 4 }}>
        <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 3 }} />
        <Typography variant="h4" sx={{ mb: 2, color: "error.main" }}>
          Error de Confirmación
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          No se pudo confirmar tu email
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body1">
            {errorMessage}
          </Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Si el problema persiste, contacta con el administrador del sistema.
        </Typography>
      </Box>
    </Grow>
  );

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2
      }}
    >
      <Card 
        elevation={8} 
        sx={{ 
          maxWidth: 600, 
          width: "100%",
          borderRadius: 3,
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Confirmar Email
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Sistema de Gestión Integral ART
            </Typography>
          </Box>

          {state === "loading" && <LoadingComponent />}
          {state === "success" && <SuccessComponent />}
          {state === "error" && <ErrorComponent />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfirmarEmailPage;