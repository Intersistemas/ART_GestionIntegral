# 📄 Guía de Implementación: Sistema de Impresión PDF Reutilizable

## 🎯 Descripción General

Esta guía te ayudará a implementar la funcionalidad de impresión PDF en cualquier aplicación React, basada en la implementación exitosa del sistema de formularios RAR.

## 📦 Dependencias Necesarias

Primero, instala las siguientes dependencias en tu nueva aplicación:

```bash
npm install @react-pdf/renderer react-modal moment
```

### Versiones recomendadas:
- `@react-pdf/renderer`: ^1.6.11 o superior
- `react-modal`: ^3.11.2 o superior  
- `moment`: ^2.24.0 o superior

## 📁 Estructura de Archivos

Crea la siguiente estructura en tu proyecto:

```
src/
  components/
    PDF/
      BaseDocumentPDF.js           # Componente base reutilizable
      PDFModalViewer.js            # Modal para mostrar PDFs
      utils/
        formatUtils.js             # Utilidades de formateo
      examples/
        EjemploFormularioRAR.js    # Ejemplo específico
        EjemploListaConImpresion.js # Ejemplo de integración
```

## 🚀 Implementación Paso a Paso

### Paso 1: Copiar los Componentes Base

1. **BaseDocumentPDF.js** - Componente principal para generar PDFs
2. **PDFModalViewer.js** - Modal reutilizable para mostrar PDFs
3. **formatUtils.js** - Utilidades de formateo

### Paso 2: Crear tu Componente PDF Personalizado

```javascript
// Tu componente personalizado
import React from 'react';
import BaseDocumentPDF from '../BaseDocumentPDF';
import { formatearFecha } from '../utils/formatUtils';

const MiFormularioPDF = (props) => {
  const { misDatos = {} } = props;
  
  // Define las columnas de tu tabla
  const columns = [
    { 
      key: 'id', 
      title: 'ID', 
      width: '10%' 
    },
    { 
      key: 'nombre', 
      title: 'Nombre', 
      width: '30%' 
    },
    { 
      key: 'fecha', 
      title: 'Fecha', 
      width: '20%',
      render: (value) => formatearFecha(value)
    },
    // ... más columnas
  ];

  return (
    <BaseDocumentPDF
      title="Mi Formulario Personalizado"
      columns={columns}
      data={misDatos.items || []}
      orientation="portrait" // o "landscape"
      itemsPerPage={50}
      {...props}
    />
  );
};

export default MiFormularioPDF;
```

### Paso 3: Integrar en tu Lista/Componente

```javascript
import React, { Component } from 'react';
import PDFModalViewer from './PDF/PDFModalViewer';
import MiFormularioPDF from './PDF/MiFormularioPDF';

class MiLista extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalPDFIsOpen: false,
      datosParaImprimir: null
    };
  }

  handleImprimir = async (registro) => {
    try {
      // Cargar datos completos desde tu API
      const datosCompletos = await miApiService.obtenerDatos(registro.id);
      
      this.setState({
        datosParaImprimir: datosCompletos,
        modalPDFIsOpen: true
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  handleCerrarModal = () => {
    this.setState({
      modalPDFIsOpen: false,
      datosParaImprimir: null
    });
  };

  render() {
    return (
      <div>
        {/* Tu lista/tabla aquí */}
        <button onClick={() => this.handleImprimir(registro)}>
          Imprimir
        </button>

        {/* Modal de impresión */}
        {this.state.modalPDFIsOpen && (
          <PDFModalViewer
            isOpen={this.state.modalPDFIsOpen}
            pdfComponent={MiFormularioPDF}
            pdfProps={this.state.datosParaImprimir}
            onClose={this.handleCerrarModal}
            title="Impresión de Mi Formulario"
          />
        )}
      </div>
    );
  }
}
```

## 🎨 Personalización Avanzada

### Crear Cabecera Personalizada

```javascript
const MiCabecera = ({ misDatos }) => {
  const styles = StyleSheet.create({
    cabecera: {
      backgroundColor: '#007bff', // Tu color corporativo
      padding: 10,
      marginBottom: 15
    },
    titulo: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center'
    }
  });

  return (
    <View style={styles.cabecera}>
      <Text style={styles.titulo}>MI EMPRESA - REPORTE</Text>
      <Text style={{color: 'white', textAlign: 'center'}}>
        Fecha: {formatearFecha(new Date())}
      </Text>
    </View>
  );
};

// Usar en BaseDocumentPDF
<BaseDocumentPDF
  headerComponent={MiCabecera}
  // ... otras props
/>
```

