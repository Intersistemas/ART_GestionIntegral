'use client';
import React from 'react';
import { PDFViewer, type DocumentProps } from '@react-pdf/renderer';
import type { Style as PDFStyle } from '@react-pdf/types';
import type { VentanaImpresionFormularioProps, PDFChild } from './types/impresion';

/* ===== Estilos de elementos HTML (div/button): CSSProperties ===== */
const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dialogBox: React.CSSProperties = {
  width: '90%',
  height: '90%',
  background: '#fff',
  borderRadius: 10,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
};

const header: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  background: '#83BC00',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
};

const closeBtn: React.CSSProperties = {
  background: '#fff',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: 8,
  padding: '6px 12px',
  cursor: 'pointer',
};

const body: React.CSSProperties = {
  flex: 1,
  background: '#f8f8f8',
};

/* ===== Estilo del PDFViewer: usar tipo Style de @react-pdf ===== */
const viewerStyle: PDFStyle = {
  width: '100%',
  height: '100%',
  // ¡No usar propiedades CSS no soportadas por react-pdf como borderStyle!
};

const VentanaImpresionFormulario: React.FC<VentanaImpresionFormularioProps> = ({
  open,
  onClose,
  title = 'Impresión de Formulario RGRL',
  children,
}) => {
  if (!open) return null;

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label={title}>
      <div style={dialogBox}>
        <div style={header}>
          <span>{title}</span>
          <button type="button" onClick={onClose} style={closeBtn}>
            Cerrar
          </button>
        </div>
        <div style={body}>
          {/* PDFViewer requiere children = <Document /> */}
          <PDFViewer style={viewerStyle /* si te falla el import del tipo, hacé: as any */}>
            {children}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default VentanaImpresionFormulario;
