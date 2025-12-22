import { EmpleadoresPadronDTO, CIIUIndicesDTO, EmpleadoresPESEDTO, EmpleadoresSiniestrosDTO } from '@/data/cotizadorAPI';

/**
 * Valida si alguna de las actividades del CUIT tiene alta siniestralidad
 */
export const tieneActividadesSiniestras = (
  actividadesCIIU: CIIUIndicesDTO[] | undefined,
  ciiuPrincipal: string | number | null | undefined,
  ciiuSecundario1: string | number | null | undefined,
  ciiuSecundario2: string | number | null | undefined
): boolean => {
  if (!actividadesCIIU || actividadesCIIU.length === 0) return false;

  const actividades = [ciiuPrincipal, ciiuSecundario1, ciiuSecundario2]
    .filter(act => act !== null && act !== undefined && act !== '')
    .map(act => typeof act === 'string' ? Number(act) : act);

  return actividades.some(actividadCIIU => {
    const actividad = actividadesCIIU.find(a => a.ciiu === actividadCIIU);
    return actividad?.altaSiniestralidad === true;
  });
};

/**
 * Determina si el botón debe mostrar "SOLICITAR" en lugar de "COTIZAR"
 * basado en las condiciones de negocio
 */
export const debeSolicitar = (params: {
  empleadoresPadron: EmpleadoresPadronDTO | null | undefined;
  trabajadoresDeclarados: number | string;
  alicuotaIngresada: number | string;
  validacionPESE: EmpleadoresPESEDTO[] | null | undefined;
  actividadesSiniestras: boolean;
  indiceSiniestralidad: number | null | undefined;
}): boolean => {
  const {
    empleadoresPadron,
    trabajadoresDeclarados,
    alicuotaIngresada,
    validacionPESE,
    actividadesSiniestras,
    indiceSiniestralidad,
  } = params;

  const trabajadores = typeof trabajadoresDeclarados === 'string' 
    ? parseFloat(trabajadoresDeclarados) || 0 
    : trabajadoresDeclarados || 0;

  const alicuota = typeof alicuotaIngresada === 'string'
    ? parseFloat(alicuotaIngresada) || 0
    : alicuotaIngresada || 0;

  // Condiciones para solicitar
  if (!!empleadoresPadron?.juicios && trabajadores > 3) return true;
  if (!!empleadoresPadron?.muertes && trabajadores > 3) return true;
  if (alicuota === 0 && (empleadoresPadron?.idEmpleadorPadron ?? 0) > 0) return true;
  if (validacionPESE != null && validacionPESE.length > 0) return true;
  if (trabajadores > 20) return true;
  if (actividadesSiniestras && trabajadores > 3 && trabajadores < 21) return true;
  if ((indiceSiniestralidad ?? 0) > 60) return true;

  return false;
};

