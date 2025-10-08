'use client';

import React from 'react';
import dayjs from 'dayjs';

export type InstanciaSiniestro = {
  denunciaNro: number;
  fechaHoraInstancia: string | null;
  tipoInstancia: string | null;
  comentarioInstancia: string | null;
  estadoInstancia: string | null;
  proximoControlMedicoFechaHora: string | null;
};

type Props = {
  /** Filas a renderizar (pueden venir ya paginadas) */
  rows: InstanciaSiniestro[];
  /** Muestra el estado de carga */
  loading?: boolean;
  /** Si querés que muestre el vacío cuando no hay ningún registro globalmente */
  hasAny?: boolean; // típico: rows.length > 0
};

const fmtDateTime = (v?: string | null) => {
  if (!v) return '';
  const d = dayjs(v);
  return d.isValid() ? d.format('DD-MM-YYYY HH:mm') : String(v ?? '');
};

const CondicionesTabla: React.FC<Props> = ({ rows, loading = false, hasAny = true }) => {
  return (
    <div style={{ marginTop: 18 }}>


      {loading ? (
        <div style={{ padding: 16, textAlign: 'center' }}>cargando detalle...</div>
      ) : !hasAny ? (
        <div style={{ padding: 12, textAlign: 'center', opacity: 0.7 }}>
          No hay instancias para mostrar.
        </div>
      ) : (
        <div className="detalleTable">
          <table>
            <thead>
              <tr>
                <th style={{ width: 90 }}>Denuncia N°</th>
                <th style={{ width: 160 }}>Fecha/Hora Instancia</th>
                <th style={{ width: 220 }}>Tipo de Instancia</th>
                <th>Comentario</th>
                <th style={{ width: 120 }}>Estado</th>
                <th style={{ width: 190 }}>Próx. Control Médico</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.denunciaNro}-${i}`}>
                  <td>{r.denunciaNro}</td>
                  <td>{fmtDateTime(r.fechaHoraInstancia)}</td>
                  <td>{(r.tipoInstancia ?? '').trim()}</td>
                  <td>{(r.comentarioInstancia ?? '').trim()}</td>
                  <td>{(r.estadoInstancia ?? '').trim()}</td>
                  <td>{fmtDateTime(r.proximoControlMedicoFechaHora)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <style jsx>{`
            .detalleTable table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            .detalleTable th,
            .detalleTable td {
              border: 1px solid #999;
              padding: 6px 8px;
              vertical-align: top;
            }
            .detalleTable thead th {
              background: #f5f5f5;
              font-weight: 600;
              text-transform: uppercase;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default CondicionesTabla;
