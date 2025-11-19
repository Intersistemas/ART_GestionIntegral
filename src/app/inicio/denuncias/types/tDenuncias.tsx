// Interface for detailed incident/accident report
export type DenunciaCreate = {
  // Denuncia/Siniestro Information
  denunciaNro: number;
  siniestroNro: number;
  siniestroTipo: string;
  
  // Employer Information (emp)
  empCuit: number;
  empPoliza: number;
  empRazonSocial: string;
  empCiiu: number;
  empDomicilioCalle: string;
  empDomicilioNro: string;
  empDomicilioPiso: string;
  empDomicilioDpto: string;
  empDomicilioEntreCalle1: string;
  empDomicilioEntreCalle2: string;
  empCodLocalidad: string;
  empCodPostal: number;
  empTelefonos: string;
  empeMail: string;
  
  // Employer Occurrence Information (empOc)
  empOcCuit: number;
  empOcRazonSocial: string;
  empOcEstablecimiento: string;
  empOcCiiu: number;
  empOcDomicilioCalle: string;
  empOcDomicilioNro: string;
  empOcDomicilioPiso: string;
  empOcDomicilioDpto: string;
  empOcDomicilioEntreCalle1: string;
  empOcDomicilioEntreCalle2: string;
  empOcCodLocalidad: string;
  empOcCodPostal: number;
  empOcSubContrato: string;
  empOcTelefonos: string;
  empOceMail: string;
  
  // Employer Establishment Information (empEst)
  empEstCuit: number;
  empEstRazonSocial: string;
  empEstEstablecimiento: string;
  empEstCiiu: number;
  empEstDomicilioCalle: string;
  empEstDomicilioNro: string;
  empEstDomicilioPiso: string;
  empEstDomicilioDpto: string;
  empEstDomicilioEntreCalle1: string;
  empEstDomicilioEntreCalle2: string;
  empEstCodLocalidad: string;
  empEstCodPostal: number;
  empEstTelefonos: string;
  empEsteMail: string;
  
  // Provider Information
  prestadorCuit: number;
  
  // Affiliate (Worker) Information (afi)
  afiCuil: number;
  afiDocTipo: string;
  afiDocNumero: number;
  afiNombre: string;
  afiFechaNacimiento: number;
  afiSexo: string;
  afiEstadoCivil: string;
  afiNacionalidad: number;
  afiDomicilioCalle: string;
  afiDomicilioNro: string;
  afiDomicilioPiso: string;
  afiDomicilioDpto: string;
  afiDomicilioEntreCalle1: string;
  afiDomicilioEntreCalle2: string;
  afiCodLocalidad: string;
  afiCodPostal: number;
  afieMail: string;
  afiTelefono: string;
  afiObraSocial: string;
  
  // Additional Information
  comentario: string;
  origenIngreso: string;
  trasladoTipo: string;
  avisoTrabajadorFueraNomina: boolean | null;
  avisoEmpleadorSinContratoVigente: boolean | null;
  estado: number;
  denunciaCanalIngresoInterno: number;
}

// Formulario de Denuncia de Siniestro - Tipos basados en las imágenes
export interface DenunciaFormData {
  // Paso 1: Datos Iniciales
  // Contacto Inicial
  telefonos: string;
  apellidoNombres: string;
  relacionAccidentado: string;
  
  // Información del Siniestro
  tipoDenuncia: 'AccidenteTrabajo' | 'Enfermedad' | '';
  tipoSiniestro: string;
  enViaPublica: 'Si' | 'No' | '';
  
  // Accidente de Trabajo
  fechaOcurrencia: string;
  hora: string;
  calle: string;
  nro: string;
  piso: string;
  dpto: string;
  entreCalle: string;
  entreCalleY: string;
  descripcion: string;
  codLocalidad: string;
  codPostal: string;
  
  // Paso 2: Datos del Trabajador
  cuil: string;
  docTipo: string;
  docNumero: string;
  nombre: string;
  fechaNac: string;
  sexo: string;
  estadoCivil: string;
  nacionalidad: string;
  obraSocial: string;
  domicilioCalle: string;
  domicilioNro: string;
  domicilioPiso: string;
  domicilioDpto: string;
  telefono: string;
  email: string;
  localidad: string;
  codPostalTrabajador: string;
  
  // Trabajadores relacionados (tabla)
  trabajadoresRelacionados: TrabajadorRelacionado[];
  
  // Paso 3: Datos del Siniestro (Estado del Trabajador)
  estaConsciente: 'Ignora' | 'Si' | 'No' | '';
  color: string;
  habla: 'Ignora' | 'Si' | 'No' | '';
  gravedad: 'Ignora' | 'Leve' | 'Grave' | 'Critico' | '';
  respira: 'Ignora' | 'Si' | 'No' | '';
  observaciones: string;
  tieneHemorragia: 'Ignora' | 'Si' | 'No' | '';
  contextoDenuncia: 'Ignora' | 'Urgente' | 'Normal' | '';
  
