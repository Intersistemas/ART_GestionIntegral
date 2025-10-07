import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

//#region Estilos base reutilizables
const baseStyles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    margin: 5,
  },
  header: {
    backgroundColor: '#83BC00',
    padding: 10,
    marginBottom: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#83BC00',
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 9,
    marginTop: 2,
    width: '98%'
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 8,
    marginTop: 2,
    width: '98%'
  },
  pageNumbers: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 11,
  },
});
//#endregion

/**
 * Componente base reutilizable para generar PDFs de formularios
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del documento
 * @param {React.Component} props.headerComponent - Componente de cabecera personalizado
 * @param {Array} props.columns - Definición de columnas [{ key, title, width }]
 * @param {Array} props.data - Datos para la tabla
 * @param {string} props.orientation - Orientación del documento ('portrait' | 'landscape')
 * @param {number} props.itemsPerPage - Elementos por página para paginación
 * @param {Function} props.renderCustomContent - Función para renderizar contenido personalizado
 * @param {Object} props.customStyles - Estilos personalizados adicionales
 */
const BaseDocumentPDF = ({
  title = "Documento PDF",
  headerComponent: HeaderComponent,
  columns = [],
  data = [],
  orientation = 'portrait',
  itemsPerPage = 50,
  renderCustomContent,
  customStyles = {},
  ...props
}) => {
  
  // Combinar estilos base con estilos personalizados
  const styles = StyleSheet.create({
    ...baseStyles,
    ...customStyles
  });

  // Renderizar cabecera de tabla
  const renderTableHeader = () => {
    if (columns.length === 0) return null;
    
    return (
      <View style={styles.tableHeader} fixed>
        {columns.map((column, index) => (
          <Text 
            key={index} 
            style={{ 
              width: column.width || `${100/columns.length}%`,
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {column.title}
          </Text>
        ))}
      </View>
    );
  };

  // Renderizar filas de datos
  const renderTableRows = () => {
    if (data.length === 0) {
      return <Text>No hay datos para mostrar</Text>;
    }

    return data.map((item, index) => (
      <View 
        style={styles.tableRow} 
        key={index}
        break={index > 0 && (index % itemsPerPage === 0) ? true : false}
      >
        {columns.map((column, colIndex) => (
          <Text 
            key={colIndex}
            style={{ 
              width: column.width || `${100/columns.length}%`
            }}
          >
            {column.render ? column.render(item[column.key], item) : item[column.key]}
          </Text>
        ))}
      </View>
    ));
  };

  return (
    <Document>
      <Page style={styles.page} orientation={orientation} wrap>
        {/* Numeración de páginas */}
        <Text 
          style={styles.pageNumbers} 
          render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} / ${totalPages}`
          )} 
          fixed 
        />
        
        {/* Componente de cabecera personalizado */}
        {HeaderComponent && <HeaderComponent {...props} />}
        
        {/* Título por defecto si no hay componente de cabecera */}
        {!HeaderComponent && (
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        )}
        
        {/* Contenido personalizado adicional */}
        {renderCustomContent && renderCustomContent(props)}
        
        {/* Tabla de datos */}
        {columns.length > 0 && (
          <>
            {renderTableHeader()}
            {renderTableRows()}
          </>
        )}
      </Page>
    </Document>
  );
};

export default BaseDocumentPDF;