### Estilos Personalizados

```javascript
const misEstilosPersonalizados = {
  page: {
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  tableHeader: {
    backgroundColor: '#007bff', // Tu color
    // ... otros estilos
  }
};

<BaseDocumentPDF
  customStyles={misEstilosPersonalizados}
  // ... otras props
/>
```

## 🔧 Configuración del Modal

```javascript
<PDFModalViewer
  isOpen={modalIsOpen}
  pdfComponent={MiComponentePDF}
  pdfProps={misDatos}
  onClose={handleCerrar}
  title="Mi Título Personalizado"
  modalStyles={{
    content: {
      width: '95%',
      height: '95%',
      backgroundColor: '#f8f9fa'
    }
  }}
  pdfViewerStyles={{
    border: '2px solid #007bff'
  }}
  closeButtonText="Cerrar Ventana"
  closeButtonClassName="btn btn-primary"
/>
```

## ⚡ Funciones de Formateo Disponibles

```javascript
import { 
  formatearFecha,
  formatearFechaHora,
  formatearNumero,
  formatearMoneda,
  formatearCUIT,
  formatearDNI,
  truncarTexto,
  capitalizarTexto,
  manejarValorNulo,
  formatearBooleano
} from './PDF/utils/formatUtils';

// Ejemplos de uso:
formatearFecha('2024-01-15') // → "15/01/2024"
formatearMoneda(1234.56) // → "$1.234,56"
formatearCUIT('20123456789') // → "20-12345678-9"
truncarTexto('Texto muy largo...', 20) // → "Texto muy largo..."
manejarValorNulo(null, 'Sin datos') // → "Sin datos"
```

## 📊 Ejemplo de Columnas Avanzadas

```javascript
const columns = [
  {
    key: 'id',
    title: 'ID',
    width: '8%'
  },
  {
    key: 'nombre',
    title: 'Nombre Completo',
    width: '25%',
    render: (value) => capitalizarTexto(value)
  },
  {
    key: 'documento',
    title: 'DNI',
    width: '12%',
    render: (value) => formatearDNI(value)
  },
  {
    key: 'salario',
    title: 'Salario',
    width: '15%',
    render: (value) => formatearMoneda(value)
  },
  {
    key: 'activo',
    title: 'Estado',
    width: '10%',
    render: (value) => formatearBooleano(value, 'Activo', 'Inactivo')
  },
  {
    key: 'observaciones',
    title: 'Observaciones',
    width: '30%',
    render: (value) => truncarTexto(value, 50)
  }
];
```

## 🚨 Troubleshooting Común

### Error: "Cannot resolve module"
```bash
npm install --save @react-pdf/renderer react-modal moment
```

### PDFs no se generan correctamente
- Verifica que todos los datos estén en el formato correcto
- Usa las funciones de formateo para manejar valores null/undefined
- Revisa la consola para errores de rendering

### Modal no se muestra
- Asegúrate que `ariaHideApp={false}` esté configurado
- Verifica que los estilos del modal estén correctos
- Comprueba que `isOpen` sea `true`

## 📈 Mejores Prácticas

1. **Rendimiento**: Usa `itemsPerPage` para paginar documentos grandes
2. **Datos**: Siempre valida y formatea los datos antes de pasarlos al PDF
3. **Estilos**: Usa StyleSheet.create() para mejor rendimiento
4. **Errores**: Implementa manejo de errores en la carga de datos
5. **UX**: Muestra loading mientras se genera el PDF

## 🎉 ¡Listo!

Con esta implementación tendrás un sistema completo y reutilizable para generar PDFs en cualquier aplicación React. Los componentes son modulares y pueden adaptarse fácilmente a diferentes tipos de formularios y reportes.

### Archivos de Ejemplo Incluidos:
- ✅ **BaseDocumentPDF.js** - Componente base
- ✅ **PDFModalViewer.js** - Modal reutilizable  
- ✅ **formatUtils.js** - Utilidades de formateo
- ✅ **EjemploFormularioRAR.js** - Ejemplo específico
- ✅ **EjemploListaConImpresion.js** - Ejemplo de integración

¡Copia estos archivos a tu proyecto y comienza a generar PDFs profesionales! 🚀