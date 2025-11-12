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