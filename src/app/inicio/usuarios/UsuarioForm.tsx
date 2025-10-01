"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Box, TextField, Button, Typography, MenuItem, Select, InputLabel, 
  FormControl, CircularProgress 
} from '@mui/material';
import RolesInterface from "./interfaces/RolesInterface";
import styles from './Usuario.module.css';
import { SelectChangeEvent } from '@mui/material/Select';
import RefEmpleador from "./interfaces/RefEmpleador";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";

// Definición del modo de operación (replicada desde UsuariosPage)
type RequestMethod = 'create' | 'edit' | 'view' | 'delete';

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
  id?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: UsuarioFormFields) => void;
  roles: RolesInterface[];
  refEmpleadores: RefEmpleador[];
  initialData?: UsuarioFormFields;
  errorMsg?: string | null;
  method: RequestMethod; // MODO DE OPERACIÓN
  isSubmitting?: boolean;
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

// Interfaces completas para errores y campos tocados
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
  id?: string;
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
  id?: boolean;
}

export default function UsuarioForm({ 
  open, onClose, onSubmit, roles, refEmpleadores, 
  initialData, errorMsg, method, isSubmitting = false
}: Props) {
  const [form, setForm] = useState<UsuarioFormFields>(initialFormState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  // --- Lógica de Modos y Estado ---
  
  useEffect(() => {
    // Restablecer el formulario y los estados de error/tocado al abrir o cambiar los datos
    setForm(initialData || initialFormState);
    setErrors({});
    setTouched({});
  }, [initialData, open]);

  const isViewing = method === 'view';
  const isEditing = method === 'edit';
  const isCreating = method === 'create';
  const isDeleting = method === 'delete';
  const isDisabled = isViewing || isDeleting;
  
  const modalTitle = useMemo(() => {
      switch (method) {
          case 'create':
              return 'Crear Nuevo Usuario';
          case 'edit':
              return `Editar Usuario: ${form.nombre || ''}`;
          case 'view':
              return `Detalles Usuario: ${form.nombre || ''}`;
          case 'delete':
              return `Eliminar Usuario: ${form.nombre || ''}`;
          default:
              return 'Formulario de Usuario';
      }
  }, [method, form.nombre]);

  // --- Funciones de Validación ---
  
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
        if (isCreating || (isEditing && value.trim() !== "")) {
            return validatePassword(value);
        }
        return undefined;
      case "confirmPassword":
        if (isCreating || (isEditing && form.password && form.password.trim() !== "")) {
            return validateConfirmPassword(value, form.password || "");
        }
        return undefined;
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
        return validateRequired(String(value), "Empresa");
      default:
        return undefined;
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    // No validar en modos 'view' o 'delete'
    if (isDisabled) return true;

    // Filtramos campos de contraseña si estamos editando y están vacíos
    const fieldsToValidate = (Object.keys(form) as (keyof UsuarioFormFields)[]).filter(key => 
        !(isEditing && (key === 'password' || key === 'confirmPassword') && form[key] === "")
    );
    
    fieldsToValidate.forEach((fieldName) => {
      const value = String(form[fieldName] ?? '');
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  // --- Handlers ---

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof UsuarioFormFields;
    
    setForm((prev: UsuarioFormFields) => ({
      ...prev,
      [name]: value,
    }));

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

    // Manejo directo para 'delete' (no requiere validación de formulario)
    if (isDeleting) {
      onSubmit(form); 
      return;
    }
    
    // Marcar campos como tocados y validar
    const allTouched: TouchedFields = Object.keys(form).reduce((acc, key) => {
      acc[key as keyof TouchedFields] = true;
      return acc;
    }, {} as TouchedFields);
    setTouched(allTouched);
    
    if (validateAllFields()) {
      // Limpiamos los campos de password/confirmPassword si están vacíos al editar
      const dataToSubmit = { ...form };
      if (isEditing && !dataToSubmit.password) {
          delete dataToSubmit.password;
          delete dataToSubmit.confirmPassword;
      }

      onSubmit(dataToSubmit);
    }
  };


  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={modalTitle}
      size="mid"
    >
      <Box
        component="form"
        className={styles.formContainer}
        onSubmit={handleSubmit}
      >
  
        {errorMsg && (
          <Typography className={styles.errorMessage}>
            {errorMsg}
          </Typography>
        )}
        <div className={styles.formGrid}>
          
          {/* CUIT */}
          <TextField
            label="CUIT"
            name="cuit"
            value={form.cuit}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("cuit")}
            error={touched.cuit && !!errors.cuit}
            helperText={touched.cuit && errors.cuit}
            fullWidth
            required={!isDisabled}
            disabled={isDisabled}
          />
          {/* Email */}
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
            required={!isDisabled}
            disabled={isDisabled}
          />
          
          {/* Contraseñas (Ocultas en View) */}
          {(!isViewing && !isDeleting) && (
            <>
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
                required={isCreating} 
                disabled={isDisabled}
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
                required={isCreating}
                disabled={isDisabled}
              />
            </>
          )}
          
          {/* Nombre */}
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("nombre")}
            error={touched.nombre && !!errors.nombre}
            helperText={touched.nombre && errors.nombre}
            fullWidth
            required={!isDisabled}
            disabled={isDisabled}
          />
          {/* Usuario */}
          <TextField
            label="Usuario"
            name="userName"
            value={form.userName}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("userName")}
            error={touched.userName && !!errors.userName}
            helperText={touched.userName && errors.userName}
            fullWidth
            required={!isDisabled}
            disabled={isDisabled}
          />
          {/* Teléfono */}
          <TextField
            label="Teléfono"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("phoneNumber")}
            error={touched.phoneNumber && !!errors.phoneNumber}
            helperText={touched.phoneNumber && errors.phoneNumber}
            fullWidth
            required={!isDisabled}
            disabled={isDisabled}
          />
          {/* Tipo */}
          <TextField
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("tipo")}
            error={touched.tipo && !!errors.tipo}
            helperText={touched.tipo && errors.tipo}
            fullWidth
            required={!isDisabled}
            disabled={isDisabled}
          />
          
          {/* Rol (Select) */}
          <FormControl fullWidth required={!isDisabled} error={touched.rol && !!errors.rol} disabled={isDisabled}>
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
              <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                {errors.rol}
              </Typography>
            )}
          </FormControl>
          
          {/* Cargo */}
          <TextField
            label="Cargo"
            name="cargo"
            value={form.cargo}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("cargo")}
            error={touched.cargo && !!errors.cargo}
            helperText={touched.cargo && errors.cargo}
            fullWidth
            required={!isDisabled}
            disabled={isDisabled}
          />
          
          {/* Empresa (Select) */}
          <FormControl fullWidth required={!isDisabled} error={touched.empresaId && !!errors.empresaId} disabled={isDisabled}>
            <InputLabel>Empresa</InputLabel>
            <Select
              name="empresaId"
              value={form.empresaId}
              label="Empresa"
              onChange={handleEmpresaChange}
              onBlur={() => handleBlur("empresaId")}
              disabled={isDisabled || form.empresaId !== 0} 
            >
              {refEmpleadores.map((refEmpleador) => (
                <MenuItem key={refEmpleador.interno} value={refEmpleador.interno}>
                  {refEmpleador.nombre1}
                </MenuItem>
              ))}
            </Select>
            {touched.empresaId && errors.empresaId && (
              <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                {errors.empresaId}
              </Typography>
            )}
          </FormControl>
          
        </div>
        <div className={styles.formActions}>
          
          
          {/* Botón de acción principal (Oculto en 'view') */}
          {!isViewing && (
            <CustomButton type="submit"  disabled={isSubmitting}>
              {isSubmitting 
                ? <CircularProgress size={24} color="inherit" /> 
                : (isEditing ? 'Guardar Cambios' : (isDeleting ? 'Eliminar Usuario' : 'Registrar Usuario'))
              }
            </CustomButton>
          )}

          <CustomButton onClick={onClose} color="secondary" disabled={isSubmitting}>
            {isViewing ? 'Cerrar' : 'Cancelar'}
          </CustomButton>

        </div>
      </Box>
    </CustomModal>
  );
}
