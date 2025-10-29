"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import styles from "./resetPassword.module.css";
import CustomButton from "@/utils/ui/button/CustomButton";
import UsuarioAPI from "@/data/usuarioAPI";

export interface CambiarClaveFormFields {
  password: string;
  confirmPassword: string;
  token?: string;
  email?: string;
}

interface Props {
  onSuccess?: () => void;
  errorMsg?: string | null;
}

const initialFormState: CambiarClaveFormFields = {
  password: "",
  confirmPassword: "",
};

// Interfaces para errores y campos tocados
interface ValidationErrors {
  password?: string;
  confirmPassword?: string;
  email?: string;
}

interface TouchedFields {
  password?: boolean;
  confirmPassword?: boolean;
  email?: boolean;
}

const ResetPassword = ({ onSuccess, errorMsg }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<CambiarClaveFormFields>(initialFormState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Leer token y email de la URL
    const tokenFromUrl = searchParams.get("token");
    const emailFromUrl = searchParams.get("email");

    // Inicializar el formulario con los valores de la URL
    setForm({
      ...initialFormState,
      token: tokenFromUrl || undefined,
      email: emailFromUrl || undefined,
    });
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [searchParams]);

  // --- Funciones de Validación (copiadas de UsuarioForm) ---

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Contraseña es requerida";
    if (password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    if (!/(?=.*[a-z])/.test(password))
      return "La contraseña debe contener al menos una letra minúscula";
    if (!/(?=.*[A-Z])/.test(password))
      return "La contraseña debe contener al menos una letra mayúscula";
    if (!/(?=.*\d)/.test(password))
      return "La contraseña debe contener al menos un número";
    if (!/(?=.*[@$!%*?&])/.test(password))
      return "La contraseña debe contener al menos un carácter especial (@$!%*?&)";
    return undefined;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): string | undefined => {
    if (!confirmPassword) return "Confirmación de contraseña es requerida";
    if (confirmPassword !== password) return "Las contraseñas no coinciden";
    return undefined;
  };

  const validateField = (
    name: keyof CambiarClaveFormFields,
    value: string
  ): string | undefined => {
    switch (name) {
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value, form.password || "");
      default:
        return undefined;
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    // Validar todos los campos
    (Object.keys(form) as (keyof CambiarClaveFormFields)[]).forEach(
      (fieldName) => {
        if (fieldName !== "token") {
          const value = String(form[fieldName] ?? "");
          const error = validateField(fieldName, value);
          if (error) {
            newErrors[fieldName] = error;
            hasErrors = true;
          }
        }
      }
    );

    setErrors(newErrors);
    return !hasErrors;
  };

  // --- Handlers ---

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof CambiarClaveFormFields;

    setForm((prev: CambiarClaveFormFields) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error de submit cuando el usuario empiece a escribir
    if (submitError) {
      setSubmitError(null);
    }

    // Solo validar campos que están en TouchedFields (excluyendo 'token')
    if (fieldName !== "token" && touched[fieldName as keyof TouchedFields]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const handleBlur = (fieldName: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(
      fieldName as keyof CambiarClaveFormFields,
      String(form[fieldName as keyof CambiarClaveFormFields] ?? "")
    );
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched: TouchedFields = {
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    if (!validateAllFields()) {
      return;
    }

    // Verificar que token y email estén presentes antes de enviar
    if (!form.token || !form.email) {
      setSubmitError(
        "Token o email faltante. Verifique el enlace recibido por email."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Llamar al endpoint usando el hook useCambiarClave
      const dataToSubmit = {
        password: form.password,
        token: form.token,
        email: form.email,
        confirmPassword: form.confirmPassword,
      };

      await UsuarioAPI.cambiarClave(dataToSubmit);

      // Si llegamos aquí, la operación fue exitosa
      setIsSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirigir al login después de mostrar el mensaje por 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error("Error al cambiar la clave:", error);
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Error al cambiar la contraseña. Intente nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Establecer Nueva Contraseña
          </Typography>

          <Box
            component="form"
            className={styles.formContainer}
            onSubmit={handleSubmit}
          >
            {isSuccess && (
              <Alert 
                severity="success" 
                sx={{ mb: 3, textAlign: "center" }}
                icon={<CheckCircle />}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  ¡Contraseña cambiada exitosamente!
                </Typography>
                <Typography variant="body2">
                  Tu contraseña ha sido actualizada correctamente. 
                  Serás redirigido al login en unos segundos...
                </Typography>
              </Alert>
            )}

            {(errorMsg || submitError) && !isSuccess && (
              <Typography className={styles.errorMessage}>
                {errorMsg || submitError}
              </Typography>
            )}

            {!form.token && !isSuccess && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                Token de recuperación no válido o faltante. Verifique el enlace
                recibido por email.
              </Typography>
            )}

            <div className={styles.formLayout}>
              <div className={styles.formContent}>
                {/* Credenciales de Acceso */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Nueva Contraseña
                  </Typography>

                  {form.email && (
                    <div className={styles.formRow}>
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        fullWidth
                        disabled
                        margin="normal"
                        variant="filled"
                      />
                    </div>
                  )}

                  <div className={styles.formRow}>
                    <TextField
                      label="Nueva contraseña"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("password")}
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      fullWidth
                      required
                      disabled={isSubmitting || isSuccess}
                      placeholder="••••••••"
                      className={styles.fullRowField}
                      margin="normal"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Confirmar nueva contraseña"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      error={
                        touched.confirmPassword && !!errors.confirmPassword
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      fullWidth
                      required
                      disabled={isSubmitting || isSuccess}
                      placeholder="••••••••"
                      className={styles.fullRowField}
                      margin="normal"
                    />
                  </div>

                  <Typography
                    variant="body2"
                    className={styles.passwordHelp}
                    sx={{ mt: 2, mb: 3 }}
                  >
                    La contraseña debe tener al menos 8 caracteres, incluir
                    mayúsculas, minúsculas, números y al menos un carácter
                    especial (@$!%*?&).
                  </Typography>
                </div>

                <div className={styles.formActions}>
                  <Box sx={{ width: "100%" }}>
                    <CustomButton
                      type="submit"
                      disabled={isSubmitting || !form.token || isSuccess}
                      style={{ width: "100%" }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : isSuccess ? (
                        "Contraseña Cambiada ✓"
                      ) : (
                        "Establecer Contraseña"
                      )}
                    </CustomButton>
                  </Box>
                </div>
              </div>
            </div>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
