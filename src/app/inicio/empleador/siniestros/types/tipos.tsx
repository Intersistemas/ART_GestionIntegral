// Fila principal de la tabla de siniestros
export type SiniestroItem = {
  denunciaNro: number;
  siniestroNro: number | string;
  empCUIT?: number | string;
  trabCUIL: number | string;
  trabNombre: string;
  establecimiento: string;
  tipoSiniestro: string;
  siniestroFechaHora?: string | null;
  diagnostico?: string | null;
  siniestroCategoria?: string | null;
  proximoControlMedicoFechaHora?: string | null;
  prestador?: string | null;
  altaMedicaFecha?: string | null;
};

// Instancias (detalle inferior)
export type InstanciaSiniestro = {
  denunciaNro: number;
  fechaHoraInstancia: string | null;
  tipoInstancia: string | null;
  comentarioInstancia: string | null;
  estadoInstancia: string | null;
  proximoControlMedicoFechaHora: string | null;
};

// Props del componente de tabla de instancias
export type InstanciasTablaProps = {
  rows: InstanciaSiniestro[];
  loading?: boolean;
  hasAny?: boolean;
};
