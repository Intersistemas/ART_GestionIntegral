'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation'; // ✅ Importación de Next.js
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from './resetPassword.module.css';
import CustomButton from '@/utils/ui/button/CustomButton';

const ResetPassword: React.FC = () => {
    // 🚀 Usamos useSearchParams de next/navigation
    const searchParams = useSearchParams();
    const paramEmail = searchParams.get("email");
    const paramToken = searchParams.get("token");

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Validar si los parámetros existen al cargar
    useEffect(() => {
        if (!paramEmail || !paramToken) {
            // No establecemos error inmediatamente para evitar un flash,
            // pero podemos deshabilitar el formulario.
            console.warn('Parámetros (email o token) faltantes en la URL.');
            // Opcionalmente, puedes establecer un error si necesitas un mensaje visible:
            // setError('Enlace de reestablecimiento incompleto. Por favor, usa el enlace enviado a tu correo.');
        } else {
            console.log('Parámetros de URL obtenidos:', { email: paramEmail, token: paramToken });
        }
    }, [paramEmail, paramToken]);

    const handleResetPassword = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 8) {
            setError('La nueva clave debe tener al menos 8 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las claves no coinciden.');
            return;
        }

        // Validación final de parámetros
        if (!paramEmail || !paramToken) {
            setError('Faltan datos de la URL para reestablecer la clave. Por favor, revisa el enlace.');
            return;
        }

        setLoading(true);

        try {
            // 💡 REEMPLAZA ESTO con la llamada a tu API
            
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: paramEmail,
                    token: paramToken,
                    newPassword: newPassword,
                }),
            });

            if (!response.ok) {
                // Asumiendo que tu API devuelve un objeto JSON en caso de error
                const data = await response.json(); 
                throw new Error(data.message || 'Error al reestablecer la clave. Verifica el token.');
            }
            
            setSuccess('✅ ¡Clave reestablecida exitosamente! Serás redirigido en breve.');
            setNewPassword('');
            setConfirmPassword('');

            // Opcional: Redirigir al login después de 3 segundos
            // setTimeout(() => router.push('/login'), 3000); 

        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado al contactar al servidor.');
        } finally {
            setLoading(false);
        }
    }, [newPassword, confirmPassword, paramEmail, paramToken]);

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    // Deshabilita el formulario si faltan parámetros críticos
    const isFormDisabled = loading || !!success || !paramEmail || !paramToken;

    return (
        <Container component="main" maxWidth="xs" className={styles.container}>
            <Box className={styles.paper}>
                <Typography component="h1" variant="h5" className={styles.heading}>
                    🔑 Reestablecer Clave
                </Typography>
                <Typography variant="body2" align="center" className={styles.subtitle}>
                    Ingresa y confirma tu nueva clave para **{paramEmail || 'el usuario'}**.
                </Typography>

                <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 3 }} className={styles.form}>
                    
                    {/* Nueva Clave */}
                    <TextField
                        className={styles.textField}
                        margin="normal"
                        required
                        fullWidth
                        name="new-password"
                        label="Nueva Clave (mín. 8 caracteres)"
                        type={showPassword ? 'text' : 'password'}
                        id="new-password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isFormDisabled}
                        InputProps={{
                            endAdornment: (
                                <CustomButton
                                    onClick={toggleShowPassword}
                                    className={styles.passwordToggleButton}
                                    disableRipple
                                    disabled={isFormDisabled}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </CustomButton>
                            ),
                        }}
                    />

                    {/* Confirmar Clave */}
                    <TextField
                        className={styles.textField}
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-password"
                        label="Confirmar Nueva Clave"
                        type={showPassword ? 'text' : 'password'}
                        id="confirm-password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isFormDisabled}
                    />
                    
                    {/* Mensajes de Estado */}
                    {(!paramEmail || !paramToken) && !error && (
                        <Typography color="error" className={styles.errorMessage}>
                            ⚠️ Faltan parámetros en la URL. El enlace de tu correo puede estar incompleto.
                        </Typography>
                    )}
                    {error && (
                        <Typography color="error" className={styles.errorMessage}>
                            ❌ {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography className={styles.successMessage}>
                            {success}
                        </Typography>
                    )}

                    {/* Botón de Enviar */}
                    <div style={{justifyContent: "center", display: "flex"}}>
                        <CustomButton
                            type="submit"
                            disabled={isFormDisabled}
                        >
                            {loading ? 'Cargando...' : 'Reestablecer Clave'}
                        </CustomButton>
                    </div>

                    <Box sx={{ mt: 2 }}>
                         <Typography variant="body2" className={styles.infoText}>
                            La clave debe ser única y segura.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPassword;