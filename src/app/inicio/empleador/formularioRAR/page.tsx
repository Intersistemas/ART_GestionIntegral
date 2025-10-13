
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../data/AuthContext';
import Formato from '../../../../utils/Formato';
import CustomButton from '../../../../utils/ui/button/CustomButton';
import DataTableImport from '../../../../utils/ui/table/DataTable';
import PDFModalViewer from '../../../../utils/PDF/PDFModalViewer';
import BaseDocumentPDF from '../../../../utils/PDF/BaseDocumentPDF';
import { Text, View } from '@react-pdf/renderer';

import styles from './FormulariosRAR.module.css';

// Hijos
import FormularioRARGenerar from './generar/FormularioRARGenerar';
import FormularioRAREditor from './editar/FormularioRAREditor';

/* Helpers */
const fechaFormatter = (v: any) => Formato.Fecha(v);
const cuipFormatter = (v: any) => Formato.CUIP(v);
const formatearFecha = (f: any) => fechaFormatter(f);

/* Spinner simple */
const Spinner: React.FC = () => (
  <div className={styles.spinner}>
    <span>cargando...</span>
  </div>
);

/* Tipos (para datos de la tabla) */
export type FormularioRAR = {
  InternoFormularioRAR: number;
  CUIT: string;
  RazonSocial: string;
  Establecimiento: string;
  CantTrabExpuestos: number;
  CantTrabNoExpuestos: number;
  Estado: string;
  FechaHoraCreacion: string;
  FechaHoraConfirmado: string;
};

/** ===========================
 *   CONTENEDOR (página)
 *  =========================== */
type ViewMode = 'list' | 'crear' | 'editar';

const FormulariosRAR: React.FC = () => {
  const { user } = useAuth();
  const cuit = Number(user?.cuit ?? 0);

  const [loading, setLoading] = useState<boolean>(true);
  const [internoFormularioRAR, setInternoFormularioRAR] = useState<number>(0);
  const [internoEstablecimiento, setInternoEstablecimiento] = useState<number>(0);
  const [estado, setEstado] = useState<string>('');
  const [formulariosRAR, setFormulariosRAR] = useState<FormularioRAR[]>([]);
  const [idFormularioSeleccionado, setIdFormularioSeleccionado] = useState<number>(0);

  // modos
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editaId, setEditaId] = useState<number>(0);

  // PDF
  const [modalPDFOpen, setModalPDFOpen] = useState<boolean>(false);
  const [datosPDF, setDatosPDF] = useState<any>(null);

  // Detalles del interno
  const [detallesInterno, setDetallesInterno] = useState<any[]>([]);
  const [loadingDetalles, setLoadingDetalles] = useState<boolean>(false);
  const [errorDetalles, setErrorDetalles] = useState<string>('');
  const [registroSeleccionado, setRegistroSeleccionado] = useState<any>(null);

  const fetchFormularios = useCallback(async () => {
    try {
      const cuitUsuario = cuit;
      const response = await fetch(
        `http://arttest.intersistemas.ar:8302/api/FormulariosRAR?CUIL=${cuitUsuario}&PageSize=500`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      let formularios: any[] = [];
      if (data?.data) formularios = Array.isArray(data.data) ? data.data : [data.data];
      else if (Array.isArray(data)) formularios = data;
      else if (data) formularios = [data];
      setFormulariosRAR(formularios);
    } catch (error) {
      console.error('Error al consultar la API de FormulariosRAR:', error);
      setFormulariosRAR([]);
    } finally {
      setLoading(false);
    }
  }, [cuit]);

  const fetchDetallesInterno = useCallback(async (internoId: number) => {
    if (!internoId || internoId === 0) {
      setDetallesInterno([]);
      setErrorDetalles('');
      return;
    }
    setLoadingDetalles(true);
    setErrorDetalles('');
    try {
      const response = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${internoId}`);
      if (!response.ok) throw new Error(`Error al consultar detalles: ${response.status} - ${response.statusText}`);
      const data = await response.json();

      if (data?.formularioRARDetalle && Array.isArray(data.formularioRARDetalle)) {
        const detallesFormateados = data.formularioRARDetalle.map((detalle: any, index: number) => ({
          id: index + 1,
          cuil: detalle.cuil || '',
          nombre: detalle.nombre || '',
          sectorTarea: detalle.sectorTarea || '',
          fechaIngreso: detalle.fechaIngreso ? formatearFecha(detalle.fechaIngreso) : '',
          fechaInicioExposicion: detalle.fechaInicioExposicion ? formatearFecha(detalle.fechaInicioExposicion) : '',
          fechaFinExposicion: detalle.fechaFinExposicion ? formatearFecha(detalle.fechaFinExposicion) : '',
          horasExposicion: detalle.horasExposicion || 0,
          codigoAgente: detalle.codigoAgente || '',
          fechaUltimoExamenMedico: detalle.fechaUltimoExamenMedico ? formatearFecha(detalle.fechaUltimoExamenMedico) : '',
        }));
        setDetallesInterno(detallesFormateados);
      } else {
        setDetallesInterno([]);
      }
    } catch (error) {
      console.error('Error al obtener detalles del interno:', error);
      setErrorDetalles(error instanceof Error ? error.message : 'Error desconocido al cargar detalles');
      setDetallesInterno([]);
    } finally {
      setLoadingDetalles(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchFormularios();
  }, [fetchFormularios]);

  /* Handlers de navegación */
  const handleClickNuevo = () => {
    setViewMode('crear');
    setEditaId(0);
    setInternoFormularioRAR(0);
    setInternoEstablecimiento(0);
    setEstado('');
    setIdFormularioSeleccionado(0);
    setRegistroSeleccionado(null);
    setDetallesInterno([]);
    setErrorDetalles('');
  };

  const handleEdita = () => {
    const elegido = idFormularioSeleccionado > 0 ? idFormularioSeleccionado : internoFormularioRAR;
    if (!elegido || elegido === 0) {
      alert('Seleccioná un formulario de la tabla para editar.');
      return;
    }
    setEditaId(elegido);
    setViewMode('editar');
  };

  const handleClickCerrar = () => {
    try {
      window.history.back();
      window.close();
    } catch {
      // no-op en ambientes donde no se pueda cerrar
    }
  };

  const seleccionaRegistro = (internoFormRAR: number, internoEstab: number, estadoSel: string) => {
    setInternoFormularioRAR(internoFormRAR);
    setInternoEstablecimiento(internoEstab);
    setEstado(estadoSel);
  };

  const handleFinalizaCarga = async (ret?: boolean) => {
    setViewMode('list');
    setEstado('');
    if (ret) {
      setLoading(true);
      await fetchFormularios();
    }
  };

  /* PDF */
  const handleAbrirPDF = async (rowData: any) => {
    const idFormulario = rowData.id || rowData.Id || rowData.ID || rowData.InternoFormularioRAR || rowData.interno;
    if (idFormulario) {
      try {
        const response = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${idFormulario}`);
        if (response.ok) {
          const detallesFormulario = await response.json();
          const datosCompletos = {
            ...rowData,
            detallesTrabajadores: detallesFormulario.formularioRARDetalle || [],
            totalTrabajadores: detallesFormulario.formularioRARDetalle?.length || 0,
          };
          setDatosPDF(datosCompletos);
        } else {
          setDatosPDF(rowData);
        }
      } catch (error) {
        console.error('Error obteniendo detalles para PDF:', error);
        setDatosPDF(rowData);
      }
    } else {
      setDatosPDF(rowData);
    }
    setModalPDFOpen(true);
  };
  const handleCerrarPDF = () => {
    setModalPDFOpen(false);
    setDatosPDF(null);
  };

  /* Columnas */
  const tableColumns = [
    { accessorKey: 'interno', header: 'Interno' },
    { accessorKey: 'cuit', header: 'CUIT', cell: (info: any) => cuipFormatter(info.getValue()) },
    { accessorKey: 'razonSocial', header: 'Razón Social' },
    { accessorKey: 'direccion', header: 'Dirección' },
    { accessorKey: 'estado', header: 'Estado' },
    { accessorKey: 'fechaCreacion', header: 'F. Creación', cell: (info: any) => fechaFormatter(info.getValue()) },
    { accessorKey: 'fechaPresentacion', header: 'F. Presentación', cell: (info: any) => fechaFormatter(info.getValue()) },
    { accessorKey: 'internoEstablecimiento', header: 'Interno Establecimiento' },
    { accessorKey: 'cantTrabajadoresExpuestos', header: 'Expuestos' },
    { accessorKey: 'cantTrabajadoresNoExpuestos', header: 'No Expuestos' },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }: { row: any }) => (
        <CustomButton
          onClick={(e: any) => {
            e.stopPropagation?.();
            handleAbrirPDF(row.original);
          }}
          className={styles.tableBtnSmall}
        >
          Imprimir
        </CustomButton>
      ),
      enableSorting: false,
    },
  ];

  const onRowClick = (row: any) => {
    const idFormulario = Number(row.id || row.Id || row.ID || row.InternoFormularioRAR || row.interno || 0);
    const internoForm = Number(row.InternoFormularioRAR || row.interno || 0);
    const internoEstab = Number(row.internoEstablecimiento || row.InternoEstablecimiento || 0);
    const est = String(row.Estado || row.estado || '');
    seleccionaRegistro(internoForm, internoEstab, est);
    setIdFormularioSeleccionado(idFormulario);
    setRegistroSeleccionado(row);
    if (internoForm > 0) fetchDetallesInterno(internoForm);
    else {
      setDetallesInterno([]);
      setErrorDetalles('');
      setRegistroSeleccionado(null);
    }
  };

  const disableEdita = cuit !== 99999999999 && internoFormularioRAR !== 0 ? false : true;
  const disableGenera = cuit === 99999999999 ? true : false;

  if (loading) return <Spinner />;

  /* PDF para listado */
  const SimpleHeader: React.FC = () => (
    <View style={{ backgroundColor: '#83BC00', padding: 10, marginBottom: 10 }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
        Formulario RAR - Sistema ART
      </Text>
    </View>
  );

  const FormularioRARPDF = ({ datos }: { datos: any }) => {
    if (!datos) return null;
    const columnas = [
      { key: 'interno', title: 'Interno', width: '10%' },
      { key: 'cuit', title: 'CUIT', width: '15%' },
      { key: 'razonSocial', title: 'Razón Social', width: '25%' },
      { key: 'direccion', title: 'Dirección', width: '20%' },
      { key: 'estado', title: 'Estado', width: '10%' },
      { key: 'cantTrabajadoresExpuestos', title: 'Expuestos', width: '10%' },
      { key: 'cantTrabajadoresNoExpuestos', title: 'No Expuestos', width: '10%' },
    ];
    const datosFormateados = [
      {
        interno: datos.interno || datos.InternoFormularioRAR || '',
        cuit: cuipFormatter(datos.cuit || datos.CUIT || ''),
        razonSocial: datos.razonSocial || datos.RazonSocial || '',
        direccion: datos.direccion || datos.Direccion || '',
        estado: datos.estado || datos.Estado || '',
        cantTrabajadoresExpuestos: datos.cantTrabajadoresExpuestos || datos.CantTrabExpuestos || 0,
        cantTrabajadoresNoExpuestos: datos.cantTrabajadoresNoExpuestos || datos.CantTrabNoExpuestos || 0,
      },
    ];

    const trabajadores = datos.detallesTrabajadores || [];
    const trabajadoresFormateados = trabajadores.map((t: any) => ({
      cuil: cuipFormatter(t.cuil || ''),
      nombre: t.nombre || '',
      sectorTarea: t.sectorTarea || '',
      fechaIngreso: fechaFormatter(t.fechaIngreso || ''),
      horasExposicion: t.horasExposicion || 0,
      codigoAgente: t.codigoAgente || '',
    }));

    return (
      <BaseDocumentPDF
        title={`Formulario RAR #${datos.interno || datos.InternoFormularioRAR}`}
        headerComponent={SimpleHeader}
        columns={columnas}
        data={datosFormateados}
        orientation="landscape"
        itemsPerPage={1}
        customStyles={{}}
        renderCustomContent={() => (
          <>
            <Text style={{ fontSize: 10, marginBottom: 10, textAlign: 'center' }}>
              Fecha de creación: {formatearFecha(datos.fechaCreacion || datos.FechaHoraCreacion)}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 10, textAlign: 'center' }}>
              Fecha de presentación: {formatearFecha(datos.fechaPresentacion || datos.FechaHoraConfirmado)}
            </Text>

            {trabajadores.length > 0 && (
              <>
                <Text style={{ fontSize: 12, marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>
                  Trabajadores Registrados ({trabajadores.length})
                </Text>
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 5 }}>
                    <Text style={{ fontSize: 8, width: '15%', fontWeight: 'bold' }}>CUIL</Text>
                    <Text style={{ fontSize: 8, width: '25%', fontWeight: 'bold' }}>NOMBRE</Text>
                    <Text style={{ fontSize: 8, width: '20%', fontWeight: 'bold' }}>SECTOR/TAREA</Text>
                    <Text style={{ fontSize: 8, width: '12%', fontWeight: 'bold' }}>F. INGRESO</Text>
                    <Text style={{ fontSize: 8, width: '10%', fontWeight: 'bold' }}>HORAS EXP.</Text>
                    <Text style={{ fontSize: 8, width: '18%', fontWeight: 'bold' }}>CÓD. AGENTE</Text>
                  </View>
                  {trabajadoresFormateados.map((trabajador: any, index: number) => (
                    <View key={index} style={{ flexDirection: 'row', padding: 3, borderBottom: '1px solid #ddd' }}>
                      <Text style={{ fontSize: 8, width: '15%' }}>{trabajador.cuil}</Text>
                      <Text style={{ fontSize: 8, width: '25%' }}>{trabajador.nombre}</Text>
                      <Text style={{ fontSize: 8, width: '20%' }}>{trabajador.sectorTarea}</Text>
                      <Text style={{ fontSize: 8, width: '12%' }}>{trabajador.fechaIngreso}</Text>
                      <Text style={{ fontSize: 8, width: '10%' }}>{trabajador.horasExposicion}</Text>
                      <Text style={{ fontSize: 8, width: '18%' }}>{trabajador.codigoAgente}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      />
    );
  };

  return (
    <div>
      {viewMode === 'list' ? (
        <div>
          <h1>Consulta de Formularios RAR</h1>

          <div className={`${styles.flex} ${styles.gap12} ${styles.mb16}`}>
            <CustomButton onClick={handleEdita} disabled={disableEdita}>
              Editar
            </CustomButton>
            <CustomButton onClick={handleClickNuevo} disabled={disableGenera}>
              Generar formulario
            </CustomButton>
            <CustomButton onClick={handleClickCerrar}>Finaliza</CustomButton>
          </div>

          <div className={styles.compactTable}>
            <DataTableImport columns={tableColumns} data={formulariosRAR} onRowClick={onRowClick} />
          </div>

          {/* Tabla de detalles del interno seleccionado */}
          {registroSeleccionado && (
            <div className={`${styles.mt20}`}>
              <h3>
                Detalles del Formulario RAR #{registroSeleccionado.interno || registroSeleccionado.InternoFormularioRAR}
                {registroSeleccionado.razonSocial && ` - ${registroSeleccionado.razonSocial}`}
              </h3>

              {loadingDetalles && (
                <div className={styles.loadingMessage}>
                  <span>Cargando detalles...</span>
                </div>
              )}

              {errorDetalles && (
                <div className={styles.errorMessage}>
                  <span>Error: {errorDetalles}</span>
                </div>
              )}

              {!loadingDetalles && !errorDetalles && detallesInterno.length === 0 && (
                <div className={styles.noDataMessage}>
                  <span>No se encontraron trabajadores registrados para este formulario.</span>
                </div>
              )}

              {!loadingDetalles && !errorDetalles && detallesInterno.length > 0 && (
                <div className="detalleTable">
                  <p className={styles.detallesInfo}>
                    <strong>Trabajadores registrados: {detallesInterno.length}</strong>
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th style={{ width: 120 }}>CUIL</th>
                        <th>NOMBRE</th>
                        <th style={{ width: 150 }}>SECTOR/TAREA</th>
                        <th style={{ width: 120 }}>F. INGRESO</th>
                        <th style={{ width: 140 }}>F. INICIO EXPOSICIÓN</th>
                        <th style={{ width: 130 }}>F. FIN EXPOSICIÓN</th>
                        <th style={{ width: 80 }}>HORAS EXP.</th>
                        <th style={{ width: 100 }}>CÓD. AGENTE</th>
                        <th style={{ width: 150 }}>ÚLTIMO EXAMEN MÉDICO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detallesInterno.map((trabajador, index) => (
                        <tr key={trabajador.id || index}>
                          <td>{index + 1}</td>
                          <td>{cuipFormatter(trabajador.cuil) || '—'}</td>
                          <td>{trabajador.nombre || '—'}</td>
                          <td>{trabajador.sectorTarea || '—'}</td>
                          <td>{trabajador.fechaIngreso || '—'}</td>
                          <td>{trabajador.fechaInicioExposicion || '—'}</td>
                          <td>{trabajador.fechaFinExposicion || '—'}</td>
                          <td>{trabajador.horasExposicion || '—'}</td>
                          <td>{trabajador.codigoAgente || '—'}</td>
                          <td>{trabajador.fechaUltimoExamenMedico || '—'}</td>
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
          )}
        </div>
      ) : viewMode === 'crear' ? (
        <FormularioRARGenerar
          cuit={cuit}
          internoEstablecimiento={internoEstablecimiento}
          finalizaCarga={handleFinalizaCarga}
          formulariosRAR={formulariosRAR}
        />
      ) : (
        <FormularioRAREditor
          finalizaCarga={handleFinalizaCarga}
          edita={editaId} // interno del formulario a editar
        />
      )}

      {/* Modal PDF */}
      <PDFModalViewer
        isOpen={modalPDFOpen}
        onClose={handleCerrarPDF}
        title={`Formulario RAR #${datosPDF?.interno || datosPDF?.InternoFormularioRAR || ''}`}
        pdfComponent={FormularioRARPDF}
        pdfProps={{ datos: datosPDF }}
      />
    </div>
  );
};

export default FormulariosRAR;
