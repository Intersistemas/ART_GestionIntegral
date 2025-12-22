"use client";

import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CIIUIndicesDTO, ARTSellosIIBBDTO, EmpleadoresPadronDTO, CotizacionesDTO } from '@/data/cotizadorAPI';
import CustomModal from '@/utils/ui/form/CustomModal';
import CustomButton from '@/utils/ui/button/CustomButton';
import { CotizadorPDFContent } from './CotizadorPDFContent';
import { CotizadorPDFFormData } from './types';

type CotizadorPDFPreviewProps = {
  open: boolean;
  onClose: () => void;
  resultado: CotizacionesDTO;
  formData: CotizadorPDFFormData;
  actividadesCIIU?: CIIUIndicesDTO[];
  artSellosIIBB?: ARTSellosIIBBDTO[];
  empleadoresPadron?: EmpleadoresPadronDTO | null;
  ffepImporte?: number;
};

export const CotizadorPDFPreview = ({
  open,
  onClose,
  resultado,
  formData,
  actividadesCIIU,
  artSellosIIBB,
  empleadoresPadron,
  ffepImporte = 1227,
}: CotizadorPDFPreviewProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGuardarPDF = async () => {
    if (!pdfRef.current) return;

    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const marginMM = 8;

      const A4_PX_W = Math.round(210 * (96 / 25.4));
      const A4_PX_H = Math.round(297 * (96 / 25.4));

      const root = pdfRef.current;
      root.style.width = `${A4_PX_W}px`;
      root.style.height = `${A4_PX_H}px`;
      root.style.background = '#ffffff';

      // Esperar a que las imágenes se carguen
      const images = root.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve, reject) => {
              if (img.complete) {
                resolve(null);
              } else {
                img.onload = () => resolve(null);
                img.onerror = reject;
              }
            })
        )
      );

      const canvas = await html2canvas(root, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgWmm = canvas.width / (96 / 25.4);
      const imgHmm = canvas.height / (96 / 25.4);

      const availableW = pdfW - marginMM * 2;
      const availableH = pdfH - marginMM * 2;
      const scale = Math.min(availableW / imgWmm, availableH / imgHmm);

      const drawW = imgWmm * scale;
      const drawH = imgHmm * scale;
      const x = (pdfW - drawW) / 2;
      const y = marginMM;

      pdf.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        x,
        y,
        drawW,
        drawH,
        undefined,
        'FAST'
      );

      pdf.save(`Cotizacion_${resultado.idCotizacion}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprimir = () => {
    if (!pdfRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = pdfRef.current.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${styles}
            body { margin: 0; padding: 20px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (!open) return null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Vista Previa de Cotización"
      size="large"
    >
      <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '1rem' }}>
        <div ref={pdfRef}>
          <CotizadorPDFContent
            resultado={resultado}
            formData={formData}
            actividadesCIIU={actividadesCIIU}
            artSellosIIBB={artSellosIIBB}
            empleadoresPadron={empleadoresPadron}
            ffepImporte={ffepImporte}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', padding: '1rem' }}>
        <CustomButton onClick={handleImprimir} color="secondary" disabled={isGenerating}>
          Imprimir
        </CustomButton>
        <CustomButton onClick={handleGuardarPDF} color="secondary" disabled={isGenerating}>
          {isGenerating ? 'Guardando...' : 'Guardar PDF'}
        </CustomButton>
        <CustomButton onClick={onClose} color="primary">
          Cerrar
        </CustomButton>
      </div>
    </CustomModal>
  );
};
