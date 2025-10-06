import React, { Component } from 'react';
import PDFModalViewer from '../PDF/PDFModalViewer';
import EjemploFormularioRAR from '../PDF/examples/EjemploFormularioRAR';

/**
 * Ejemplo de cómo integrar la funcionalidad de impresión en cualquier lista
 * Este componente muestra cómo usar los componentes reutilizables de PDF
 */
class EjemploListaConImpresion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Estados para el modal de impresión
      modalPDFIsOpen: false,
      registroSeleccionado: null,
      
      // Datos de ejemplo (en tu app real vendrían de props o API)
      registros: [
        {
          id: 1,
          nombre: 'Formulario RAR #001',
          estado: 'Confirmado',
          fecha: '2024-01-15'
        },
        {
          id: 2,
          nombre: 'Formulario RAR #002',
          estado: 'Borrador',
          fecha: '2024-01-16'
        },
        {
          id: 3,
          nombre: 'Formulario RAR #003',
          estado: 'Confirmado',
          fecha: '2024-01-17'
        }
      ]
    };
  }

  // Función para manejar el clic en imprimir
  handleClickImprimir = async (registro) => {
    try {
      // Aquí harías la llamada a tu API para obtener los datos completos
      // const datosCompletos = await tuApiService.obtenerDatosCompletos(registro.id);
      
      // Por ahora usamos datos de ejemplo
      const datosCompletos = {
        formularioRAR: {
          FechaPresentacion: registro.fecha,
          CantTrabajadoresExpuestos: 25,
          CantTrabajadoresNoExpuestos: 15,
          RefEstablecimiento: {
            Codigo: 'EST001',
            DomicilioCalle: 'Av. Corrientes',
            DomicilioNro: '1234',
            CIIU: '1234',
            SRTLocalidad: {
              Nombre: 'Buenos Aires',
              NombreProvincia: 'Buenos Aires',
              CodPostal: '1000'
            }
          },
          FormulariosRARDetalle: [
            {
              CUIL: '20-12345678-9',
              Nombre: 'García, Juan Carlos',
              SectorTarea: 'Producción',
              FechaIngreso: '2020-01-15',
              HorasExposicion: 8,
              FechaUltimoExamenMedico: '2023-12-01',
              SRTSiniestralidadAgenteCausante: {
                Codigo: 'AG001',
                Descripcion: 'Ruido Industrial'
              }
            },
            {
              CUIL: '27-87654321-3',
              Nombre: 'López, María Elena',
              SectorTarea: 'Administración',
              FechaIngreso: '2021-03-10',
              HorasExposicion: 0,
              FechaUltimoExamenMedico: '2023-11-15',
              SRTSiniestralidadAgenteCausante: null
            }
          ]
        },
        referenteDatos: [
          {
            RazonSocial: 'Empresa Ejemplo S.A.',
            CUIT: '30-12345678-9',
            ActividadPrincipal: 'Manufactura Industrial',
            Telefonos: '011-1234-5678',
            RefEmpleador: {
              ContratoNro: 'CON123456',
              CIIU: '2511'
            }
          }
        ]
      };

      this.setState({
        registroSeleccionado: datosCompletos,
        modalPDFIsOpen: true
      });

    } catch (error) {
      console.error('Error al cargar datos para impresión:', error);
      alert('Error al cargar los datos para impresión');
    }
  };

  // Función para cerrar el modal
  handleCerrarModal = () => {
    this.setState({
      modalPDFIsOpen: false,
      registroSeleccionado: null
    });
  };

  render() {
    const { registros, modalPDFIsOpen, registroSeleccionado } = this.state;

    return (
      <div className="container mt-4">
        <h2>Lista de Formularios con Impresión</h2>
        
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map(registro => (
                <tr key={registro.id}>
                  <td>{registro.id}</td>
                  <td>{registro.nombre}</td>
                  <td>
                    <span className={`badge ${registro.estado === 'Confirmado' ? 'badge-success' : 'badge-warning'}`}>
                      {registro.estado}
                    </span>
                  </td>
                  <td>{registro.fecha}</td>
                  <td>
                    {registro.estado === 'Confirmado' && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => this.handleClickImprimir(registro)}
                      >
                        <span role="img" aria-label="documento">📄</span> Imprimir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de impresión */}
        {modalPDFIsOpen && registroSeleccionado && (
          <PDFModalViewer
            isOpen={modalPDFIsOpen}
            pdfComponent={EjemploFormularioRAR}
            pdfProps={registroSeleccionado}
            onClose={this.handleCerrarModal}
            title="Impresión Formulario RAR"
            modalStyles={{
              content: {
                width: '90%',
                height: '90%'
              }
            }}
          />
        )}
      </div>
    );
  }
}

export default EjemploListaConImpresion;