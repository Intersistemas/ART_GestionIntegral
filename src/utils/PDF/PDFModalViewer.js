import React, { useState } from 'react';
import Modal from 'react-modal';
import { PDFViewer } from '@react-pdf/renderer';

/**
 * Componente reutilizable para mostrar documentos PDF en una ventana modal
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {React.Component} props.pdfComponent - Componente que genera el PDF
 * @param {Object} props.pdfProps - Props para pasar al componente PDF
 * @param {Function} props.onClose - Función callback para cerrar el modal
 * @param {string} props.title - Título del modal
 * @param {Object} props.modalStyles - Estilos personalizados para el modal
 * @param {Object} props.pdfViewerStyles - Estilos personalizados para el visor PDF
 */

// Estilos por defecto
const defaultModalStyles = {
  content: {
    top: '5%',
    left: '50%',
    right: 'auto', 
    bottom: 'auto',
    marginRight: '-50%',
    width: '80%',
    height: '90%',
    transform: 'translate(-50%, 0)',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

const defaultPdfViewerStyles = {
  height: '90%',
  width: '100%',
  border: '1px solid #ddd',
  borderRadius: '4px'
};

const PDFModalViewer = ({
  isOpen = false,
  pdfComponent: PDFComponent,
  pdfProps = {},
  onClose,
  title = 'Visualización PDF',
  modalStyles = {},
  pdfViewerStyles = {},
  showCloseButton = true,
  closeButtonText = 'Cerrar',
  closeButtonClassName = 'btn btn-secondary',
  ...props
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  // Combinar estilos
  const finalModalStyles = {
    content: {
      ...defaultModalStyles.content,
      ...modalStyles.content
    },
    overlay: {
      ...defaultModalStyles.overlay,
      ...modalStyles.overlay
    }
  };

  const finalPdfViewerStyles = {
    ...defaultPdfViewerStyles,
    ...pdfViewerStyles
  };

  // Manejar cierre del modal
  const handleClose = () => {
    setModalIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Actualizar estado cuando cambie la prop isOpen
  React.useEffect(() => {
    setModalIsOpen(isOpen);
  }, [isOpen]);

  if (!PDFComponent) {
    console.error('PDFModalViewer: Se requiere un componente PDF válido');
    return null;
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleClose}
      style={finalModalStyles}
      contentLabel={title}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      {...props}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header del modal */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px'
        }}>
          <h4 style={{ margin: 0, color: '#333' }}>{title}</h4>
          {showCloseButton && (
            <button
              onClick={handleClose}
              className={closeButtonClassName}
              style={{
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {closeButtonText}
            </button>
          )}
        </div>

        {/* Visor PDF */}
        <div style={{ flex: 1, display: 'flex' }}>
          <PDFViewer style={finalPdfViewerStyles}>
            <PDFComponent {...pdfProps} />
          </PDFViewer>
        </div>

        {/* Footer opcional */}
        <div style={{ 
          marginTop: '15px', 
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          <p>Use Ctrl+P para imprimir o el botón de descarga del visor para guardar el PDF</p>
        </div>
      </div>
    </Modal>
  );
};

export default PDFModalViewer;