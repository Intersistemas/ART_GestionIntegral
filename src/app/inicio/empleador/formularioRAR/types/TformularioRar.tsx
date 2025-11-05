/* Tipos (para datos de la tabla) */
export type FormularioRAR = {
  InternoFormularioRAR: number;
  CUIT: string;
  RazonSocial: string;
  Establecimiento: string;
  CantTrabExpuestos: number;
  CantTrabNoExpuestos: number;
  Estado: string;
  FechaHoraCreacion: string;
  FechaHoraConfirmado: string;
};

export type ParametersFormularioRar = {
  CUIT?: number;
  FechaPresentacion?: string;
  RefEstablecimientoId?: number;
  PageIndex?: number;
  PageSize?: number;
  OrderBy?: string;
};

export default FormularioRAR;