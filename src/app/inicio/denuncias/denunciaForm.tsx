"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from '@/data/AuthContext';
import Formato from '@/utils/Formato';
import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import styles from "./denuncias.module.css";
import { SelectChangeEvent } from "@mui/material/Select";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import { DenunciaFormData, initialDenunciaFormData, TIPO_DOCUMENTO, ESTADO_CIVIL, COLORES, TIPOS_TRASLADO, Props, RequestMethod, ValidationErrors, TouchedFields } from "./types/tDenuncias";
import DatosIniciales from "./datosIniciales/datosIniciales";
import DatosTrabajador from "./datosTrabajador/datosTrabajador";
import DatosSiniestro from "./datosSiniestro/datosSiniestro";
import ConfirmacionDenuncia from "./confirmacion/confirmacion";
import DatosEmpleador from "./datosEmpleador/datosEmpleador";
import CustomTab from "@/utils/ui/tab/CustomTab";
import ArtAPI from "@/data/artAPI";


export default function DenunciaForm({
  open,
  onClose,
  onSubmit,
  initialData,
  errorMsg,
  method,
  isSubmitting = false,
  onValidationError,
}: Props) {
  const [form, setForm] = useState<DenunciaFormData>(initialDenunciaFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [activeTab, setActiveTab] = useState(0);
  const [maxVisitedTab, setMaxVisitedTab] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const lastFetchedEmpCuitRef = useRef<string>("");
  const lastAutoValuesRef = useRef<Record<string, string>>({});
  const { user } = useAuth();
  const [empCuitReadOnly, setEmpCuitReadOnly] = useState(false);

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
    setActiveTab(0);
    setMaxVisitedTab(0);
  }, [initialData, open]);

  useEffect(() => {
    const empresaCUIT = Number((user as any)?.empresaCUIT ?? 0);
    if (empresaCUIT && empresaCUIT > 0) {
      const digits = String(empresaCUIT);
      const formatted = Formato.CUIP(digits);
      setForm((prev) => ({ ...prev, empCuit: formatted }));
      setEmpCuitReadOnly(true);
      lastFetchedEmpCuitRef.current = "";
    } else {
      setEmpCuitReadOnly(false);
    }
  }, [user]);

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

  // Autocompletar datos del empleador a partir del CUIT ingresado
  useEffect(() => {
    // Aceptar empCuit formateado (CUIP). Extraer sólo dígitos para validar y buscar.
    const rawCuitDigits = String(form.empCuit || "").replace(/\D/g, "");

    if (!rawCuitDigits || rawCuitDigits.length !== 11) {
      return;
    }

    // Si ya consultamos este CUIT (mismos 11 dígitos), no repetir la petición
    if (lastFetchedEmpCuitRef.current === rawCuitDigits) return;

    let cancelled = false;

    const fetchEmpresa = async () => {
      try {
        const empresa: any = await ArtAPI.getEmpresaByCUIT({ CUIT: Number(rawCuitDigits) });
        if (!empresa || cancelled) return;

        setForm((prev) => {
          const newVals: Record<string, string> = {
            empPoliza: String(empresa.polizaNro ?? empresa.poliza ?? ""),
            empRazonSocial: String(empresa.razonSocial ?? empresa.RazonSocial ?? ""),
            empDomicilioCalle: String(empresa.domicilioCalle ?? empresa.domicilio ?? empresa.calle ?? empresa.Calle ?? ""),
            empDomicilioNro: String(empresa.domicilioNro ?? empresa.domicilioNroEmpresa ?? empresa.numero ?? empresa.Numero ?? ""),
            empDomicilioPiso: String(empresa.domicilioPiso ?? ""),
            empDomicilioDpto: String(empresa.domicilioDpto ?? ""),
            empDomicilioEntreCalle1: String(empresa.domicilioEntreCalle1 ?? ""),
            empDomicilioEntreCalle2: String(empresa.domicilioEntreCalle2 ?? ""),
            empCodLocalidad: String(empresa.codLocalidadSrt ?? empresa.codLocalidad ?? empresa.localidadCodigo ?? ""),
            empCodPostal: String(empresa.codLocalidadPostal ?? empresa.cp ?? empresa.codigoPostal ?? ""),
            empTelefonos: String(empresa.telefonos ?? empresa.telefono ?? empresa.Telefono ?? ""),
            empEmail: String(empresa.eMail ?? empresa.email ?? empresa.Email ?? ""),
          };

          const updated: Partial<DenunciaFormData> = {};
          const lastAuto = lastAutoValuesRef.current || {};

          (Object.keys(newVals) as Array<keyof DenunciaFormData>).forEach((k) => {
            const key = k as string;
            const prevVal = String((prev as any)[key] ?? "");
            const newVal = newVals[key] ?? "";
            const lastAutoVal = lastAuto[key] ?? "";
            if (!prevVal || prevVal === lastAutoVal) {
              (updated as any)[key] = newVal;
            }
          });

          // Actualizar referencia de últimos valores autocompletados
          lastAutoValuesRef.current = newVals;

          return {
            ...prev,
            ...updated,
          } as DenunciaFormData;
        });

        // Recordar que ya consultamos este CUIT
        lastFetchedEmpCuitRef.current = rawCuitDigits;
      } catch (e) {
        console.warn("No se pudo obtener la empresa por CUIT", e);
      }
    };

    fetchEmpresa();

    return () => {
      cancelled = true;
    };
  }, [form.empCuit]);

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
      case "nro":
        return validateRequired(value, "Número");
      case "codLocalidad":
        return validateRequired(value, "Código de Localidad");
      case "codPostal":
        return validateRequired(value, "Código Postal");
      case "empCuit":
        {
          const digits = String(value || "").replace(/\D/g, "");
          if (!digits) return "CUIT es requerido";
          if (digits.length !== 11) return "CUIT debe contener 11 dígitos";
          return undefined;
        }
      case "empPoliza":
        return undefined;
      case "empRazonSocial":
        return undefined;
      case "empDomicilioCalle":
        return undefined;
      case "empDomicilioNro":
        return undefined;
      case "empDomicilioPiso":
        return undefined;
      case "empDomicilioDpto":
        return undefined;
      case "empDomicilioEntreCalle1":
        return undefined;
      case "empDomicilioEntreCalle2":
        return undefined;
      case "empCodLocalidad":
        return undefined;
      case "empCodPostal":
        return undefined;
      case "empTelefonos":
        return undefined;
      case "empEmail":
        return undefined;
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
      // Nuevo tab: Datos del Empleador -> solo CUIT es requerido en esta pestaña
      fieldsToValidate = [
        "empCuit",
      ];
    } else if (currentTab === 4) {
      // Validar campos del quinto tab (Confirmación)
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
    // Permitir navegación libre entre pestañas
    setActiveTab(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDeleting) {
      onSubmit(form, { final: false });
      return;
    }

    const allTouched: TouchedFields = Object.keys(form).reduce((acc, key) => {
      acc[key as keyof TouchedFields] = true;
      return acc;
    }, {} as TouchedFields);
    setTouched(allTouched);

    console.log('DenunciaForm.handleSubmit invoked', {
      method,
      activeTab,
      isDeleting,
      aceptoTerminos: form.aceptoTerminos,
    });

    // Validar todas las solapas antes del envío final
    const allTabsValid = [0, 1, 2, 3, 4].every((tabIndex) => validateAllFields(tabIndex));
    console.log('DenunciaForm.validateAllFields (all tabs) result:', allTabsValid, { errors });

    if (allTabsValid) {
      console.log('DenunciaForm calling onSubmit with form (final):', form);
      onSubmit(form, { final: true });
    } else {
      console.warn('DenunciaForm validation failed, not submitting');
      if (onValidationError) {
        onValidationError(
          'Faltan completar datos obligatorios de la denuncia. Por favor revise todas las solapas antes de enviar.'
        );
      }
    }
  };

  const handleSaveDraft = () => {
    // Guardar borrador
    console.log('DenunciaForm saving draft with form:', form);
    onSubmit(form, { final: false });
  };

  const handleNext = () => {
    if (validateAllFields(activeTab)) {
      const next = activeTab + 1;
      setActiveTab(next);
      setMaxVisitedTab((prev) => Math.max(prev, next));
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

        <div className={styles.formLayout}>
          <div className={styles.formContent}>
            <CustomTab
              currentTab={activeTab}
              onTabChange={handleTabChange}
              tabs={[
                {
                  label: "1. Datos Iniciales",
                  value: 0,
                  disabled: false,
                  content: (
                    <DatosIniciales
                      form={form}
                      errors={errors}
                      touched={touched}
                      isDisabled={isDisabled}
                      isEditing={isEditing}
                      onTextFieldChange={handleTextFieldChange}
                      onSelectChange={handleSelectChange}
                      onBlur={handleBlur}
                    />
                  ),
                },
                {
                  label: "2. Datos del Trabajador",
                  value: 1,
                  disabled: false,
                  content: (
                    <DatosTrabajador
                      form={form}
                      errors={errors}
                      touched={touched}
                      isDisabled={isDisabled}
                      isEditing={isEditing}
                      onTextFieldChange={handleTextFieldChange}
                      onSelectChange={handleSelectChange}
                      onBlur={handleBlur}
                    />
                  ),
                },
                {
                  label: "3. Datos del Siniestro",
                  value: 2,
                  disabled: false,
                  content: (
                    <DatosSiniestro
                      form={form}
                      errors={errors}
                      touched={touched}
                      isDisabled={isDisabled}
                      isEditing={isEditing}
                      onTextFieldChange={handleTextFieldChange}
                      onSelectChange={handleSelectChange}
                      onBlur={handleBlur}
                    />
                  ),
                },
                {
                  label: "4. Datos del Empleador",
                  value: 3,
                  disabled: false,
                  content: (
                    <DatosEmpleador
                      form={form}
                      errors={errors}
                      touched={touched}
                      isDisabled={isDisabled}
                      isEditing={isEditing}
                      readonlyEmpCuit={empCuitReadOnly}
                      onTextFieldChange={handleTextFieldChange}
                      onSelectChange={handleSelectChange}
                      onBlur={handleBlur}
                    />
                  ),
                },
                {
                  label: "5. Confirmación",
                  value: 4,
                  disabled: false,
                  content: (
                    <ConfirmacionDenuncia
                      form={form}
                      isDisabled={isDisabled}
                      uploadedFiles={uploadedFiles}
                      errors={{ aceptoTerminos: errors.aceptoTerminos }}
                      touched={{ aceptoTerminos: touched.aceptoTerminos }}
                      onFileUpload={handleFileUpload}
                      onFileRemove={handleFileRemove}
                      onCheckboxChange={handleCheckboxChange}
                      onBlur={handleBlur}
                    />
                  ),
                },
              ]}
            />
            

            {/* Botones de navegación */}
            <div className={styles.formActions}>
              {activeTab > 0 && !isViewing && (
                <CustomButton
                  onClick={handlePrevious}
                  color="secondary"
                  className={styles.btnPrev}
                  disabled={isSubmitting}
                >
                   Anterior
                </CustomButton>
              )}

              {activeTab < 4 && !isViewing && (
                <CustomButton
                  onClick={handleNext}
                  color="primary"
                  className={styles.btnNext}
                  disabled={isSubmitting}
                >
                  Siguiente
                </CustomButton>
              )}

              {activeTab === 4 && !isViewing && (
                <CustomButton
                  type="submit"
                  color="primary"
                  className={styles.btnSubmit}
                  disabled={isSubmitting || !form.aceptoTerminos}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} className={styles.btnSpinner} />
                      Enviando...
                    </>
                  ) : (
                    '✓ Enviar Denuncia'
                  )}
                </CustomButton>
              )}

              {!isViewing && (
                <CustomButton
                  onClick={handleSaveDraft}
                  color="secondary"
                  className={styles.btnSaveDraft}
                  disabled={isSubmitting}
                >
                  Guardar borrador
                </CustomButton>
              )}

              <CustomButton
                onClick={onClose}
                color="secondary"
                disabled={isSubmitting}
                className={styles.cancelButton}
              >
                Cancelar
              </CustomButton>
            </div>
          </div>
        </div>
      </Box>
    </CustomModal>
  );
}
