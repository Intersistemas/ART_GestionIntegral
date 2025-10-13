"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import RolesInterface from "./interfaces/RolesInterface";
import styles from "./Usuario.module.css";
import { SelectChangeEvent } from "@mui/material/Select";
import RefEmpleador from "./interfaces/RefEmpleador";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import CargoInterface from "./interfaces/CargoInterface";

// Definición del modo de operación (replicada desde UsuariosPage)
type RequestMethod = "create" | "edit" | "view" | "delete" | "activate" | "remove";

export interface UsuarioFormFields {
  nombre: string;
  email: string;
  cuit: string;
  phoneNumber: string;
  cargoId?: number;
  password?: string;
  confirmPassword?: string;
  rol: string;
  // tipo: string;
  // userName: string;
  empresaId: number;
  id?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: UsuarioFormFields) => void;
  roles: RolesInterface[];
  cargos: CargoInterface[];
  refEmpleadores: RefEmpleador[];
  initialData?: UsuarioFormFields;
  errorMsg?: string | null;
  method: RequestMethod; // MODO DE OPERACIÓN
  isSubmitting?: boolean;
}

const initialFormState: UsuarioFormFields = {
  nombre: "",
  email: "",
  cuit: "",
  phoneNumber: "",
  cargoId: 0,
  password: "",
  confirmPassword: "",
  rol: "",
  // tipo: "",
  // userName: "",
  empresaId: 0,
};

// Interfaces completas para errores y campos tocados
interface ValidationErrors {
  nombre?: string;
  email?: string;
  cuit?: string;
  phoneNumber?: string;
  cargoId?: string;
  password?: string;
  confirmPassword?: string;
  rol?: string;
  // tipo?: string;
  // userName?: string;
  empresaId?: string;
  id?: string;
}

interface TouchedFields {
  nombre?: boolean;
  email?: boolean;
  cuit?: boolean;
  phoneNumber?: boolean;
  cargoId?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  rol?: boolean;
  // tipo?: boolean;
  // userName?: boolean;
  empresaId?: boolean;
  id?: boolean;
}