  // ROAM
  roam: 'No' | 'Si' | '';
  roamNro: string;
  roamAno: string;
  roamCodigo: string;
  
  // Tipo de Traslado
  tipoTraslado: string;
  prestadorTraslado: string;
  
  // Prestador Inicial
  prestadorInicialCuit: string;
  prestadorInicialRazonSocial: string;
  
  // Verificación de Contacto Inicial
  verificaContactoInicial: string;
  
  // Paso 4: Confirmación
  // Archivos adjuntos
  archivosAdjuntos: File[];
  
  // Aceptación de términos
  aceptoTerminos: boolean;
}

export interface TrabajadorRelacionado {
  trabajador: string;
  empresa: string;
  periodo: string;
  origen: string;
}

// Opciones para dropdowns
export const TIPO_DOCUMENTO = [
  { value: 'DNI', label: 'DNI' },
  { value: 'LC', label: 'LC' },
  { value: 'LE', label: 'LE' },
  { value: 'CI', label: 'CI' },
  { value: 'PASAPORTE', label: 'Pasaporte' }
];

export const ESTADO_CIVIL = [
  { value: 'SOLTERO', label: 'Soltero/a' },
  { value: 'CASADO', label: 'Casado/a' },
  { value: 'DIVORCIADO', label: 'Divorciado/a' },
  { value: 'VIUDO', label: 'Viudo/a' },
  { value: 'CONCUBINATO', label: 'Concubinato' }
];

export const RELACION_ACCIDENTADO = [
  { value: 'TRABAJADOR', label: 'Trabajador' },
  { value: 'FAMILIAR', label: 'Familiar' },
  { value: 'EMPLEADOR', label: 'Empleador' },
  { value: 'COMPAÑERO', label: 'Compañero de Trabajo' },
  { value: 'TESTIGO', label: 'Testigo' },
  { value: 'OTRO', label: 'Otro' }
];

export const COLORES = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'PALIDO', label: 'Pálido' },
  { value: 'CIANÓTICO', label: 'Cianótico' },
  { value: 'RUBICUNDO', label: 'Rubicundo' }
];

export const TIPOS_TRASLADO = [
  { value: 'AMBULANCIA', label: 'Ambulancia' },
  { value: 'VEHICULO_PARTICULAR', label: 'Vehículo Particular' },
  { value: 'TRANSPORTE_PUBLICO', label: 'Transporte Público' },
  { value: 'A_PIE', label: 'A Pie' },
  { value: 'NO_REQUIERE', label: 'No Requiere Traslado' }
];

// Estado inicial del formulario
export const initialDenunciaFormData: DenunciaFormData = {
  // Paso 1
  telefonos: '',
  apellidoNombres: '',
  relacionAccidentado: '',
  tipoDenuncia: '',
  tipoSiniestro: '',
  enViaPublica: '',
  fechaOcurrencia: '',
  hora: '',
  calle: '',
  nro: '',
  piso: '',
  dpto: '',
  entreCalle: '',
  entreCalleY: '',
  descripcion: '',
  codLocalidad: '',
  codPostal: '',
  
  // Paso 2
  cuil: '',
  docTipo: '',
  docNumero: '',
  nombre: '',
  fechaNac: '',
  sexo: '',
  estadoCivil: '',
  nacionalidad: '200', // Argentina por defecto
  obraSocial: '',
  domicilioCalle: '',
  domicilioNro: '',
  domicilioPiso: '',
  domicilioDpto: '',
  telefono: '',
  email: '',
  localidad: '',
  codPostalTrabajador: '',
  trabajadoresRelacionados: [],
  
  // Paso 3
  estaConsciente: '',
  color: '',
  habla: '',
  gravedad: '',
  respira: '',
  observaciones: '',
  tieneHemorragia: '',
  contextoDenuncia: '',
  roam: '',
  roamNro: '',
  roamAno: '',
  roamCodigo: '',
  tipoTraslado: '',
  prestadorTraslado: '',
  prestadorInicialCuit: '',
  prestadorInicialRazonSocial: '',
  verificaContactoInicial: '',
  
  // Paso 4
  archivosAdjuntos: [],
  aceptoTerminos: false
};

export type DenunciaGetAll = {
  // Denuncia/Siniestro Information
  interno: number;
  denunciaNro: number;
  siniestroNro: number;
  siniestroTipo: string;
  empCuit: number;
  empPoliza: number;
  empRazonSocial: string;
};

export type DenunciaQueryParams = {
  Estado?: number;
  PageIndex?: number;
  PageSize?: number;
};

// API Response type for paginated denuncias
export type DenunciasApiResponse = {
  data: DenunciaGetAll[];
  count?: number;
  pages: number;
  size: number;
};