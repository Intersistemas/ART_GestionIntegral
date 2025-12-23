/**
 * Tipos compartidos para el módulo de cotizaciones
 */

import { CIIUIndicesDTO, ARTSellosIIBBDTO, EmpleadoresPadronDTO, CotizacionesDTO } from '@/data/cotizadorAPI';

export type CotizadorFormData = {
  cuit: string;
  jurisdiccion: number | '';
  ciiuPrincipal: string;
  ciiuSecundario1: string;
  ciiuSecundario2: string;
  actividadCotizacion: string;
  trabajadoresDeclarados: string;
  masaSalarial: string;
  nombre: string;
  email: string;
  tipoTel: string;
  numeroTelefono: string;
  alicuota: string;
  empresaNueva: boolean;
};

export type CotizadorPDFFormData = {
  nombre: string;
  cuit: string;
  trabajadoresDeclarados: string;
  masaSalarial: string;
  actividadCotizacion: string;
  alicuota: string;
};

export type CotizadorPDFContentProps = {
  resultado: CotizacionesDTO;
  formData: CotizadorPDFFormData;
  actividadesCIIU?: CIIUIndicesDTO[];
  artSellosIIBB?: ARTSellosIIBBDTO[];
  empleadoresPadron?: EmpleadoresPadronDTO | null;
  ffepImporte?: number;
};

export type CotizacionResultadoState = {
  open: boolean;
  resultado: CotizacionesDTO | null;
  esSolicitud: boolean;
  error: string | null;
};