export default function UsuarioForm({
  open,
  onClose,
  onSubmit,
  roles,
  cargos,
  refEmpleadores,
  initialData,
  errorMsg,
  method,
  isSubmitting = false,
}: Props) {
  const [form, setForm] = useState<UsuarioFormFields>(initialFormState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  // --- Lógica de Modos y Estado ---
  const isViewing = method === "view";
  const isEditing = method === "edit";
  const isCreating = method === "create";
  const isDeleting = method === "delete";
  const isActivating = method === "activate";
  const isDisabled = isViewing || isDeleting || isActivating;

  useEffect(() => {
    // Restablecer el formulario y los estados de error/tocado al abrir o cambiar los datos
    if (initialData) {
      const processedData = { ...initialData };
      
      // En modo edición, limpiar campos que deben aparecer vacíos
      if (isEditing) {
        // Siempre limpiar contraseñas en modo edición
        processedData.password = "";
        processedData.confirmPassword = "";
        
        // Limpiar campo cargo si viene como undefined, null, cadena vacía, o valores por defecto no deseados
        // if (!processedData.cargo || 
        //     processedData.cargo.trim() === "" || 
        //     processedData.cargo === "null" || 
        //     processedData.cargo === "undefined") {
        //   processedData.cargo = "";
        // }
      }
      
      setForm(processedData);
    } else {
      setForm(initialFormState);
    }
    
    setErrors({});
    setTouched({});
  }, [initialData, open, isEditing]);

  const modalTitle = useMemo(() => {
    switch (method) {
      case "create":
        return "Crear Nuevo Usuario";
      case "edit":
        return `Editar Usuario: ${form.nombre || ""}`;
      case "view":
        return `Detalles Usuario: ${form.nombre || ""}`;
      case "delete":
        return `Dar de baja Usuario: ${form.nombre || ""}`;
      case "activate":
        return `Activar Usuario: ${form.nombre || ""}`;
      default:
        return "Formulario de Usuario";
    }
  }, [method, form.nombre]);

  // --- Funciones de Validación ---

  const validateCuit = (cuit: string): string | undefined => {
    if (!cuit.trim()) return "CUIT es requerido";
    const cleanCuit = cuit.replace(/[^\d]/g, "");
    if (cleanCuit.length !== 11) return "CUIT debe tener 11 dígitos";
    // Basic CUIT validation algorithm
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digits = cleanCuit.split("").map(Number);
    const sum = digits
      .slice(0, 10)
      .reduce((acc, digit, index) => acc + digit * factors[index], 0);
    const verifierDigit = 11 - (sum % 11);
    const expectedDigit =
      verifierDigit >= 10 ? verifierDigit - 11 : verifierDigit;
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

  // const validatePhoneNumber = (phoneNumber: string): string | undefined => {
  //   if (!phoneNumber.trim()) return "Número de teléfono es requerido";
  //   const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
  //   if (cleanPhone.length < 10)
  //     return "El teléfono debe tener al menos 10 dígitos";
  //   return undefined;
  // };

  const validateRequired = (
    value: string,
    fieldName: string
  ): string | undefined => {
    if (!value.trim()) return `${fieldName} es requerido`;
    return undefined;
  };

  const validateField = (
    name: keyof UsuarioFormFields,
    value: string
  ): string | undefined => {
    switch (name) {
      case "cuit":
        return validateCuit(value);
      case "email":
        return validateEmail(value);
      case "password":
        // Solo validar password si estamos creando, o si estamos editando y el usuario ingresó algo
        if (isCreating) {
          return validatePassword(value);
        } else if (isEditing) {
          // En edición, solo validar si hay algo escrito
          if (value.trim() !== "") {
            return validatePassword(value);
          }
          // Si está vacío en edición, no hay error (significa que no quiere cambiar la contraseña)
          return undefined;
        }
        return undefined;
      case "confirmPassword":
        // Solo validar confirmPassword si estamos creando, o si estamos editando y hay password
        if (isCreating) {
          return validateConfirmPassword(value, form.password || "");
        } else if (isEditing) {
          // En edición, solo validar si alguno de los campos de password tiene contenido
          const hasPassword = form.password && form.password.trim() !== "";
          const hasConfirmPassword = value.trim() !== "";
          
          if (hasPassword || hasConfirmPassword) {
            // Si cualquiera tiene contenido, validar ambos
            return validateConfirmPassword(value, form.password || "");
          }
          // Si ambos están vacíos, no hay error (no quiere cambiar contraseña)
          return undefined;
        }
        return undefined;
      // case "phoneNumber":
      //   return validatePhoneNumber(value);
      case "nombre":
        return validateRequired(value, "Nombre");
      // case "userName":
      //   return validateRequired(value, "Usuario");
      // case "tipo":
      //   return validateRequired(value, "Tipo");
      case "rol":
        return validateRequired(value, "Rol");
      case "cargoId":
        return validateRequired(String(value), "Cargo");
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

    // Validar todos los campos
    (Object.keys(form) as (keyof UsuarioFormFields)[]).forEach((fieldName) => {
      const value = String(form[fieldName] ?? "");
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
      setErrors((prev) => ({
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
      setErrors((prev) => ({
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
      setErrors((prev) => ({
        ...prev,
        empresaId: error,
      }));
    }
  };

  const handleCargoChange = (e: SelectChangeEvent<number>) => {
    const { value } = e.target;

    setForm((prev: UsuarioFormFields) => ({
      ...prev,
      cargoId: Number(value),
    }));

    if (touched.cargoId) {
      const error = validateField("cargoId", String(value));
      setErrors((prev) => ({
        ...prev,
        cargoId: error,
      }));
    }
  };

  const handleBlur = (fieldName: keyof UsuarioFormFields) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, String(form[fieldName] ?? ""));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Manejo directo para 'delete' (no requiere validación de formulario)
    if (isDeleting || isActivating) {
      onSubmit(form);
      return;
    }

    // Set default values for hidden fields
    const formDataWithDefaults = {
      ...form,
      userName: form.email, // Use email as username
      tipo: "", // Default type
      rol: form.rol || (roles.length > 0 ? roles[0].nombre : ""), // Default to first role
      empresaId:
        form.empresaId ||
        (refEmpleadores.length > 0 ? refEmpleadores[0].interno : 0),
    };

    // Mark all fields as touched
    const allTouched: TouchedFields = Object.keys(form).reduce((acc, key) => {
      acc[key as keyof TouchedFields] = true;
      return acc;
    }, {} as TouchedFields);
    setTouched(allTouched);

    if (validateAllFields()) {
      console.log("Submitting form data:", formDataWithDefaults);
      // Limpiamos los campos de password/confirmPassword si están vacíos al editar
      const dataToSubmit = { ...formDataWithDefaults };
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
      size={isCreating ? "large" : "mid"}
    >
      <Box
        component="form"
        className={styles.formContainer}
        onSubmit={handleSubmit}
      >
        {errorMsg && (
          <Typography className={styles.errorMessage}>{errorMsg}</Typography>
        )}
        <div className={styles.formLayout}>
          <div className={styles.formContent}>
            {/* Datos del Usuario */}
            <div className={styles.formSection}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Datos del Usuario
              </Typography>

              <div className={styles.formRow}>
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
                  placeholder="Ingrese nombre"
                />
              </div>

              {isCreating && (
                <div className={styles.formRow}>
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
                    placeholder="ejemplo@empresa.com"
                    className={styles.fullRowField}
                  />
                </div>
              )}

              <div className={styles.formRow}>
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
                  placeholder="Ingrese CUIT (11 dígitos)"
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
                  disabled={isDisabled}
                  placeholder="Ingrese teléfono"
                />
              </div>

              <div className={styles.formRow}>
                <FormControl
                  fullWidth
                  required={!isDisabled}
                  error={touched.cargoId && !!errors.cargoId}
                  disabled={isDisabled}
                >
                  <InputLabel>Cargo/Función</InputLabel>
                  <Select
                    name="cargoId"
                    value={form.cargoId}
                    label="Cargo"
                    onChange={handleCargoChange}
                    onBlur={() => handleBlur("cargoId")}
                  >
                    {cargos.map((cargo) => (
                      <MenuItem key={cargo.id} value={cargo.id}>
                        {cargo.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.cargoId && errors.cargoId && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ ml: 2, mt: 0.5 }}
                    >
                      {errors.cargoId}
                    </Typography>
                  )}
                </FormControl>
              </div>

              {isCreating && (
                <div className={styles.formRow}>
                  {/* Rol (Select) */}
                  <FormControl
                    fullWidth
                    required={!isDisabled}
                    error={touched.rol && !!errors.rol}
                    disabled={isDisabled}
                  >
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

                  {/* Empresa (Select) */}
                  <FormControl
                    fullWidth
                    required={!isDisabled}
                    error={touched.empresaId && !!errors.empresaId}
                    disabled={isDisabled}
                  >
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
                        <MenuItem
                          key={refEmpleador.interno}
                          value={refEmpleador.interno}
                        >
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
              )}
            </div>

            {/* Credenciales de Acceso (Ocultas en View y Deleted)*/}
            {isCreating ||
              (isEditing && (
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Credenciales de Acceso
                  </Typography>

                  <div className={styles.formRow}>
                    <TextField
                      label={
                        isCreating
                          ? "Contraseña temporal"
                          : "Nueva contraseña (opcional)"
                      }
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("password")}
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      fullWidth
                      required={isCreating && !isDisabled}
                      disabled={isDisabled}
                      placeholder={
                        isCreating ? "••••••••" : "Dejar vacío para no cambiar"
                      }
                    />
                    <TextField
                      label={
                        isCreating
                          ? "Confirmar contraseña"
                          : "Confirmar nueva contraseña"
                      }
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
                      required={isCreating && !isDisabled}
                      disabled={isDisabled}
                      placeholder={
                        isCreating ? "••••••••" : "Dejar vacío para no cambiar"
                      }
                    />
                  </div>

                  <Typography variant="body2" className={styles.passwordHelp}>
                    {isCreating
                      ? "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números."
                      : "Deje ambos campos vacíos para mantener la contraseña actual. Si desea cambiarla, complete ambos campos con la nueva contraseña."}
                  </Typography>
                </div>
              ))}
            <div className={styles.formActions}>
              {/* Botón de acción principal (Oculto en 'view') */}
              {!isViewing && (
                <CustomButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEditing ? (
                    "Guardar Cambios"
                  ) : isDeleting ? (
                    "Dar de baja Usuario"
                  ) : isActivating ? (
                    "Activar Usuario"
                  ) : (
                    "Registrar Usuario"
                  )}
                </CustomButton>
              )}

              <CustomButton
                onClick={onClose}
                color="secondary"
                disabled={isSubmitting}
              >
                {isViewing ? "Cerrar" : "Cancelar"}
              </CustomButton>
            </div>
          </div>
          {isCreating && (
            <div className={styles.infoPanel}>
              <Typography variant="h6" className={styles.infoPanelTitle}>
                Información Importante
              </Typography>
              <ul className={styles.infoList}>
                <li>El usuario recibirá un email para activar su cuenta</li>
                <li>La contraseña temporal deberá ser cambiada</li>
                <li>Posteriormente se podrán configurar los permisos</li>
                <li>Los campos marcados con * son obligatorios</li>
              </ul>
            </div>
          )}
        </div>
      </Box>
    </CustomModal>
  );
}
