import type { ApiFormularioRGRL, ApiEstablecimientoEmpresa } from '@/app/inicio/empleador/formularioRGRL/types/rgrl';

const BASE = process.env.NEXT_PUBLIC_API_RGRL_URL || 'http://arttest.intersistemas.ar:8302';

export const getFormulariosRGRL = async (cuit: number, all: boolean = false): Promise<ApiFormularioRGRL[]> => {
  let url = `${BASE}/api/FormulariosRGRL?CUIT=${encodeURIComponent(cuit)}`;
  // Si se solicita 'all', pedimos un pageSize alto para evitar la paginación por defecto del backend
  if (all) url += `&pageSize=99999`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
  if (res.status === 404) return [];
  if (!res.ok) {
    const raw = await res.text().catch(() => '');
    throw new Error(`GET ${url} -> ${res.status} ${raw}`);
  }
  const body = await res.json().catch(() => null);
  const arr = Array.isArray(body?.DATA) ? body.DATA : Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
  return arr as ApiFormularioRGRL[];
};

export const getEstablecimientosEmpresa = async (cuit: number): Promise<ApiEstablecimientoEmpresa[]> => {
  const url = `${BASE}/api/Establecimientos/Empresa/${encodeURIComponent(cuit)}`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
  if (res.status === 404) return [];
  if (!res.ok) {
    const raw = await res.text().catch(() => '');
    throw new Error(`GET ${url} -> ${res.status} ${raw}`);
  }
  return (await res.json()) as ApiEstablecimientoEmpresa[];
};

/**
 * Formatea la etiqueta de un establecimiento como:
 * "{nroSucursal} + {domicilioNro}" (sin código de empresa)
 * Si algún campo falta, se sustituye por cadena vacía.
 */
export const formatEstablecimientoLabel = (est?: Partial<ApiEstablecimientoEmpresa> | null): string => {
  if (!est) return '';
  const nroSucursal =
    (est as any).nroSucursal ?? (est as any).NroSucursal ?? (est as any).nroSucursalEmpresa ?? (est as any).sucursal ?? '';
  const domicilioCalle =
    (est as any).domicilioCalle ?? (est as any).domicilio ?? (est as any).calle ?? (est as any).direccion ?? '';
  const domicilioNro =
    (est as any).domicilioNro ?? (est as any).domicilioNroEmpresa ?? (est as any).domicilioNroString ?? (est as any).domicilioNroStr ?? (est as any).domicilioNumero ?? '';

  const domicilio = `${String(domicilioCalle || '').trim()} ${String(domicilioNro || '').trim()}`.trim();

  // Construir la línea con separadores ' - ' pero omitir partes vacías
  const parts: string[] = [];
  parts.push(String(nroSucursal));
  parts.push(domicilio);

  // Reemplazar elementos vacíos por cadena vacía y luego filtrar
  const filled = parts.map(p => (p && p !== 'undefined' && p !== 'null' ? p : '')).filter(p => p && p.trim().length > 0);
  if (filled.length === 0) return '';
  return `Sucursal: ${filled.join(' - ')}`;
};

const rgrlAPI = { getFormulariosRGRL, getEstablecimientosEmpresa, formatEstablecimientoLabel };
export default rgrlAPI;
