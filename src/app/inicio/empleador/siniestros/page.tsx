'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import gestionEmpleadorAPI from '@/data/gestionEmpleadorAPI';
import { token } from '@/data/usuarioAPI';
import type { Parameters } from '@/app/inicio/empleador/cobertura/types/persona';

import DataTable from '@/utils/ui/table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';

// 👇 IMPORTA el componente de abajo (tu tabla) con el TIPO correcto
import CondicionesTabla, { type InstanciaSiniestro } from './table';

/* ===== Tipos (lista superior) ===== */
type SiniestroItem = {
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

/* ===== Helpers (solo para la grilla superior) ===== */
const fmtDateTime = (v?: string | null) => {
  if (!v) return '';
  const d = dayjs(v);
  return d.isValid() ? d.format('DD-MM-YYYY, HH:mm') : '';
};
const fmtDate = (v?: string | null) => {
  if (!v) return '';
  const d = dayjs(v);
  return d.isValid() ? d.format('DD-MM-YYYY') : '';
};

/* ===== Columnas (tabla superior) ===== */
const cols: ColumnDef<SiniestroItem>[] = [
  { header: 'CUIL', accessorKey: 'trabCUIL' },
  {
    header: 'Apellido y Nombre',
    accessorKey: 'trabNombre',
    cell: ({ getValue }) => String(getValue() ?? '').trim(),
  },
  { header: 'Establecimiento', accessorKey: 'establecimiento' },
  { header: 'Nº Siniestro', accessorKey: 'siniestroNro' },
  {
    header: 'Tipo',
    accessorKey: 'tipoSiniestro',
    cell: ({ getValue }) => String(getValue() ?? '').trim(),
  },
  {
    header: 'Fecha y Hora Siniestro',
    accessorKey: 'siniestroFechaHora',
    cell: ({ getValue }) => fmtDateTime(getValue() as string | null),
  },
  { header: 'Diagnóstico', accessorKey: 'diagnostico' },
  {
    header: 'Categoría',
    accessorKey: 'siniestroCategoria',
    cell: ({ getValue }) => String(getValue() ?? '').trim(),
  },
  {
    header: 'Próx. Control Médico',
    accessorKey: 'proximoControlMedicoFechaHora',
    cell: ({ getValue }) => fmtDateTime(getValue() as string | null),
  },
  { header: 'Prestador inicial', accessorKey: 'prestador' },
  {
    header: 'Alta Médica',
    accessorKey: 'altaMedicaFecha',
    cell: ({ getValue }) => fmtDate(getValue() as string | null),
  },
];

/* ===== Componente ===== */
export default function SiniestrosPage() {
  const [selectedDenuncia, setSelectedDenuncia] = useState<number | null>(null);

  // Query base (sin filtros adicionales)
  const params: Parameters = {};

  // Lista principal
  const { data, error, isLoading } =
    gestionEmpleadorAPI.useGetVEmpleadorSiniestros(params);

  // Detalle por denuncia (instancias) — se dispara SOLO si hay denuncia seleccionada
  const {
    data: instanciasData,
    isLoading: isLoadingInst,
    error: errorInst,
  } = gestionEmpleadorAPI.useGetVEmpleadorSiniestrosInstancias(
    selectedDenuncia != null ? ({ Denuncia: selectedDenuncia } as any) : ({} as any)
  );

  // Log con token enmascarado y URL (debug)
  const url = useMemo(
    () => gestionEmpleadorAPI.getVEmpleadorSiniestrosURL(params),
    [params]
  );
  useEffect(() => {
    const raw = token.getToken?.();
    const masked =
      typeof raw === 'string'
        ? `Bearer ${raw.slice(0, 6)}…${raw.slice(-6)}`
        : '(objeto/token compuesto)';
    console.log('[GET] VEmpleadorSiniestros →', { url, params, tokenPreview: masked });
  }, [url, params]);

  // Filas principales
  const rows: SiniestroItem[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  // Click en fila → carga instancias de esa denuncia
  const handleRowClick = (row: SiniestroItem) => {
    const den = Number(row.denunciaNro ?? 0);
    if (den) setSelectedDenuncia(den);
  };

  const instanciasRows: InstanciaSiniestro[] = useMemo(() => {
    if (!Array.isArray(instanciasData)) return [];
    return (instanciasData as any[]).map((it) => ({
      denunciaNro: Number(it.denunciaNro ?? 0),
      fechaHoraInstancia: it.fechaHoraInstancia ?? null,
      tipoInstancia: typeof it.tipoInstancia === 'string' ? it.tipoInstancia.trim() : it.tipoInstancia ?? null,
      comentarioInstancia: typeof it.comentarioInstancia === 'string' ? it.comentarioInstancia.trim() : it.comentarioInstancia ?? null,
      estadoInstancia: typeof it.estadoInstancia === 'string' ? it.estadoInstancia.trim() : it.estadoInstancia ?? null,
      proximoControlMedicoFechaHora: it.proximoControlMedicoFechaHora ?? null,
    }));
  }, [instanciasData]);

  const hasAnyDetalle = instanciasRows.length > 0;

  return (
    <div style={{ padding: 16 }}>

      {error && (
        <p style={{ color: 'crimson' }}>
          {String((error as any)?.message ?? error)}
        </p>
      )}

      <DataTable<SiniestroItem>
        data={rows}
        columns={cols}
        isLoading={isLoading}
        size="mid"
        onRowClick={handleRowClick}
      />

      {/* Panel inferior: SOLO usa CondicionesTabla (instancias del siniestro) */}
      {selectedDenuncia != null && (
        <>
          {errorInst && (
            <p style={{ color: 'crimson' }}>
              {String((errorInst as any)?.message ?? errorInst)}
            </p>
          )}

          <CondicionesTabla
            rows={instanciasRows}
            loading={isLoadingInst}
            hasAny={hasAnyDetalle}
          />
        </>
      )}
    </div>
  );
}
