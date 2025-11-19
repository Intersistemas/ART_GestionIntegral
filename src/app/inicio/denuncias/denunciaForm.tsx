"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import styles from "./denuncias.module.css";
import { SelectChangeEvent } from "@mui/material/Select";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import { DenunciaFormData, initialDenunciaFormData, RELACION_ACCIDENTADO } from "./types/tDenuncias";

// Definición del modo de operación
type RequestMethod = "create" | "edit" | "view" | "delete";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: DenunciaFormData) => void;
  initialData?: DenunciaFormData;
  errorMsg?: string | null;
  method: RequestMethod;
  isSubmitting?: boolean;
}

interface ValidationErrors {
  telefonos?: string;
  apellidoNombres?: string;
  relacionAccidentado?: string;
  tipoDenuncia?: string;
  tipoSiniestro?: string;
  enViaPublica?: string;
  fechaOcurrencia?: string;
  hora?: string;
  calle?: string;
  descripcion?: string;
}

interface TouchedFields {
  telefonos?: boolean;
  apellidoNombres?: boolean;
  relacionAccidentado?: boolean;
  tipoDenuncia?: boolean;
  tipoSiniestro?: boolean;
  enViaPublica?: boolean;
  fechaOcurrencia?: boolean;
  hora?: boolean;
  calle?: boolean;
  descripcion?: boolean;
}

