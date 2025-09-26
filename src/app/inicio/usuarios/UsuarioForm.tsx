"use client";

import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import RolesInterface from "./interfaces/RolesInterface";
import styles from './Usuario.module.css';
import { SelectChangeEvent } from '@mui/material/Select';
import RefEmpleador from "./interfaces/RefEmpleador";
import CustomModal from "@/utils/ui/form/CustomModal";

export interface UsuarioFormFields {
  cuit: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  rol: string;
  tipo: string;
  phoneNumber: string;
  nombre: string;
  userName: string;
  cargo: string;
  empresaId: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: UsuarioFormFields) => void;
  roles: RolesInterface[];
  refEmpleadores: RefEmpleador[];
  initialData?: UsuarioFormFields;
  errorMsg?: string | null;
}

const initialFormState: UsuarioFormFields = {
  cuit: "",
  email: "",
  password: "",
  confirmPassword: "",
  rol: "",
  tipo: "",
  phoneNumber: "",
  nombre: "",
  userName: "",
  cargo: "",
  empresaId: 0,
};

interface ValidationErrors {
  cuit?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  rol?: string;
  tipo?: string;
  phoneNumber?: string;
  nombre?: string;
  userName?: string;
  cargo?: string;
  empresaId?: string;
}

interface TouchedFields {
  cuit?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  rol?: boolean;
  tipo?: boolean;
  phoneNumber?: boolean;
  nombre?: boolean;
  userName?: boolean;
  cargo?: boolean;
  empresaId?: boolean;
}

