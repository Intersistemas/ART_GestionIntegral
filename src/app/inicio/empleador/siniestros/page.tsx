'use client';

import React, { useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import gestionEmpleadorAPI from '@/data/gestionEmpleadorAPI';
import { token } from '@/data/usuarioAPI';
import type { Parameters } from '@/app/inicio/empleador/cobertura/types/persona';

type SiniestroItem = {
  denunciaNro: number;
  trabCUIL: string;
  trabNombre: string;
  establecimiento: string;
  siniestroNro: string;
  tipoSiniestro: string;
  siniestroFechaHora?: string | null;
  diagnostico?: string | null;
  siniestroCategoria?: string | null;
  proximoControlMedicoFechaHora?: string | null;
  prestador?: string | null;
  altaMedicaFecha?: string | null;
  empCUIT?: string | null;
};

// Normaliza cualquier forma de token a "Bearer <jwt>"
function normalizeBearerToken(raw: unknown): string | undefined {
  if (!raw) return undefined;

  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return undefined;
    return s.startsWith('Bearer ') ? s : `Bearer ${s}`;
  }

  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    const candidate = [
      o['accessToken'],
      o['token'],
      o['id_token'],
      o['jwt'],
      o['value'],
    ].find((v) => typeof v === 'string' && (v as string).trim().length > 0) as
      | string
      | undefined;

    if (!candidate) return undefined;
    return candidate.startsWith('Bearer ') ? candidate : `Bearer ${candidate}`;
  }

  return undefined;
}

function fmtDateTime(v?: string | null) {
  if (!v) return '';
  const d = dayjs(v);
  return d.isValid() ? d.format('DD-MM-YYYY, HH:mm') : '';
}
function fmtDate(v?: string | null) {
  if (!v) return '';
  const d = dayjs(v);
  return d.isValid() ? d.format('DD-MM-YYYY') : '';
}

export default function SiniestrosPage() {
  // Si querés enviar filtros/paginación, agregalos acá
  const params: Parameters = {}; // e.g. { page: '1,50' }

  // URL construida por tu API class (para log)
  const url = useMemo(
    () => gestionEmpleadorAPI.getVEmpleadorSiniestrosURL(params),
    [params]
  );

  // SWR usando tu wrapper (inyecta token automáticamente)
  const { data, error, isLoading } =
    gestionEmpleadorAPI.useGetVEmpleadorSiniestros(params);

  // 🔎 Logs de diagnóstico (sin exponer el JWT completo)
  useEffect(() => {
    const raw = token.getToken?.();
    const authHeader = normalizeBearerToken(raw);
    const masked = authHeader
      ? authHeader.replace(/^Bearer\s+(.{6}).+(.{6})$/, 'Bearer $1…$2')
      : '(vacío)';

    console.log('[GET] VEmpleadorSiniestros →', {
      url,
      params,
      tokenTipo: typeof raw,
      tokenClaves:
        raw && typeof raw === 'object'
          ? Object.keys(raw as Record<string, unknown>)
          : undefined,
      tokenPreview: masked,
    });
  }, [url, params]);

  const rows: SiniestroItem[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  return (
    <div style={{ padding: 16 }}>
      <h1>Control de Siniestros</h1>

      {isLoading && <p>Cargando…</p>}

      {error && (
        <p style={{ color: 'crimson' }}>
          {String((error as any)?.message ?? error)}
        </p>
      )}

      {!isLoading && !error && rows.length === 0 && (
        <p>No hay siniestros para mostrar.</p>
      )}

      {!isLoading && !error && rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              minWidth: 980,
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>CUIL</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Apellido y Nombre</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Establecimiento</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Nº Siniestro</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Tipo</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Fecha Siniestro PMI</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Diagnóstico</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Categoría</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Próx. Control Médico</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Prestador inicial</th>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Alta Médica</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={`${r.denunciaNro ?? idx}-${idx}`}>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.trabCUIL}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.trabNombre}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.establecimiento}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.siniestroNro}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.tipoSiniestro}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{fmtDateTime(r.siniestroFechaHora)}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.diagnostico ?? ''}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.siniestroCategoria ?? ''}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{fmtDateTime(r.proximoControlMedicoFechaHora)}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{r.prestador ?? ''}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{fmtDate(r.altaMedicaFecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