export default function DenunciaForm({
  open,
  onClose,
  onSubmit,
  initialData,
  errorMsg,
  method,
  isSubmitting = false,
}: Props) {
  const [form, setForm] = useState<DenunciaFormData>(initialDenunciaFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [activeTab, setActiveTab] = useState(0);

  // Lógica de Modos y Estado
  const isViewing = method === "view";
  const isEditing = method === "edit";
  const isCreating = method === "create";
  const isDeleting = method === "delete";
  const isDisabled = isViewing || isDeleting;

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(initialDenunciaFormData);
    }
    setErrors({});
    setTouched({});
  }, [initialData, open]);

  const modalTitle = useMemo(() => {
    switch (method) {
      case "create":
        return "Registro de Denuncia de Siniestro";
      case "edit":
        return "Editar Denuncia de Siniestro";
      case "view":
        return "Ver Denuncia de Siniestro";
      case "delete":
        return "Eliminar Denuncia de Siniestro";
      default:
        return "Formulario de Denuncia";
    }
  }, [method]);

  // Funciones de Validación
  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} es requerido`;
    return undefined;
  };

  const validateField = (name: keyof DenunciaFormData, value: string): string | undefined => {
    switch (name) {
      case "telefonos":
        return validateRequired(value, "Teléfono");
      case "apellidoNombres":
        return validateRequired(value, "Apellido y Nombres");
      case "relacionAccidentado":
        return validateRequired(value, "Relación con el accidentado");
      case "tipoDenuncia":
        return validateRequired(value, "Tipo de Denuncia");
      case "fechaOcurrencia":
        return validateRequired(value, "Fecha de Ocurrencia");
      case "hora":
        return validateRequired(value, "Hora");
      case "calle":
        return validateRequired(value, "Calle");
      case "descripcion":
        return validateRequired(value, "Descripción");
      default:
        return undefined;
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    if (isDisabled) return true;

    // Validar campos del primer tab
    const fieldsToValidate: (keyof DenunciaFormData)[] = [
      "telefonos", "apellidoNombres", "relacionAccidentado", 
      "tipoDenuncia", "fechaOcurrencia", "hora", "calle", "descripcion"
    ];

    fieldsToValidate.forEach((fieldName) => {
      const value = String(form[fieldName] ?? "");
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName as keyof ValidationErrors] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  // Handlers
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof DenunciaFormData;

    setForm((prev: DenunciaFormData) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[fieldName as keyof TouchedFields]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof DenunciaFormData;

    setForm((prev: DenunciaFormData) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[fieldName as keyof TouchedFields]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const handleBlur = (fieldName: keyof DenunciaFormData) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, String(form[fieldName] ?? ""));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDeleting) {
      onSubmit(form);
      return;
    }

    const allTouched: TouchedFields = Object.keys(form).reduce((acc, key) => {
      acc[key as keyof TouchedFields] = true;
      return acc;
    }, {} as TouchedFields);
    setTouched(allTouched);

    if (validateAllFields()) {
      onSubmit(form);
    }
  };

  const handleNext = () => {
    // Por ahora solo validamos el primer tab
    if (validateAllFields()) {
      setActiveTab(activeTab + 1);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={isSubmitting ? () => {} : onClose}
      title={modalTitle}
      size="large"
    >
      <Box component="form" className={styles.formContainer} onSubmit={handleSubmit}>
        {errorMsg && (
          <Typography className={styles.errorMessage}>{errorMsg}</Typography>
        )}

        {/* Tabs de navegación */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Pasos del formulario">
            <Tab 
              label="1. Datos Iniciales" 
              sx={{ 
                backgroundColor: activeTab === 0 ? '#ff6600' : '#cccccc',
                color: activeTab === 0 ? 'white' : '#666',
                '&.Mui-selected': { color: 'white' }
              }}
            />
            <Tab 
              label="2. Datos del Trabajador" 
              disabled
              sx={{ 
                backgroundColor: '#cccccc',
                color: '#666'
              }}
            />
            <Tab 
              label="3. Datos del Siniestro" 
              disabled
              sx={{ 
                backgroundColor: '#cccccc',
                color: '#666'
              }}
            />
            <Tab 
              label="4. Confirmación" 
              disabled
              sx={{ 
                backgroundColor: '#cccccc',
                color: '#666'
              }}
            />
          </Tabs>
        </Box>

        <div className={styles.formLayout}>
          <div className={styles.formContent}>
            {/* TAB 1: DATOS INICIALES */}
            {activeTab === 0 && (
              <>
                {/* Contacto Inicial */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Contacto Inicial
                  </Typography>

                  <div className={styles.formRow}>
                    <TextField
                      label="Teléfonos"
                      name="telefonos"
                      value={form.telefonos}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("telefonos")}
                      error={touched.telefonos && !!errors.telefonos}
                      helperText={touched.telefonos && errors.telefonos}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Ingrese teléfono"
                    />
                    <TextField
                      label="Apellido y Nombres"
                      name="apellidoNombres"
                      value={form.apellidoNombres}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("apellidoNombres")}
                      error={touched.apellidoNombres && !!errors.apellidoNombres}
                      helperText={touched.apellidoNombres && errors.apellidoNombres}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Apellido y Nombres"
                    />
                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.relacionAccidentado && !!errors.relacionAccidentado}
                      disabled={isDisabled}
                    >
                      <InputLabel>Relación c/accidentado</InputLabel>
                      <Select
                        name="relacionAccidentado"
                        value={form.relacionAccidentado}
                        label="Relación c/accidentado"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("relacionAccidentado")}
                      >
                        {RELACION_ACCIDENTADO.map((relacion) => (
                          <MenuItem key={relacion.value} value={relacion.value}>
                            {relacion.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.relacionAccidentado && errors.relacionAccidentado && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.relacionAccidentado}
                        </Typography>
                      )}
                    </FormControl>
                  </div>
                </div>

                {/* Información del Siniestro */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Información del Siniestro
                  </Typography>

                  <div className={styles.formRow}>
                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.tipoDenuncia && !!errors.tipoDenuncia}
                      disabled={isDisabled}
                    >
                      <InputLabel>Tipo Denuncia</InputLabel>
                      <Select
                        name="tipoDenuncia"
                        value={form.tipoDenuncia}
                        label="Tipo Denuncia"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("tipoDenuncia")}
                      >
                        <MenuItem value="AccidenteTrabajo">Accidente de Trabajo</MenuItem>
                        <MenuItem value="Enfermedad">Enfermedad</MenuItem>
                      </Select>
                      {touched.tipoDenuncia && errors.tipoDenuncia && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.tipoDenuncia}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      label="Tipo Siniestro"
                      name="tipoSiniestro"
                      value={form.tipoSiniestro}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("tipoSiniestro")}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Tipo de siniestro"
                    />

                    <FormControl fullWidth disabled={isDisabled}>
                      <InputLabel>¿En Vía Pública?</InputLabel>
                      <Select
                        name="enViaPublica"
                        value={form.enViaPublica}
                        label="¿En Vía Pública?"
                        onChange={handleSelectChange}
                      >
                        <MenuItem value="Si">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                {/* Accidente de Trabajo */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Accidente de Trabajo
                  </Typography>

                  <div className={styles.formRow}>
                    <TextField
                      label="Fecha Ocurrencia"
                      name="fechaOcurrencia"
                      type="date"
                      value={form.fechaOcurrencia}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("fechaOcurrencia")}
                      error={touched.fechaOcurrencia && !!errors.fechaOcurrencia}
                      helperText={touched.fechaOcurrencia && errors.fechaOcurrencia}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Hora"
                      name="hora"
                      type="time"
                      value={form.hora}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("hora")}
                      error={touched.hora && !!errors.hora}
                      helperText={touched.hora && errors.hora}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Calle"
                      name="calle"
                      value={form.calle}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("calle")}
                      error={touched.calle && !!errors.calle}
                      helperText={touched.calle && errors.calle}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Nombre de la calle"
                    />
                    <TextField
                      label="Nro"
                      name="nro"
                      value={form.nro}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Número"
                    />
                    <TextField
                      label="Piso"
                      name="piso"
                      value={form.piso}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Piso"
                    />
                    <TextField
                      label="Dpto"
                      name="dpto"
                      value={form.dpto}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Depto"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Entre Calle"
                      name="entreCalle"
                      value={form.entreCalle}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Entre calle"
                    />
                    <TextField
                      label="y"
                      name="entreCalleY"
                      value={form.entreCalleY}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="y calle"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Descripción"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("descripcion")}
                      error={touched.descripcion && !!errors.descripcion}
                      helperText={touched.descripcion && errors.descripcion}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      multiline
                      rows={3}
                      placeholder="Descripción del accidente"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Cod Localidad"
                      name="codLocalidad"
                      value={form.codLocalidad}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Código localidad"
                    />
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#ff6600', '&:hover': { backgroundColor: '#e55a00' } }}
                    >
                      🔍
                    </Button>
                    <TextField
                      label="Cod Postal"
                      name="codPostal"
                      value={form.codPostal}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Código postal"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Botones de navegación */}
            <div className={styles.formActions}>
              {activeTab === 0 && !isViewing && (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{ 
                    backgroundColor: '#ff6600', 
                    '&:hover': { backgroundColor: '#e55a00' },
                    minWidth: '120px'
                  }}
                  disabled={isSubmitting}
                >
                  Siguiente ›
                </Button>
              )}

              <CustomButton
                onClick={onClose}
                color="secondary"
                disabled={isSubmitting}
                style={{ 
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                Cancelar
              </CustomButton>
            </div>
          </div>

          {/* Panel de información lateral */}
          {isCreating && (
            <div className={styles.infoPanel}>
              <Typography variant="h6" className={styles.infoPanelTitle}>
                Registro de Denuncia
              </Typography>
              <ul className={styles.infoList}>
                <li>Complete todos los campos obligatorios</li>
                <li>La información debe ser precisa y detallada</li>
                <li>Podrá adjuntar documentos en el último paso</li>
                <li>Los campos marcados con * son obligatorios</li>
              </ul>
            </div>
          )}
        </div>
      </Box>
    </CustomModal>
  );
}