export default function UsuarioForm({ open, onClose, onSubmit, roles, refEmpleadores, initialData, errorMsg }: Props) {
  const [form, setForm] = useState<UsuarioFormFields>(initialFormState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  useEffect(() => {
    setForm(initialData || initialFormState);
    setErrors({});
    setTouched({});
  }, [initialData, open]);

  // Validation functions
  const validateCuit = (cuit: string): string | undefined => {
    if (!cuit.trim()) return "CUIT es requerido";
    const cleanCuit = cuit.replace(/[^\d]/g, '');
    if (cleanCuit.length !== 11) return "CUIT debe tener 11 dígitos";
    // Basic CUIT validation algorithm
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digits = cleanCuit.split('').map(Number);
    const sum = digits.slice(0, 10).reduce((acc, digit, index) => acc + digit * factors[index], 0);
    const verifierDigit = 11 - (sum % 11);
    const expectedDigit = verifierDigit >= 10 ? verifierDigit - 11 : verifierDigit;
    if (digits[10] !== expectedDigit) return "CUIT inválido";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Formato de email inválido";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Contraseña es requerida";
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    if (!/(?=.*[a-z])/.test(password)) return "La contraseña debe contener al menos una letra minúscula";
    if (!/(?=.*[A-Z])/.test(password)) return "La contraseña debe contener al menos una letra mayúscula";
    if (!/(?=.*\d)/.test(password)) return "La contraseña debe contener al menos un número";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "La contraseña debe contener al menos un carácter especial (@$!%*?&)";
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return "Confirmación de contraseña es requerida";
    if (confirmPassword !== password) return "Las contraseñas no coinciden";
    return undefined;
  };

  const validatePhoneNumber = (phoneNumber: string): string | undefined => {
    if (!phoneNumber.trim()) return "Número de teléfono es requerido";
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) return "El teléfono debe tener al menos 10 dígitos";
    return undefined;
  };

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} es requerido`;
    return undefined;
  };

  const validateField = (name: keyof UsuarioFormFields, value: string): string | undefined => {
    switch (name) {
      case "cuit":
        return validateCuit(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value, form.password || "");
      case "phoneNumber":
        return validatePhoneNumber(value);
      case "nombre":
        return validateRequired(value, "Nombre");
      case "userName":
        return validateRequired(value, "Usuario");
      case "tipo":
        return validateRequired(value, "Tipo");
      case "rol":
        return validateRequired(value, "Rol");
      case "cargo":
        return validateRequired(value, "Cargo");
      case "empresaId":
        return validateRequired(value, "Empresa");
      default:
        return undefined;
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    Object.keys(form).forEach((key) => {
      const fieldName = key as keyof UsuarioFormFields;
      const error = validateField(fieldName, String(form[fieldName] ?? ''));
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof UsuarioFormFields;
    
    setForm((prev: UsuarioFormFields) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if it has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof UsuarioFormFields;
    
    setForm((prev: UsuarioFormFields) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if it has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const handleEmpresaChange = (e: SelectChangeEvent<number>) => {
    const { value } = e.target;
    
    setForm((prev: UsuarioFormFields) => ({
      ...prev,
      empresaId: Number(value),
    }));

    // Validate field if it has been touched
    if (touched.empresaId) {
      const error = validateField("empresaId", String(value));
      setErrors(prev => ({
        ...prev,
        empresaId: error,
      }));
    }
  };

  const handleBlur = (fieldName: keyof UsuarioFormFields) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, String(form[fieldName] ?? ''));
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: TouchedFields = Object.keys(form).reduce((acc, key) => {
      acc[key as keyof TouchedFields] = true;
      return acc;
    }, {} as TouchedFields);
    setTouched(allTouched);
    
    // Validate all fields
    if (validateAllFields()) {
      onSubmit(form);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Agregar Usuario"
      size="mid"
    >
      <Box
        component="form"
        className={styles.formContainer}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" component="h2" className={styles.formTitle}>
          Agregar Usuario
        </Typography>
        {errorMsg && (
          <Typography color="error" className={styles.errorMessage}>
            {errorMsg}
          </Typography>
        )}
        <div className={styles.formGrid}>
          <TextField
            label="CUIT"
            name="cuit"
            value={form.cuit}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("cuit")}
            error={touched.cuit && !!errors.cuit}
            helperText={touched.cuit && errors.cuit}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("email")}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("password")}
            error={touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            fullWidth
            required
          />
          <TextField
            label="Confirmar Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("confirmPassword")}
            error={touched.confirmPassword && !!errors.confirmPassword}
            helperText={touched.confirmPassword && errors.confirmPassword}
            fullWidth
            required
          />
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("nombre")}
            error={touched.nombre && !!errors.nombre}
            helperText={touched.nombre && errors.nombre}
            fullWidth
            required
          />
          <TextField
            label="Usuario"
            name="userName"
            value={form.userName}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("userName")}
            error={touched.userName && !!errors.userName}
            helperText={touched.userName && errors.userName}
            fullWidth
            required
          />
          <TextField
            label="Teléfono"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("phoneNumber")}
            error={touched.phoneNumber && !!errors.phoneNumber}
            helperText={touched.phoneNumber && errors.phoneNumber}
            fullWidth
            required
          />
          <TextField
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("tipo")}
            error={touched.tipo && !!errors.tipo}
            helperText={touched.tipo && errors.tipo}
            fullWidth
            required
          />
          <FormControl fullWidth required error={touched.rol && !!errors.rol}>
            <InputLabel>Rol</InputLabel>
            <Select
              name="rol"
              value={form.rol}
              label="Rol"
              onChange={handleSelectChange}
              onBlur={() => handleBlur("rol")}
            >
              {roles.map((rol) => (
                <MenuItem key={rol.id} value={rol.nombre}>
                  {rol.nombre}
                </MenuItem>
              ))}
            </Select>
            {touched.rol && errors.rol && (
              <Typography
                variant="caption"
                color="error"
                sx={{ ml: 2, mt: 0.5 }}
              >
                {errors.rol}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Cargo"
            name="cargo"
            value={form.cargo}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("cargo")}
            error={touched.cargo && !!errors.cargo}
            helperText={touched.cargo && errors.cargo}
            fullWidth
            required
          />
          <FormControl fullWidth required error={touched.empresaId && !!errors.empresaId}>
            <InputLabel>Empresa</InputLabel>
            <Select
              name="empresaId"
              value={form.empresaId}
              label="Empresa"
              onChange={handleEmpresaChange}
              onBlur={() => handleBlur("empresaId")}
              disabled={form.empresaId !== 0}
            >
              {refEmpleadores.map((refEmpleador) => (
                <MenuItem key={refEmpleador.interno} value={refEmpleador.interno}>
                  {refEmpleador.nombre1}
                </MenuItem>
              ))}
            </Select>
            {touched.empresaId && errors.empresaId && (
              <Typography
                variant="caption"
                color="error"
                sx={{ ml: 2, mt: 0.5 }}
              >
                {errors.empresaId}
              </Typography>
            )}
          </FormControl>
        </div>
        <div className={styles.formActions}>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
        </div>
      </Box>
    </CustomModal>
  );
}
