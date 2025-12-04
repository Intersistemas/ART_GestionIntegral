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
  Checkbox,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import styles from "./denuncias.module.css";
import { SelectChangeEvent } from "@mui/material/Select";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import { DenunciaFormData, initialDenunciaFormData, RELACION_ACCIDENTADO, TIPO_DOCUMENTO, ESTADO_CIVIL, COLORES, TIPOS_TRASLADO } from "./types/tDenuncias";

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
  // Worker data fields
  cuil?: string;
  docTipo?: string;
  docNumero?: string;
  nombre?: string;
  fechaNac?: string;
  sexo?: string;
  estadoCivil?: string;
  nacionalidad?: string;
  domicilioCalle?: string;
  telefono?: string;
  email?: string;
  // Accident data fields
  estaConsciente?: string;
  color?: string;
  habla?: string;
  gravedad?: string;
  respira?: string;
  tieneHemorragia?: string;
  contextoDenuncia?: string;
  prestadorInicialCuit?: string;
  prestadorInicialRazonSocial?: string;
  // Confirmation fields
  aceptoTerminos?: string;
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
  // Worker data fields
  cuil?: boolean;
  docTipo?: boolean;
  docNumero?: boolean;
  nombre?: boolean;
  fechaNac?: boolean;
  sexo?: boolean;
  estadoCivil?: boolean;
  nacionalidad?: boolean;
  domicilioCalle?: boolean;
  telefono?: boolean;
  email?: boolean;
  // Accident data fields
  estaConsciente?: boolean;
  color?: boolean;
  habla?: boolean;
  gravedad?: boolean;
  respira?: boolean;
  tieneHemorragia?: boolean;
  contextoDenuncia?: boolean;
  prestadorInicialCuit?: boolean;
  prestadorInicialRazonSocial?: boolean;
  // Confirmation fields
  aceptoTerminos?: boolean;
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      // Worker data validation
      case "cuil":
        return validateRequired(value, "CUIL");
      case "docTipo":
        return validateRequired(value, "Tipo de Documento");
      case "docNumero":
        return validateRequired(value, "Número de Documento");
      case "nombre":
        return validateRequired(value, "Nombre");
      case "fechaNac":
        return validateRequired(value, "Fecha de Nacimiento");
      case "sexo":
        return validateRequired(value, "Sexo");
      case "estadoCivil":
        return validateRequired(value, "Estado Civil");
      case "nacionalidad":
        return validateRequired(value, "Nacionalidad");
      case "domicilioCalle":
        return validateRequired(value, "Domicilio Calle");
      case "telefono":
        return validateRequired(value, "Teléfono");
      case "email":
        return validateRequired(value, "eMail");
      // Accident data validation
      case "estaConsciente":
        return validateRequired(value, "¿Está Consciente?");
      case "color":
        return validateRequired(value, "Color");
      case "habla":
        return validateRequired(value, "¿Habla?");
      case "gravedad":
        return validateRequired(value, "Gravedad");
      case "respira":
        return validateRequired(value, "¿Respira?");
      case "tieneHemorragia":
        return validateRequired(value, "¿Tiene Hemorragia?");
      case "contextoDenuncia":
        return validateRequired(value, "Contexto de Denuncia");
      case "prestadorInicialCuit":
        return validateRequired(value, "CUIT Prestador Inicial");
      case "prestadorInicialRazonSocial":
        return validateRequired(value, "Razón Social Prestador");
      case "aceptoTerminos":
        if (!form.aceptoTerminos) return "Debe aceptar los términos y condiciones";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAllFields = (tabToValidate?: number): boolean => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    if (isDisabled) return true;

    const currentTab = tabToValidate !== undefined ? tabToValidate : activeTab;
    let fieldsToValidate: (keyof DenunciaFormData)[] = [];

    if (currentTab === 0) {
      // Validar campos del primer tab
      fieldsToValidate = [
        "telefonos", "apellidoNombres", "relacionAccidentado", 
        "tipoDenuncia", "fechaOcurrencia", "hora", "calle", "descripcion"
      ];
    } else if (currentTab === 1) {
      // Validar campos del segundo tab
      fieldsToValidate = [
        "cuil", "docTipo", "docNumero", "nombre", "fechaNac", 
        "sexo", "estadoCivil", "nacionalidad", "domicilioCalle", "telefono", "email"
      ];
    } else if (currentTab === 2) {
      // Validar campos del tercer tab
      fieldsToValidate = [
        "estaConsciente", "color", "habla", "gravedad", "respira", 
        "tieneHemorragia", "contextoDenuncia", "prestadorInicialCuit", "prestadorInicialRazonSocial"
      ];
    } else if (currentTab === 3) {
      // Validar campos del cuarto tab
      const aceptoTerminosError = form.aceptoTerminos ? undefined : "Debe aceptar los términos y condiciones";
      if (aceptoTerminosError) {
        newErrors.aceptoTerminos = aceptoTerminosError;
        hasErrors = true;
      }
    }

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
    // Validar el tab actual antes de avanzar
    if (validateAllFields(activeTab)) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevious = () => {
    setActiveTab(activeTab - 1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setForm(prev => ({
      ...prev,
      archivosAdjuntos: [...prev.archivosAdjuntos, ...files]
    }));
  };

  const handleFileRemove = (indexToRemove: number) => {
    const newFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
    setUploadedFiles(newFiles);
    setForm(prev => ({
      ...prev,
      archivosAdjuntos: newFiles
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: checked
    }));

    if (touched[name as keyof TouchedFields]) {
      const error = checked ? undefined : "Debe aceptar los términos y condiciones";
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
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
              disabled={activeTab < 1}
              sx={{ 
                backgroundColor: activeTab === 1 ? '#ff6600' : '#cccccc',
                color: activeTab === 1 ? 'white' : '#666',
                '&.Mui-selected': { color: 'white' }
              }}
            />
            <Tab 
              label="3. Datos del Siniestro" 
              disabled={activeTab < 2}
              sx={{ 
                backgroundColor: activeTab === 2 ? '#ff6600' : '#cccccc',
                color: activeTab === 2 ? 'white' : '#666',
                '&.Mui-selected': { color: 'white' }
              }}
            />
            <Tab 
              label="4. Confirmación" 
              disabled={activeTab < 3}
              sx={{ 
                backgroundColor: activeTab === 3 ? '#ff6600' : '#cccccc',
                color: activeTab === 3 ? 'white' : '#666',
                '&.Mui-selected': { color: 'white' }
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

            {/* TAB 2: DATOS DEL TRABAJADOR */}
            {activeTab === 1 && (
              <>
                {/* Trabajador */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Trabajador
                  </Typography>

                  <div className={styles.formRow}>
                    <TextField
                      label="Cuil"
                      name="cuil"
                      value={form.cuil}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("cuil")}
                      error={touched.cuil && !!errors.cuil}
                      helperText={touched.cuil && errors.cuil}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Ingrese CUIL"
                    />

                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.docTipo && !!errors.docTipo}
                      disabled={isDisabled}
                    >
                      <InputLabel>Doc Tipo</InputLabel>
                      <Select
                        name="docTipo"
                        value={form.docTipo}
                        label="Doc Tipo"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("docTipo")}
                      >
                        {TIPO_DOCUMENTO.map((tipo) => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.docTipo && errors.docTipo && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.docTipo}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      label="Doc Numero"
                      name="docNumero"
                      value={form.docNumero}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("docNumero")}
                      error={touched.docNumero && !!errors.docNumero}
                      helperText={touched.docNumero && errors.docNumero}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Número de documento"
                    />
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#ff6600', '&:hover': { backgroundColor: '#e55a00' } }}
                    >
                      🔍
                    </Button>

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
                      placeholder="Nombre completo"
                    />
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#ff6600', '&:hover': { backgroundColor: '#e55a00' } }}
                    >
                      🔍
                    </Button>
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Fecha Nac."
                      name="fechaNac"
                      type="date"
                      value={form.fechaNac}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("fechaNac")}
                      error={touched.fechaNac && !!errors.fechaNac}
                      helperText={touched.fechaNac && errors.fechaNac}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      label="Sexo"
                      name="sexo"
                      value={form.sexo}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("sexo")}
                      error={touched.sexo && !!errors.sexo}
                      helperText={touched.sexo && errors.sexo}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="M/F"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.estadoCivil && !!errors.estadoCivil}
                      disabled={isDisabled}
                    >
                      <InputLabel>Estado Civil</InputLabel>
                      <Select
                        name="estadoCivil"
                        value={form.estadoCivil}
                        label="Estado Civil"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("estadoCivil")}
                      >
                        {ESTADO_CIVIL.map((estado) => (
                          <MenuItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.estadoCivil && errors.estadoCivil && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.estadoCivil}
                        </Typography>
                      )}
                    </FormControl>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <TextField
                        label="Nacionalidad"
                        name="nacionalidad"
                        value={form.nacionalidad}
                        onChange={handleTextFieldChange}
                        onBlur={() => handleBlur("nacionalidad")}
                        error={touched.nacionalidad && !!errors.nacionalidad}
                        helperText={touched.nacionalidad && errors.nacionalidad}
                        required={!isDisabled}
                        disabled={isDisabled}
                        placeholder="200"
                        sx={{ width: '100px' }}
                      />
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: '#ff6600', '&:hover': { backgroundColor: '#e55a00' } }}
                      >
                        🔍
                      </Button>
                      <TextField
                        value="Argentina"
                        disabled
                        fullWidth
                        sx={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <TextField
                        label="Obra Social"
                        name="obraSocial"
                        value={form.obraSocial}
                        onChange={handleTextFieldChange}
                        fullWidth
                        disabled={isDisabled}
                        placeholder="Código obra social"
                      />
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: '#ff6600', '&:hover': { backgroundColor: '#e55a00' } }}
                      >
                        🔍
                      </Button>
                      <TextField
                        disabled
                        fullWidth
                        sx={{ flex: 2 }}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Domicilio Calle"
                      name="domicilioCalle"
                      value={form.domicilioCalle}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("domicilioCalle")}
                      error={touched.domicilioCalle && !!errors.domicilioCalle}
                      helperText={touched.domicilioCalle && errors.domicilioCalle}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Nombre de la calle"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Nro"
                      name="domicilioNro"
                      value={form.domicilioNro}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Número"
                    />
                    <TextField
                      label="Piso"
                      name="domicilioPiso"
                      value={form.domicilioPiso}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Piso"
                    />
                    <TextField
                      label="Dpto"
                      name="domicilioDpto"
                      value={form.domicilioDpto}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Depto"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Teléfono"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("telefono")}
                      error={touched.telefono && !!errors.telefono}
                      helperText={touched.telefono && errors.telefono}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Teléfono"
                    />

                    <TextField
                      label="eMail"
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
                      placeholder="email@ejemplo.com"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <TextField
                      label="Localidad"
                      name="localidad"
                      value={form.localidad}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Localidad"
                    />
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#ff6600', '&:hover': { backgroundColor: '#e55a00' } }}
                    >
                      🔍
                    </Button>
                    <TextField
                      disabled
                      fullWidth
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Cod Postal"
                      name="codPostalTrabajador"
                      value={form.codPostalTrabajador}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Código postal"
                    />
                  </div>
                </div>

                {/* Tabla de trabajadores relacionados */}
                <div className={styles.formSection}>
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    minHeight: '150px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Encabezados de la tabla */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr 1fr',
                      backgroundColor: '#ff6600',
                      color: 'white',
                      padding: '8px',
                      fontWeight: 'bold'
                    }}>
                      <div>Trabajador</div>
                      <div>Empresa</div>
                      <div>Período</div>
                      <div>Origen</div>
                    </div>
                    
                    {/* Contenido de la tabla (vacío por ahora) */}
                    <div style={{
                      backgroundColor: '#fffacd',
                      flex: 1,
                      minHeight: '120px'
                    }}>
                      {/* Aquí se mostrarían los trabajadores relacionados */}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: DATOS DEL SINIESTRO */}
            {activeTab === 2 && (
              <>
                {/* Estado del Trabajador */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Estado del Trabajador
                  </Typography>

                  <div className={styles.formRow}>
                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.estaConsciente && !!errors.estaConsciente}
                      disabled={isDisabled}
                    >
                      <InputLabel>¿Está Consciente?</InputLabel>
                      <Select
                        name="estaConsciente"
                        value={form.estaConsciente}
                        label="¿Está Consciente?"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("estaConsciente")}
                      >
                        <MenuItem value="Ignora">Ignora</MenuItem>
                        <MenuItem value="Si">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                      {touched.estaConsciente && errors.estaConsciente && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.estaConsciente}
                        </Typography>
                      )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.color && !!errors.color}
                      disabled={isDisabled}
                    >
                      <InputLabel>Color</InputLabel>
                      <Select
                        name="color"
                        value={form.color}
                        label="Color"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("color")}
                      >
                        {COLORES.map((color) => (
                          <MenuItem key={color.value} value={color.value}>
                            {color.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.color && errors.color && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.color}
                        </Typography>
                      )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.habla && !!errors.habla}
                      disabled={isDisabled}
                    >
                      <InputLabel>¿Habla?</InputLabel>
                      <Select
                        name="habla"
                        value={form.habla}
                        label="¿Habla?"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("habla")}
                      >
                        <MenuItem value="Ignora">Ignora</MenuItem>
                        <MenuItem value="Si">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                      {touched.habla && errors.habla && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.habla}
                        </Typography>
                      )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.gravedad && !!errors.gravedad}
                      disabled={isDisabled}
                    >
                      <InputLabel>Gravedad</InputLabel>
                      <Select
                        name="gravedad"
                        value={form.gravedad}
                        label="Gravedad"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("gravedad")}
                      >
                        <MenuItem value="Ignora">Ignora</MenuItem>
                        <MenuItem value="Leve">Leve</MenuItem>
                        <MenuItem value="Grave">Grave</MenuItem>
                        <MenuItem value="Critico">Crítico</MenuItem>
                      </Select>
                      {touched.gravedad && errors.gravedad && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.gravedad}
                        </Typography>
                      )}
                    </FormControl>
                  </div>

                  <div className={styles.formRow}>
                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.respira && !!errors.respira}
                      disabled={isDisabled}
                    >
                      <InputLabel>¿Respira?</InputLabel>
                      <Select
                        name="respira"
                        value={form.respira}
                        label="¿Respira?"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("respira")}
                      >
                        <MenuItem value="Ignora">Ignora</MenuItem>
                        <MenuItem value="Si">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                      {touched.respira && errors.respira && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.respira}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      label="Observaciones"
                      name="observaciones"
                      value={form.observaciones}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      multiline
                      rows={3}
                      placeholder="Observaciones del estado del trabajador"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.tieneHemorragia && !!errors.tieneHemorragia}
                      disabled={isDisabled}
                    >
                      <InputLabel>¿Tiene Hemorragia?</InputLabel>
                      <Select
                        name="tieneHemorragia"
                        value={form.tieneHemorragia}
                        label="¿Tiene Hemorragia?"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("tieneHemorragia")}
                      >
                        <MenuItem value="Ignora">Ignora</MenuItem>
                        <MenuItem value="Si">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                      {touched.tieneHemorragia && errors.tieneHemorragia && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.tieneHemorragia}
                        </Typography>
                      )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      required={!isDisabled}
                      error={touched.contextoDenuncia && !!errors.contextoDenuncia}
                      disabled={isDisabled}
                    >
                      <InputLabel>Contexto Denuncia</InputLabel>
                      <Select
                        name="contextoDenuncia"
                        value={form.contextoDenuncia}
                        label="Contexto Denuncia"
                        onChange={handleSelectChange}
                        onBlur={() => handleBlur("contextoDenuncia")}
                      >
                        <MenuItem value="Ignora">Ignora</MenuItem>
                        <MenuItem value="Urgente">Urgente</MenuItem>
                        <MenuItem value="Normal">Normal</MenuItem>
                      </Select>
                      {touched.contextoDenuncia && errors.contextoDenuncia && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.contextoDenuncia}
                        </Typography>
                      )}
                    </FormControl>
                  </div>
                </div>

                {/* ROAM */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    ROAM
                  </Typography>

                  <div className={styles.formRow}>
                    <FormControl fullWidth disabled={isDisabled}>
                      <InputLabel>ROAM</InputLabel>
                      <Select
                        name="roam"
                        value={form.roam}
                        label="ROAM"
                        onChange={handleSelectChange}
                      >
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="Si">Sí</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="ROAM Nro"
                      name="roamNro"
                      value={form.roamNro}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Número ROAM"
                    />

                    <TextField
                      label="ROAM Año"
                      name="roamAno"
                      value={form.roamAno}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Año ROAM"
                    />

                    <TextField
                      label="ROAM Código"
                      name="roamCodigo"
                      value={form.roamCodigo}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Código ROAM"
                    />
                  </div>
                </div>

                {/* Tipo de Traslado */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Tipo de Traslado
                  </Typography>

                  <div className={styles.formRow}>
                    <FormControl fullWidth disabled={isDisabled}>
                      <InputLabel>Tipo Traslado</InputLabel>
                      <Select
                        name="tipoTraslado"
                        value={form.tipoTraslado}
                        label="Tipo Traslado"
                        onChange={handleSelectChange}
                      >
                        {TIPOS_TRASLADO.map((tipo) => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Prestador Traslado"
                      name="prestadorTraslado"
                      value={form.prestadorTraslado}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      placeholder="Prestador de traslado"
                    />
                  </div>
                </div>

                {/* Prestador Inicial */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Prestador Inicial
                  </Typography>

                  <div className={styles.formRow}>
                    <TextField
                      label="CUIT Prestador Inicial"
                      name="prestadorInicialCuit"
                      value={form.prestadorInicialCuit}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("prestadorInicialCuit")}
                      error={touched.prestadorInicialCuit && !!errors.prestadorInicialCuit}
                      helperText={touched.prestadorInicialCuit && errors.prestadorInicialCuit}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="CUIT del prestador inicial"
                    />
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#ff6600', '&:hover': { backgroundColor: '#e55a00' } }}
                    >
                      🔍
                    </Button>

                    <TextField
                      label="Razón Social Prestador"
                      name="prestadorInicialRazonSocial"
                      value={form.prestadorInicialRazonSocial}
                      onChange={handleTextFieldChange}
                      onBlur={() => handleBlur("prestadorInicialRazonSocial")}
                      error={touched.prestadorInicialRazonSocial && !!errors.prestadorInicialRazonSocial}
                      helperText={touched.prestadorInicialRazonSocial && errors.prestadorInicialRazonSocial}
                      fullWidth
                      required={!isDisabled}
                      disabled={isDisabled}
                      placeholder="Razón social del prestador"
                    />
                  </div>
                </div>

                {/* Verificación de Contacto Inicial */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Verificación de Contacto Inicial
                  </Typography>

                  <div className={styles.formRow}>
                    <TextField
                      label="Verifica Contacto Inicial"
                      name="verificaContactoInicial"
                      value={form.verificaContactoInicial}
                      onChange={handleTextFieldChange}
                      fullWidth
                      disabled={isDisabled}
                      multiline
                      rows={2}
                      placeholder="Información de verificación del contacto inicial"
                    />
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: CONFIRMACIÓN */}
            {activeTab === 3 && (
              <>
                {/* Resumen de la Denuncia */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Resumen de la Denuncia
                  </Typography>
                  
                  <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Por favor, revise la información ingresada antes de enviar la denuncia.
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ff6600' }}>
                          Datos Iniciales
                        </Typography>
                        <Typography variant="body2">Teléfono: {form.telefonos}</Typography>
                        <Typography variant="body2">Contacto: {form.apellidoNombres}</Typography>
                        <Typography variant="body2">Fecha: {form.fechaOcurrencia}</Typography>
                        <Typography variant="body2">Hora: {form.hora}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ff6600' }}>
                          Datos del Trabajador
                        </Typography>
                        <Typography variant="body2">CUIL: {form.cuil}</Typography>
                        <Typography variant="body2">Nombre: {form.nombre}</Typography>
                        <Typography variant="body2">Documento: {form.docTipo} {form.docNumero}</Typography>
                        <Typography variant="body2">Email: {form.email}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </div>

                {/* Archivos Adjuntos */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Archivos Adjuntos
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <input
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      id="file-upload"
                      multiple
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isDisabled}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        disabled={isDisabled}
                        sx={{
                          borderColor: '#ff6600',
                          color: '#ff6600',
                          '&:hover': {
                            borderColor: '#e55a00',
                            backgroundColor: '#fff3e0'
                          }
                        }}
                      >
                        📎 Seleccionar Archivos
                      </Button>
                    </label>
                  </Box>

                  {uploadedFiles.length > 0 && (
                    <Paper elevation={1} sx={{ maxHeight: 200, overflow: 'auto' }}>
                      <List dense>
                        {uploadedFiles.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={file.name}
                              secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleFileRemove(index)}
                                disabled={isDisabled}
                                sx={{ color: '#ff6600' }}
                              >
                                ❌
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Formatos permitidos: PDF, DOC, DOCX, JPG, JPEG, PNG. Tamaño máximo: 10MB por archivo.
                  </Typography>
                </div>

                {/* Términos y Condiciones */}
                <div className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Términos y Condiciones
                  </Typography>
                  
                  <Paper elevation={1} sx={{ p: 2, mb: 2, maxHeight: 200, overflow: 'auto', backgroundColor: '#f8f9fa' }}>
                    <Typography variant="body2" paragraph>
                      <strong>TÉRMINOS Y CONDICIONES PARA EL REGISTRO DE DENUNCIAS</strong>
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      1. La información proporcionada es verídica y completa según mi conocimiento.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      2. Autorizo el tratamiento de los datos personales conforme a la Ley 25.326 de Protección de Datos Personales.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      3. Entiendo que proporcionar información falsa puede tener consecuencias legales.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      4. Acepto que ART puede contactarme para verificar o solicitar información adicional.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      5. Los archivos adjuntos son relevantes al siniestro reportado y no contienen información confidencial de terceros.
                    </Typography>
                  </Paper>

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="aceptoTerminos"
                        checked={form.aceptoTerminos}
                        onChange={handleCheckboxChange}
                        onBlur={() => handleBlur("aceptoTerminos")}
                        disabled={isDisabled}
                        sx={{
                          color: '#ff6600',
                          '&.Mui-checked': {
                            color: '#ff6600'
                          }
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        <strong>Acepto los términos y condiciones</strong> *
                      </Typography>
                    }
                  />
                  
                  {touched.aceptoTerminos && errors.aceptoTerminos && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                      {errors.aceptoTerminos}
                    </Typography>
                  )}
                </div>

                {/* Información Adicional */}
                <div className={styles.formSection}>
                  <Paper elevation={1} sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1565c0' }}>
                      ℹ️ Información Importante
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      • Una vez enviada la denuncia, recibirá un número de seguimiento.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      • Puede consultar el estado de su denuncia en cualquier momento.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      • Si necesita adjuntar documentos adicionales, puede hacerlo posteriormente.
                    </Typography>
                    
                    <Typography variant="body2">
                      • Para consultas urgentes, comuníquese al: <strong>0800-XXX-XXXX</strong>
                    </Typography>
                  </Paper>
                </div>
              </>
            )}

            {/* Botones de navegación */}
            <div className={styles.formActions}>
              {activeTab > 0 && !isViewing && (
                <CustomButton
                  onClick={handlePrevious}
                  color="secondary"
                  sx={{ 
                    backgroundColor: '#6c757d', 
                    '&:hover': { backgroundColor: '#5a6268' },
                    minWidth: '120px'
                  }}
                  disabled={isSubmitting}
                >
                  ‹ Anterior
                </CustomButton>
              )}

              {activeTab < 3 && !isViewing && (
                <CustomButton
                  onClick={handleNext}
                  color="primary"
                  sx={{ 
                    backgroundColor: '#ff6600', 
                    '&:hover': { backgroundColor: '#e55a00' },
                    minWidth: '120px'
                  }}
                  disabled={isSubmitting}
                >
                  Siguiente ›
                </CustomButton>
              )}

              {activeTab === 3 && !isViewing && (
                <CustomButton
                  type="submit"
                  color="primary"
                  sx={{ 
                    backgroundColor: '#28a745', 
                    '&:hover': { backgroundColor: '#218838' },
                    minWidth: '120px'
                  }}
                  disabled={isSubmitting || !form.aceptoTerminos}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Enviando...
                    </>
                  ) : (
                    '✓ Enviar Denuncia'
                  )}
                </CustomButton>
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
