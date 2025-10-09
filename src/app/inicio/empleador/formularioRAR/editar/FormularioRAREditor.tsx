// 'use client';
// import React from 'react';
// import { Text, View } from '@react-pdf/renderer';
// import { 
//   TextField, MenuItem, Select, InputLabel, 
//   FormControl
// } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material/Select';
// import dayjs from 'dayjs';
// import 'dayjs/locale/es';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

// import Formato from '../../../../../utils/Formato';
// import CustomButton from '../../../../../utils/ui/button/CustomButton';
// import DataTableImport from '../../../../../utils/ui/table/DataTable';
// import CustomModal from '../../../../../utils/ui/form/CustomModal';
// import BaseDocumentPDF from '../../../../../utils/PDF/BaseDocumentPDF';
// import PDFModalViewer from '../../../../../utils/PDF/PDFModalViewer';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// import styles from "../FormulariosRAR.module.css";

// /* dayjs setup */
// dayjs.extend(customParseFormat);
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.locale('es');

// /* Helpers de fecha (sin cambios funcionales) */
// const formatearFecha = (fecha: string | Date | null | undefined, formato: string = 'DD/MM/YYYY'): string => {
//   if (!fecha) return '';
//   return dayjs(fecha).format(formato);
// };
// const fechaFormatter = (v: any) => Formato.Fecha(v);
// const cuipFormatter = (v: any) => Formato.CUIP(v);

// /** ===========================
//  *   PROPS DEL EDITOR
//  *  =========================== */
// interface NuevoFormularioRARProps {
//   cuit: number;
//   internoEstablecimiento: number;
//   referenteDatos?: unknown;
//   finalizaCarga: (ret?: boolean) => void;
//   edita: number;
//   registroSeleccionado?: any;
// }
// type EditorProps = NuevoFormularioRARProps & { formulariosRAR: any[] };

// /** ===========================
//  *   HEADER PDF (FUNCIONAL)
//  *  =========================== */
// const SimpleHeader: React.FC = () => (
//   <View style={{ backgroundColor: '#83BC00', padding: 10, marginBottom: 10 }}>
//     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
//       Formulario RAR - Sistema ART
//     </Text>
//   </View>
// );

// /** ===========================
//  *   EDITOR (antes NuevoFormularioRAR)
//  *  =========================== */
// const FormularioRAREditor: React.FC<EditorProps> = ({
//   cuit, internoEstablecimiento, finalizaCarga, edita, formulariosRAR, registroSeleccionado
// }) => {
//   const [cantExpuestos, setCantExpuestos] = React.useState<string>('');
//   const [cantNoExpuestos, setCantNoExpuestos] = React.useState<string>('');
//   const [descripcion, setDescripcion] = React.useState<string>('');
//   const [generar, setGenerar] = React.useState<boolean>(false);
//   const guardandoRef = React.useRef(false);

//   const [totalTrabajadores, setTotalTrabajadores] = React.useState<number>(0);
//   const [cuitActual, setCuitActual] = React.useState<string>('');
//   const [razonSocialActual, setRazonSocialActual] = React.useState<string>('');

//   const [opcionesEstablecimientos, setOpcionesEstablecimientos] = React.useState<Array<{
//     interno: string; domicilioCalle: string; displayText: string;
//   }>>([]);

//   // Estados para agentes causantes
//   const [agentesCausantes, setAgentesCausantes] = React.useState<Array<{
//     interno: number; codigo: number; agenteCausante: string; agenteTipo: string; displayText: string;
//   }>>([]);

//   React.useEffect(() => {
//     const fila = formulariosRAR.find(f => (f.cuit || f.CUIT) && (f.razonSocial || f.RazonSocial));
//     if (fila) {
//       setCuitActual(String(fila.cuit || fila.CUIT || ''));
//       setRazonSocialActual(String(fila.razonSocial || fila.RazonSocial || ''));
//     }
//     const cuitParaConsulta = fila?.cuit || fila?.CUIT || cuit;
//     if (!cuitParaConsulta) { setOpcionesEstablecimientos([]); return; }

//     (async () => {
//       try {
//         const resp = await fetch(`http://arttest.intersistemas.ar:8302/api/Establecimientos/Empresa/${cuitParaConsulta}`);
//         if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
//         const establecimientos = await resp.json();
//         const establecimientosArray = Array.isArray(establecimientos)
//           ? establecimientos
//           : establecimientos?.data
//             ? (Array.isArray(establecimientos.data) ? establecimientos.data : [establecimientos.data])
//             : [establecimientos];

//         const opciones = establecimientosArray
//           .filter((est: any) => est && (est.domicilioCalle || est.interno))
//           .map((est: any) => ({
//             interno: String(est.interno || ''),
//             domicilioCalle: String(est.domicilioCalle || ''),
//             displayText: `${est.interno || 'S/C'} - ${est.domicilioCalle || 'Sin dirección'}`
//           }));
//         setOpcionesEstablecimientos(opciones);
//       } catch (e) {
//         console.error('Error consultando establecimientos:', e);
//         setOpcionesEstablecimientos([]);
//       }
//     })();

//     // Cargar agentes causantes
//     (async () => {
//       try {
//         const respAgentes = await fetch('http://arttest.intersistemas.ar:8302/api/AgentesCausantes');
//         if (!respAgentes.ok) throw new Error(`HTTP error! status: ${respAgentes.status}`);
//         const agentes = await respAgentes.json();
        
//         const agentesArray = Array.isArray(agentes)
//           ? agentes
//           : agentes?.data
//             ? (Array.isArray(agentes.data) ? agentes.data : [agentes.data])
//             : [agentes];

//         const opcionesAgentes = agentesArray
//           .filter((agente: any) => agente && (agente.codigo || agente.agenteCausante))
//           .map((agente: any) => ({
//             interno: Number(agente.interno || 0),
//             codigo: Number(agente.codigo || 0),
//             agenteCausante: String(agente.agenteCausante || ''),
//             agenteTipo: String(agente.agenteTipo || ''),
//             displayText: `${agente.codigo || 'S/C'} - ${agente.agenteCausante || 'Sin descripción'}`
//           }));
        
//         setAgentesCausantes(opcionesAgentes);
//         console.log(`Se cargaron ${opcionesAgentes.length} agentes causantes`);
//       } catch (e) {
//         console.error('Error consultando agentes causantes:', e);
//         setAgentesCausantes([]);
//       }
//     })();
//   }, [formulariosRAR, cuit]);

//   const [cuil, setCuil] = React.useState<string>('');
//   const [nombre, setNombre] = React.useState<string>('');
//   const [sector, setSector] = React.useState<string>('');
//   const [ingreso, setIngreso] = React.useState<string>('');
//   const [fechaInicio, setFechaInicio] = React.useState<string>('');
//   const [exposicion, setExposicion] = React.useState<string>('');
//   const [fechaFinExposicion, setFechaFinExposicion] = React.useState<string>('');
//   const [ultimoExamenMedico, setUltimoExamenMedico] = React.useState<string>('');
//   const [codigoAgente, setCodigoAgente] = React.useState<string>('');
//   const [filas, setFilas] = React.useState<any[]>([]);
//   const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = React.useState<string>('');
//   const [modalTrabajadorOpen, setModalTrabajadorOpen] = React.useState<boolean>(false);
//   const [modalCantidadesOpen, setModalCantidadesOpen] = React.useState<boolean>(false);
  
//   // Estados para edición de trabajadores
//   const [editandoTrabajador, setEditandoTrabajador] = React.useState<boolean>(false);
//   const [indiceTrabajadorEditando, setIndiceTrabajadorEditando] = React.useState<number>(-1);

//   const cargarDatosFormulario = React.useCallback(async (internoFormulario: number) => {
//     try {
//       const response = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${internoFormulario}`);
//       if (!response.ok) throw new Error(`Error al cargar formulario: ${response.status}`);
//       const data = await response.json();

//       setCantExpuestos(String(data.cantTrabajadoresExpuestos || 0));
//       setCantNoExpuestos(String(data.cantTrabajadoresNoExpuestos || 0));

//       const est = opcionesEstablecimientos.find(e => e.interno === String(data.internoEstablecimiento));
//       if (est) { setDescripcion(est.displayText); setEstablecimientoSeleccionado(est.interno); }

//       if (data.formularioRARDetalle?.length) {
//         const filasDetalle = data.formularioRARDetalle.map((d: any) => {
//           const codigoAgente = String(d.codigoAgente || d.CodigoAgente || '');
//           // Buscar el agente en la lista para obtener su información completa
//           const agenteEncontrado = agentesCausantes.find(agente => String(agente.codigo) === codigoAgente);
          
//           return {
//             CUIL: String(d.cuil || ''),
//             Nombre: d.nombre || '',
//             SectorTareas: d.sectorTarea || '',
//             Ingreso: d.fechaIngreso ? dayjs(d.fechaIngreso).format('YYYY-MM-DD') : '',
//             FechaFin: d.fechaInicioExposicion ? dayjs(d.fechaInicioExposicion).format('YYYY-MM-DD') : '',
//             Exposicion: `${d.horasExposicion || 0} horas`,
//             FechaFinExposicion: d.fechaFinExposicion ? dayjs(d.fechaFinExposicion).format('YYYY-MM-DD') : '',
//             UltimoExamenMedico: d.fechaUltimoExamenMedico ? dayjs(d.fechaUltimoExamenMedico).format('YYYY-MM-DD') : '',
//             CodigoAgente: codigoAgente,
//             AgenteCausanteDisplay: agenteEncontrado ? agenteEncontrado.displayText : codigoAgente
//           };
//         });
//         setFilas(filasDetalle);
//         const total = (data.cantTrabajadoresExpuestos || 0) + (data.cantTrabajadoresNoExpuestos || 0);
//         setTotalTrabajadores(total);
//         setGenerar(true);
//       }
//     } catch (error) {
//       console.error('Error cargando datos del formulario:', error);
//       alert(`Error al cargar los datos del formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
//     }
//   }, [opcionesEstablecimientos, agentesCausantes]);

//   React.useEffect(() => {
//     if (edita && edita > 0) cargarDatosFormulario(edita);
//   }, [edita, cargarDatosFormulario]);

//   const handleAbrirModalTrabajador = () => setModalTrabajadorOpen(true);
//   const handleCerrarModalTrabajador = () => setModalTrabajadorOpen(false);
//   const handleAbrirModalCantidades = () => setModalCantidadesOpen(true);
//   const handleCerrarModalCantidades = () => setModalCantidadesOpen(false);

//   const numerosValidos = (v: string) => {
//     const valor = v.trim();
//     if (valor === '') return false;
//     const num = Number(valor);
//     return !Number.isNaN(num) && num >= 0 && Number.isInteger(num) && num <= 99999;
//   };

//   const manejarCambioNumerico = (valor: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
//     const valorLimpio = valor.replace(/[^0-9]/g, '');
//     if (valorLimpio.length <= 5) {
//       setter(valorLimpio);
//     }
//   };
//   const puedeGenerar = descripcion.trim() !== '' &&
//     numerosValidos(cantExpuestos) &&
//     numerosValidos(cantNoExpuestos) &&
//     establecimientoSeleccionado.trim() !== '';

//   const handleConfirmarCantidades = () => {
//     if (!numerosValidos(cantExpuestos) || !numerosValidos(cantNoExpuestos)) {
//       alert('Por favor, ingrese números válidos para las cantidades de trabajadores.');
//       return;
//     }

//     const expuestos = Number(cantExpuestos);
//     const noExpuestos = Number(cantNoExpuestos);
//     const total = expuestos + noExpuestos;

//     if (total === 0) {
//       alert('El total de trabajadores debe ser mayor a 0.');
//       return;
//     }

//     if (total > 99999) {
//       alert('El total de trabajadores no puede exceder 99,999.');
//       return;
//     }

//     if (puedeGenerar) {
//       setTotalTrabajadores(total);
//       setGenerar(true);
//       handleCerrarModalCantidades();
//     }
//   };

//   const camposTrabajador = [cuil, nombre, sector, ingreso, fechaInicio, exposicion, fechaFinExposicion, ultimoExamenMedico, codigoAgente];
//   const trabajadorCompleto = camposTrabajador.every(c => c && c.trim() !== '') && cuil.length >= 11;

//   const handleCargarFila = () => {
//     if (!trabajadorCompleto) return;
    
//     if (!editandoTrabajador) {
//       if (filas.length >= totalTrabajadores) {
//         alert('Ya alcanzó el límite máximo de trabajadores');
//         return;
//       }
      
//       const cuilExiste = filas.some(f => f.CUIL === cuil.trim());
//       if (cuilExiste) { 
//         alert('Este CUIL ya fue cargado'); 
//         return; 
//       }
//     } else {
//       const cuilExiste = filas.some((f, index) => f.CUIL === cuil.trim() && index !== indiceTrabajadorEditando);
//       if (cuilExiste) { 
//         alert('Este CUIL ya existe en otro trabajador'); 
//         return; 
//       }
//     }
    
//     const agenteSeleccionado = agentesCausantes.find(agente => String(agente.codigo) === codigoAgente.trim());
    
//     const datosTrabajador = {
//       CUIL: cuil.trim(),
//       Nombre: nombre.trim(),
//       SectorTareas: sector.trim(),
//       Ingreso: ingreso.trim(),
//       FechaFin: fechaInicio.trim(),
//       Exposicion: exposicion.trim(),
//       FechaFinExposicion: fechaFinExposicion.trim(),
//       UltimoExamenMedico: ultimoExamenMedico.trim(),
//       CodigoAgente: codigoAgente.trim(),
//       AgenteCausanteDisplay: agenteSeleccionado ? agenteSeleccionado.displayText : codigoAgente.trim(),
//     };
    
//     if (editandoTrabajador) {
//       const nuevasFilas = [...filas];
//       nuevasFilas[indiceTrabajadorEditando] = datosTrabajador;
//       setFilas(nuevasFilas);
//       setEditandoTrabajador(false);
//       setIndiceTrabajadorEditando(-1);
//     } else {
//       setFilas(prev => [...prev, datosTrabajador]);
//     }
    
//     handleBorrarCampos();
//     handleCerrarModalTrabajador();
//   };

//   const handleBorrarCampos = () => {
//     [setCuil, setNombre, setSector, setIngreso, setFechaInicio, setExposicion, setFechaFinExposicion, setUltimoExamenMedico, setCodigoAgente]
//       .forEach(setter => setter(''));
//   };

//   const handleEditarTrabajador = (index: number) => {
//     const trabajador = filas[index];
//     setCuil(trabajador.CUIL);
//     setNombre(trabajador.Nombre);
//     setSector(trabajador.SectorTareas);
//     setIngreso(trabajador.Ingreso);
//     setFechaInicio(trabajador.FechaFin);
//     setExposicion(trabajador.Exposicion);
//     setFechaFinExposicion(trabajador.FechaFinExposicion);
//     setUltimoExamenMedico(trabajador.UltimoExamenMedico);
//     setCodigoAgente(trabajador.CodigoAgente);
//     setEditandoTrabajador(true);
//     setIndiceTrabajadorEditando(index);
//     setModalTrabajadorOpen(true);
//   };

//   const handleEliminarTrabajador = (index: number) => {
//     if (window.confirm('¿Está seguro que desea eliminar este trabajador?')) {
//       const nuevasFilas = filas.filter((_, i) => i !== index);
//       setFilas(nuevasFilas);
//     }
//   };

//   const handleCancelarEdicion = () => {
//     setEditandoTrabajador(false);
//     setIndiceTrabajadorEditando(-1);
//     handleBorrarCampos();
//     handleCerrarModalTrabajador();
//   };

//   const handleGuardar = async () => {
//     console.log('Iniciando guardado...');
    
//     if (!cantExpuestos && !cantNoExpuestos) {
//       alert('Debe ingresar al menos una cantidad de trabajadores');
//       return;
//     }
    
//     if (!establecimientoSeleccionado || Number(establecimientoSeleccionado) === 0) {
//       alert('Debe seleccionar un establecimiento válido');
//       return;
//     }

//     if (guardandoRef.current) {
//       console.log('⚠️ Ya se está guardando, abortando...');
//       return;
//     }
    
//     if (filas.length === 0) { 
//       console.log('❌ Error: No hay trabajadores cargados');
//       alert('Debe cargar al menos un trabajador antes de guardar'); 
//       return; 
//     }
    
//     guardandoRef.current = true;
    
//     try {
//       const fechaActual = dayjs().toISOString();
//       const internoEstablecimientoFinal = Number(establecimientoSeleccionado) || 0;
//       const establecimientoParaEnvio = internoEstablecimientoFinal || internoEstablecimiento || 0;

//       const esEdicionFormularioCompleto = edita && edita > 0;
//       console.log('Modo edición:', esEdicionFormularioCompleto);
      
//       let formulariosRARDetalle: any[] = [];
      
//       if (esEdicionFormularioCompleto) {
//         try {
//           console.log('Obteniendo detalles existentes...');
//           const responseExistente = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`);
//           if (responseExistente.ok) {
//             const datosExistentes = await responseExistente.json();
//             let detallesExistentes = datosExistentes.formularioRARDetalle || [];
            
//             filas.forEach((fila: any) => {
//               const cuilFila = String(fila.CUIL || '').replace(/\D/g, '');
//               const indiceExistente = detallesExistentes.findIndex((d: any) => 
//                 String(d.cuil || d.Cuil || d.CUIL || '').replace(/\D/g, '') === cuilFila
//               );
              
//               const detalleActualizado = {
//                 internoFormulariosRar: indiceExistente >= 0 ? (detallesExistentes[indiceExistente].id || detallesExistentes[indiceExistente].internoFormulariosRar || 0) : 0,
//                 cuil: Number(cuilFila || 0),
//                 nombre: fila.Nombre || '',
//                 sectorTarea: fila.SectorTareas || '',
//                 fechaIngreso: dayjs(fila.Ingreso || fechaActual).toISOString(),
//                 horasExposicion: Number(fila.Exposicion?.replace(/[^\d]/g, '')) || 4,
//                 fechaUltimoExamenMedico: dayjs(fila.UltimoExamenMedico || fechaActual).toISOString(),
//                 codigoAgente: Number(fila.CodigoAgente) || 1,
//                 fechaInicioExposicion: dayjs(fila.FechaFin || fechaActual).toISOString(),
//                 fechaFinExposicion: dayjs(fila.FechaFinExposicion || fechaActual).toISOString()
//               };
              
//               if (indiceExistente >= 0) {
//                 detallesExistentes[indiceExistente] = detalleActualizado;
//               } else {
//                 detallesExistentes.push(detalleActualizado);
//               }
//             });
            
//             formulariosRARDetalle = detallesExistentes;
//           } else {
//             throw new Error('No se pudieron obtener los datos existentes');
//           }
//         } catch (error) {
//           console.error('❌ Error obteniendo detalles existentes:', error);
//           formulariosRARDetalle = filas.map((fila: any) => ({
//             internoFormulariosRar: 0,
//             cuil: Number(fila.CUIL?.replace(/\D/g, '') || 0),
//             nombre: fila.Nombre || '',
//             sectorTarea: fila.SectorTareas || '',
//             fechaIngreso: dayjs(fila.Ingreso || fechaActual).toISOString(),
//             horasExposicion: Number(fila.Exposicion?.replace(/[^\d]/g, '')) || 4,
//             fechaUltimoExamenMedico: dayjs(fila.UltimoExamenMedico || fechaActual).toISOString(),
//             codigoAgente: Number(fila.CodigoAgente) || 1,
//             fechaInicioExposicion: dayjs(fila.FechaFin || fechaActual).toISOString(),
//             fechaFinExposicion: dayjs(fila.FechaFinExposicion || fechaActual).toISOString()
//           }));
//         }
//       } else {
//         formulariosRARDetalle = filas.map((fila: any) => ({
//           internoFormulariosRar: 0,
//           cuil: Number(fila.CUIL?.replace(/\D/g, '') || 0),
//           nombre: fila.Nombre || '',
//           sectorTarea: fila.SectorTareas || '',
//           fechaIngreso: dayjs(fila.Ingreso || fechaActual).toISOString(),
//           horasExposicion: Number(fila.Exposicion?.replace(/[^\d]/g, '')) || 4,
//           fechaUltimoExamenMedico: dayjs(fila.UltimoExamenMedico || fechaActual).toISOString(),
//           codigoAgente: Number(fila.CodigoAgente) || 1,
//           fechaInicioExposicion: dayjs(fila.FechaFin || fechaActual).toISOString(),
//           fechaFinExposicion: dayjs(fila.FechaFinExposicion || fechaActual).toISOString()
//         }));
//       }

//       let datosParaEnviar;
//       if (esEdicionFormularioCompleto) {
//         datosParaEnviar = {
//           cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
//           cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
//           fechaCreacion: new Date().toISOString(),
//           fechaPresentacion: new Date().toISOString(),
//           internoPresentacion: 0,
//           internoEstablecimiento: establecimientoParaEnvio,
//           formularioRARDetalle: formulariosRARDetalle
//         };
//       } else {
//         datosParaEnviar = {
//           cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
//           cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
//           fechaCreacion: fechaActual,
//           fechaPresentacion: fechaActual,
//           internoPresentacion: 0,
//           internoEstablecimiento: establecimientoParaEnvio,
//           formularioRARDetalle: formulariosRARDetalle
//         };
//       }

//       const metodo = esEdicionFormularioCompleto ? 'PUT' : 'POST';
//       const url = esEdicionFormularioCompleto
//         ? `http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`
//         : 'http://arttest.intersistemas.ar:8302/api/FormulariosRAR';

//       const respuesta = await fetch(url, {
//         method: metodo,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(datosParaEnviar)
//       });

//       if (!respuesta.ok) {
//         const errorText = await respuesta.text();
//         console.error('Error del servidor:', errorText);
//         throw new Error(`Error del servidor (${respuesta.status}): ${errorText}`);
//       }

//       const mensaje = esEdicionFormularioCompleto 
//         ? 'Formulario RAR actualizado exitosamente'
//         : 'Formulario RAR creado exitosamente';
      
//       alert(mensaje);
//       finalizaCarga(true);

//     } catch (error) {
//       console.error('Error al guardar:', error);
//       alert(`Error al guardar el formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
//     } finally {
//       guardandoRef.current = false;
//     }
//   };

//   const handleGenerar = () => {
//     if (!puedeGenerar) return;
//     if (!numerosValidos(cantExpuestos) || !numerosValidos(cantNoExpuestos)) {
//       alert('Por favor, ingrese números válidos para las cantidades de trabajadores.');
//       return;
//     }
//     const total = Number(cantExpuestos) + Number(cantNoExpuestos);
//     if (total === 0) {
//       alert('El total de trabajadores debe ser mayor a 0.');
//       return;
//     }
//     setTotalTrabajadores(total);
//     setGenerar(true);
//   };

//   const llegoAlTope = generar && totalTrabajadores > 0 && filas.length >= totalTrabajadores;

//   // PDF del editor (sin uso externo acá, conservado por si lo usás)
//   const FormularioRARPDF = ({ datos }: { datos: any }) => {
//     if (!datos) return null;
//     const columnas = [
//       { key: 'interno', title: 'Interno', width: '10%' },
//       { key: 'cuit', title: 'CUIT', width: '15%' },
//       { key: 'razonSocial', title: 'Razón Social', width: '25%' },
//       { key: 'direccion', title: 'Dirección', width: '20%' },
//       { key: 'estado', title: 'Estado', width: '10%' },
//       { key: 'cantTrabajadoresExpuestos', title: 'Expuestos', width: '10%' },
//       { key: 'cantTrabajadoresNoExpuestos', title: 'No Expuestos', width: '10%' }
//     ];
//     const datosFormateados = [{
//       interno: datos.interno || datos.InternoFormularioRAR || '',
//       cuit: cuipFormatter(datos.cuit || datos.CUIT || ''),
//       razonSocial: datos.razonSocial || datos.RazonSocial || '',
//       direccion: datos.direccion || datos.Direccion || '',
//       estado: datos.estado || datos.Estado || '',
//       cantTrabajadoresExpuestos: datos.cantTrabajadoresExpuestos || datos.CantTrabExpuestos || 0,
//       cantTrabajadoresNoExpuestos: datos.cantTrabajadoresNoExpuestos || datos.CantTrabNoExpuestos || 0
//     }];

//     return (
//       <BaseDocumentPDF
//         title={`Formulario RAR #${datos.interno || datos.InternoFormularioRAR}`}
//         headerComponent={SimpleHeader}
//         columns={columnas}
//         data={datosFormateados}
//         orientation="landscape"
//         itemsPerPage={1}
//         customStyles={{}}
//         renderCustomContent={() => (
//           <>
//             <Text style={{ fontSize: 10, marginBottom: 10, textAlign: 'center' }}>
//               Fecha de creación: {formatearFecha(datos.fechaCreacion || datos.FechaHoraCreacion)}
//             </Text>
//             <Text style={{ fontSize: 10, marginBottom: 10, textAlign: 'center' }}>
//               Fecha de presentación: {formatearFecha(datos.fechaPresentacion || datos.FechaHoraConfirmado)}
//             </Text>
//           </>
//         )}
//       />
//     );
//   };

//   return (
//     <div className={`${styles.wrapperCol}`}>
//       <h2>{edita ? `Editar Formulario RAR #${edita}` : 'Crear Nuevo Formulario RAR'}</h2>

//       <div className={`${styles.row} ${styles.mb20} ${styles.alignCenter}`}>
//         <TextField
//           label="CUIT del Empleador a Registrar"
//           value={cuitActual}
//           fullWidth
//           disabled
//           InputProps={{ readOnly: true }}
//           className={`${styles.centeredInput} ${styles.flex1}`}
//         />
//         <TextField
//           label="Razón Social"
//           value={razonSocialActual}
//           fullWidth
//           disabled
//           InputProps={{ readOnly: true }}
//           className={`${styles.centeredInput} ${styles.flex1}`}
//         />
//       </div>

//       <div>
//         <FormControl fullWidth required disabled={establecimientoSeleccionado !== ''}>
//           <InputLabel>Establecimiento</InputLabel>
//           <Select
//             name="establecimiento"
//             value={descripcion}
//             label="Establecimiento"
//             onChange={(e: SelectChangeEvent<string>) => {
//               const value = e.target.value;
//               setDescripcion(value);
//               const sel = opcionesEstablecimientos.find(o => o.displayText === value);
//               setEstablecimientoSeleccionado(sel ? sel.interno : '');
//             }}
//           >
//             <MenuItem value="">Seleccione un establecimiento</MenuItem>
//             {opcionesEstablecimientos.length === 0 ? (
//               <MenuItem disabled value="">No hay establecimientos disponibles</MenuItem>
//             ) : (
//               opcionesEstablecimientos.map((op, idx) => (
//                 <MenuItem key={`${op.interno}-${idx}`} value={op.displayText}>
//                   {op.displayText}
//                 </MenuItem>
//               ))
//             )}
//           </Select>
//         </FormControl>

//         {descripcion && !generar && (
//           <div className={`${styles.btnCenter} ${styles.mt40}`}>
//             <CustomButton onClick={handleAbrirModalCantidades}>
//               Configurar Cantidades de Trabajadores
//             </CustomButton>
//           </div>
//         )}

//         {descripcion && generar && (
//           <div className={styles.summaryBox}>
//             <div className={`${styles.flex} ${styles.spaceBetween} ${styles.alignCenter}`}>
//               <div>
//                 <strong>Configuración del Formulario:</strong><br />
//                 Trabajadores Expuestos: <strong>{cantExpuestos}</strong><br />
//                 Trabajadores NO Expuestos: <strong>{cantNoExpuestos}</strong>
//               </div>
//               <CustomButton onClick={handleAbrirModalCantidades} className={styles.btnSmall}>
//                 Modificar
//               </CustomButton>
//             </div>
//           </div>
//         )}

//         {generar && totalTrabajadores > 0 && !llegoAlTope && (
//           <div className={`${styles.btnCenter} ${styles.mt20}`}>
//             <CustomButton onClick={handleAbrirModalTrabajador}>
//               Agregar Trabajador ({filas.length}/{totalTrabajadores})
//             </CustomButton>
//           </div>
//         )}

//         {filas.length > 0 && (
//           <div className={styles.tableBlock}>
//             <span className={`${styles.bold} ${styles.fs20}`}>Datos del Trabajador:</span>
//             <DataTableImport
//               columns={[
//                 { accessorKey: 'CUIL', header: 'CUIL' },
//                 { accessorKey: 'Nombre', header: 'Nombre' },
//                 { accessorKey: 'SectorTareas', header: 'Sector/Tareas' },
//                 { accessorKey: 'Ingreso', header: 'Ingreso' },
//                 { accessorKey: 'FechaFin', header: 'Fecha de fin' },
//                 { accessorKey: 'Exposicion', header: 'Exposición' },
//                 { accessorKey: 'FechaFinExposicion', header: 'Fecha Fin Exposición' },
//                 { accessorKey: 'UltimoExamenMedico', header: 'Ult. Examen Médico' },
//                 { accessorKey: 'AgenteCausanteDisplay', header: 'Agente Causante' },
//                 {
//                   id: 'acciones',
//                   header: 'Acciones',
//                   cell: ({ row }: { row: any }) => {
//                     const index = filas.findIndex(fila => 
//                       fila.CUIL === row.original.CUIL && 
//                       fila.Nombre === row.original.Nombre
//                     );
//                     return (
//                       <div className={`${styles.flex} ${styles.gap8}`}>
//                         <CustomButton
//                           onClick={(e: any) => {
//                             e.stopPropagation?.();
//                             handleEditarTrabajador(index);
//                           }}
//                           // className={styles.tableBtnSmall}
//                           // style={{ backgroundColor: '#2196F3', color: 'white' }}
//                         >
//                           <EditIcon />
//                         </CustomButton>
//                         <CustomButton
//                           onClick={(e: any) => {
//                             e.stopPropagation?.();
//                             handleEliminarTrabajador(index);
//                           }}
//                           // className={styles.tableBtnSmall}
//                           // style={{ backgroundColor: '#f44336', color: 'white' }}
//                         >
//                           <DeleteIcon />
//                         </CustomButton>
//                       </div>
//                     );
//                   },
//                   enableSorting: false,
//                 }
//               ]}
//               data={filas}
//             />
//           </div>
//         )}
//       </div>

//       <div className={`${styles.flex} ${styles.gap8} ${styles.mt40}`}>
//         <CustomButton
//           onClick={handleGuardar}
//           disabled={!llegoAlTope || filas.length === 0 || filas.length < totalTrabajadores}
//         >
//           Guardar
//         </CustomButton>
//         <CustomButton onClick={() => finalizaCarga(false)}>Cancelar</CustomButton>
//       </div>

//       {/* MODAL trabajador */}
//       <CustomModal
//         open={modalTrabajadorOpen}
//         onClose={editandoTrabajador ? handleCancelarEdicion : handleCerrarModalTrabajador}
//         title={editandoTrabajador ? "Editar Trabajador Expuesto" : "Datos del Trabajador Expuesto"}
//         size="large"
//       >
//         <div className={styles.modalGridCol}>
//           <div className={styles.modalRow}>
//             <TextField
//               label="CUIL"
//               name="cuil"
//               value={cuil}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/[^0-9]/g, '');
//                 if (value.length <= 11) {
//                   let formatted = value;
//                   if (value.length > 2) formatted = value.substring(0, 2) + '-' + value.substring(2);
//                   if (value.length > 10) formatted = value.substring(0, 2) + '-' + value.substring(2, 10) + '-' + value.substring(10);
//                   setCuil(formatted);
//                 }
//               }}
//               fullWidth
//               required
//               placeholder="XX-XXXXXXXX-X"
//               inputProps={{ maxLength: 13 }}
//               className={styles.flex1}
//             />
//             <TextField
//               label="Nombre"
//               name="nombre"
//               value={nombre}
//               onChange={(e) => setNombre(e.target.value)}
//               fullWidth
//               required
//               placeholder="Nombre completo"
//               className={styles.flex1}
//             />
//           </div>

//           <div className={styles.modalRow}>
//             <TextField
//               label="Sector/Tareas"
//               name="sector"
//               value={sector}
//               onChange={(e) => setSector(e.target.value)}
//               fullWidth
//               required
//               placeholder="Descripción del sector o tareas"
//               className={styles.flex1}
//             />
//             <TextField
//               label="Ingreso"
//               name="ingreso"
//               type="date"
//               value={ingreso}
//               onChange={(e) => setIngreso(e.target.value)}
//               fullWidth
//               required
//               InputLabelProps={{ shrink: true }}
//               className={styles.flex1}
//             />
//           </div>

//           <div className={styles.modalRow}>
//             <TextField
//               label="Fecha Inicio"
//               name="fechaInicio"
//               type="date"
//               value={fechaInicio}
//               onChange={(e) => setFechaInicio(e.target.value)}
//               fullWidth
//               required
//               InputLabelProps={{ shrink: true }}
//               className={styles.flex1}
//             />
//             <TextField
//               label="Exposición"
//               name="exposicion"
//               value={exposicion}
//               onChange={(e) => setExposicion(e.target.value)}
//               fullWidth
//               required
//               placeholder="Tipo de exposición"
//               className={styles.flex1}
//             />
//           </div>

//           <div className={styles.modalRow}>
//             <TextField
//               label="Fecha Fin Exposición"
//               name="fechaFinExposicion"
//               type="date"
//               value={fechaFinExposicion}
//               onChange={(e) => setFechaFinExposicion(e.target.value)}
//               fullWidth
//               required
//               InputLabelProps={{ shrink: true }}
//               className={styles.flex1}
//             />
//             <TextField
//               label="Último Examen Médico"
//               name="ultimoExamenMedico"
//               type="date"
//               value={ultimoExamenMedico}
//               onChange={(e) => setUltimoExamenMedico(e.target.value)}
//               fullWidth
//               required
//               InputLabelProps={{ shrink: true }}
//               className={styles.flex1}
//             />
//           </div>

//           <div className={styles.modalRow}>
//             <FormControl fullWidth required className={styles.flex1}>
//               <InputLabel>Agente Causante</InputLabel>
//               <Select
//                 name="codigoAgente"
//                 value={codigoAgente}
//                 label="Agente Causante"
//                 onChange={(e: SelectChangeEvent<string>) => {
//                   setCodigoAgente(e.target.value);
//                 }}
//               >
//                 <MenuItem value="">Seleccione un agente causante</MenuItem>
//                 {agentesCausantes.length === 0 ? (
//                   <MenuItem disabled value="">No hay agentes causantes disponibles</MenuItem>
//                 ) : (
//                   agentesCausantes.map((agente, idx) => (
//                     <MenuItem key={`${agente.codigo}-${idx}`} value={String(agente.codigo)}>
//                       {agente.displayText}
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>
//             </FormControl>
//             <div className={styles.flex1}></div>
//           </div>

//           <div className={styles.modalButtons}>
//             <CustomButton 
//               onClick={handleCargarFila} 
//               disabled={!trabajadorCompleto || (!editandoTrabajador && filas.length >= totalTrabajadores)}
//               style={editandoTrabajador ? { backgroundColor: '#2196F3', color: 'white' } : {}}
//             >
//               {editandoTrabajador ? 'Actualizar Trabajador' : 'Cargar Trabajador'}
//             </CustomButton>
//             <CustomButton onClick={handleBorrarCampos}>Limpiar Campos</CustomButton>
//             <CustomButton onClick={editandoTrabajador ? handleCancelarEdicion : handleCerrarModalTrabajador}>
//               Cancelar
//             </CustomButton>
//           </div>
//         </div>
//       </CustomModal>

//       {/* MODAL cantidades */}
//       <CustomModal
//         open={modalCantidadesOpen}
//         onClose={handleCerrarModalCantidades}
//         title="Configurar Cantidades de Trabajadores"
//         size="mid"
//       >
//         <div className={styles.modalGridCol}>
//           <div className={styles.modalTextBlock}>
//             <p className={styles.modalTextGray}>
//               Ingrese la cantidad de trabajadores expuestos y no expuestos para el establecimiento:
//             </p>
//             <p className={styles.modalTextBold}>{descripcion}</p>
//           </div>

//           <TextField
//             label="Cantidad de Trabajadores Expuestos"
//             name="cantExpuestos"
//             type="text"
//             value={cantExpuestos}
//             onChange={e => manejarCambioNumerico(e.target.value, setCantExpuestos)}
//             fullWidth
//             required
//             placeholder="Ingrese cantidad de expuestos"
//             inputProps={{ 
//               min: 0, 
//               max: 99999,
//               inputMode: 'numeric',
//               pattern: '[0-9]*'
//             }}
//             className={styles.centeredInput}
//             error={cantExpuestos !== '' && !numerosValidos(cantExpuestos)}
//             helperText={cantExpuestos !== '' && !numerosValidos(cantExpuestos) ? 'Ingrese un número válido entre 0 y 99999' : ''}
//           />

//           <TextField
//             label="Cantidad de Trabajadores NO Expuestos"
//             name="cantNoExpuestos"
//             type="text"
//             value={cantNoExpuestos}
//             onChange={e => manejarCambioNumerico(e.target.value, setCantNoExpuestos)}
//             fullWidth
//             required
//             placeholder="Ingrese cantidad de no expuestos"
//             inputProps={{ 
//               min: 0, 
//               max: 99999,
//               inputMode: 'numeric',
//               pattern: '[0-9]*'
//             }}
//             className={styles.centeredInput}
//             error={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos)}
//             helperText={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos) ? 'Ingrese un número válido entre 0 y 99999' : ''}
//           />

//           {(cantExpuestos || cantNoExpuestos) && (
//             <div className={styles.totalBox}>
//               <strong>Total de Trabajadores: {(Number(cantExpuestos) || 0) + (Number(cantNoExpuestos) || 0)}</strong>
//             </div>
//           )}

//           <div className={styles.modalButtons}>
//             <CustomButton onClick={handleConfirmarCantidades} disabled={!puedeGenerar}>
//               Confirmar y Generar
//             </CustomButton>
//             <CustomButton onClick={handleCerrarModalCantidades}>Cancelar</CustomButton>
//           </div>
//         </div>
//       </CustomModal>
//     </div>
//   );
// };

// export default FormularioRAREditor;

'use client';
import React from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CustomButton from '../../../../../utils/ui/button/CustomButton';
import DataTableImport from '../../../../../utils/ui/table/DataTable';
import CustomModal from '../../../../../utils/ui/form/CustomModal';
import styles from '../FormulariosRAR.module.css';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

/* ===== Tipos auxiliares ===== */
type EstablecimientoOpt = { interno: string; displayText: string };
type AgenteOpt = { codigo: number; displayText: string };

type FilaTrabajador = {
  CUIL: string;
  Nombre: string;
  SectorTareas: string;
  Ingreso: string;
  FechaFin: string; // (fechaInicioExposicion en API)
  Exposicion: string; // "X horas"
  FechaFinExposicion: string;
  UltimoExamenMedico: string;
  CodigoAgente: string;
};

interface EditarProps {
  edita: number; // ID del formulario a editar
  finalizaCarga: (ret?: boolean) => void;
}

const FormulariosRAREditar: React.FC<EditarProps> = ({ edita, finalizaCarga }) => {
  const [cantExpuestos, setCantExpuestos] = React.useState<string>('');
  const [cantNoExpuestos, setCantNoExpuestos] = React.useState<string>('');
  const [descripcion, setDescripcion] = React.useState<string>('');
  const [generar, setGenerar] = React.useState<boolean>(false);
  const guardandoRef = React.useRef(false);

  const [totalTrabajadores, setTotalTrabajadores] = React.useState<number>(0);
  const [opcionesEstablecimientos, setOpcionesEstablecimientos] = React.useState<EstablecimientoOpt[]>([]);
  const [agentesCausantes, setAgentesCausantes] = React.useState<AgenteOpt[]>([]);
  const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = React.useState<string>('');

  // trabajadores
  const [filas, setFilas] = React.useState<FilaTrabajador[]>([]);
  const [modalTrabajadorOpen, setModalTrabajadorOpen] = React.useState<boolean>(false);
  const [modalCantidadesOpen, setModalCantidadesOpen] = React.useState<boolean>(false);

  const [cuil, setCuil] = React.useState<string>('');
  const [nombre, setNombre] = React.useState<string>('');
  const [sector, setSector] = React.useState<string>('');
  const [ingreso, setIngreso] = React.useState<string>('');
  const [fechaInicio, setFechaInicio] = React.useState<string>('');
  const [exposicion, setExposicion] = React.useState<string>('');
  const [fechaFinExposicion, setFechaFinExposicion] = React.useState<string>('');
  const [ultimoExamenMedico, setUltimoExamenMedico] = React.useState<string>('');
  const [codigoAgente, setCodigoAgente] = React.useState<string>('');

  // Estados para edición
  const [editandoIndex, setEditandoIndex] = React.useState<number>(-1);
  const [modoEdicion, setModoEdicion] = React.useState<boolean>(false);

  // CARGA INICIAL
  React.useEffect(() => {
    (async () => {
      // detalle del formulario
      const r = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`);
      if (r.ok) {
        const data = await r.json();
        setCantExpuestos(String(data.cantTrabajadoresExpuestos || 0));
        setCantNoExpuestos(String(data.cantTrabajadoresNoExpuestos || 0));
        setTotalTrabajadores((data.cantTrabajadoresExpuestos || 0) + (data.cantTrabajadoresNoExpuestos || 0));

        // establecimientos por CUIT del formulario
        const cuitForm: string | number | undefined = data.cuit || data.CUIT;
        if (cuitForm) {
          const re = await fetch(`http://arttest.intersistemas.ar:8302/api/Establecimientos/Empresa/${cuitForm}`);
          const raw = re.ok ? await re.json() : [];
          const arr = Array.isArray(raw)
            ? raw
            : raw?.data
            ? Array.isArray(raw.data)
              ? raw.data
              : [raw.data]
            : [raw];

          const ests: EstablecimientoOpt[] = arr.map((est: any) => ({
            interno: String(est.interno || ''),
            displayText: `${est.interno || 'S/C'} - ${est.domicilioCalle || ''}`,
          }));

          setOpcionesEstablecimientos(ests);

          // ⛔️ Aquí estaba el error: tipamos el parámetro 'e'
          const actual = ests.find((e: EstablecimientoOpt) => String(e.interno) === String(data.internoEstablecimiento));
          setDescripcion(actual?.displayText || '');
          setEstablecimientoSeleccionado(actual?.interno || '');
        }

        // detalle trabajadores
        if (Array.isArray(data.formularioRARDetalle) && data.formularioRARDetalle.length) {
          const filasDetalle: FilaTrabajador[] = data.formularioRARDetalle.map((d: any) => ({
            CUIL: String(d.cuil || ''),
            Nombre: d.nombre || '',
            SectorTareas: d.sectorTarea || '',
            Ingreso: d.fechaIngreso ? dayjs(d.fechaIngreso).format('YYYY-MM-DD') : '',
            FechaFin: d.fechaInicioExposicion ? dayjs(d.fechaInicioExposicion).format('YYYY-MM-DD') : '',
            Exposicion: `${d.horasExposicion || 0} horas`,
            FechaFinExposicion: d.fechaFinExposicion ? dayjs(d.fechaFinExposicion).format('YYYY-MM-DD') : '',
            UltimoExamenMedico: d.fechaUltimoExamenMedico ? dayjs(d.fechaUltimoExamenMedico).format('YYYY-MM-DD') : '',
            CodigoAgente: String(d.codigoAgente || ''),
          }));
          setFilas(filasDetalle);
          setGenerar(true);
        }
      }

      // agentes
      const ra = await fetch('http://arttest.intersistemas.ar:8302/api/AgentesCausantes');
      const agents = ra.ok ? await ra.json() : [];
      const arrAg = Array.isArray(agents)
        ? agents
        : agents?.data
        ? Array.isArray(agents.data)
          ? agents.data
          : [agents.data]
        : [agents];

      const ags: AgenteOpt[] = arrAg.map((a: any) => ({
        codigo: Number(a.codigo || 0),
        displayText: `${a.codigo || 'S/C'} - ${a.agenteCausante || ''}`,
      }));
      setAgentesCausantes(ags);
    })();
  }, [edita]);

  const numerosValidos = (v: string) => {
    const n = Number(v.trim());
    return !Number.isNaN(n) && n >= 0 && Number.isInteger(n) && n <= 99999;
  };

  const manejarCambioNumerico = (valor: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const limpio = (valor ?? '').replace(/[^0-9]/g, '');
    if (limpio.length <= 5) setter(limpio);
  };

  const establecimientoSeleccionadoValido = establecimientoSeleccionado.trim() !== '';

  const puedeGenerar =
    descripcion.trim() !== '' &&
    numerosValidos(cantExpuestos) &&
    numerosValidos(cantNoExpuestos) &&
    establecimientoSeleccionado.trim() !== '';

  const confirmarCantidades = () => {
    if (!numerosValidos(cantExpuestos) || !numerosValidos(cantNoExpuestos)) return alert('Cantidades inválidas');
    const total = Number(cantExpuestos) + Number(cantNoExpuestos);
    if (total <= 0) return alert('El total debe ser > 0');
    setTotalTrabajadores(total);
    setGenerar(true);
    setModalCantidadesOpen(false);
  };

  const trabajadorCompleto =
    [cuil, nombre, sector, ingreso, fechaInicio, exposicion, fechaFinExposicion, ultimoExamenMedico, codigoAgente].every(
      (x) => x && x.trim() !== ''
    ) && cuil.replace(/\D/g, '').length >= 11;

  const cargarFila = () => {
    if (!trabajadorCompleto) return;

    if (modoEdicion) {
      const cuilExiste = filas.some((f, idx) => f.CUIL === cuil.trim() && idx !== editandoIndex);
      if (cuilExiste) return alert('Este CUIL ya existe en otro trabajador');

      setFilas((prev) => {
        const nuevas = [...prev];
        nuevas[editandoIndex] = {
          CUIL: cuil.trim(),
          Nombre: nombre.trim(),
          SectorTareas: sector.trim(),
          Ingreso: ingreso.trim(),
          FechaFin: fechaInicio.trim(),
          Exposicion: exposicion.trim(),
          FechaFinExposicion: fechaFinExposicion.trim(),
          UltimoExamenMedico: ultimoExamenMedico.trim(),
          CodigoAgente: codigoAgente.trim(),
        };
        return nuevas;
      });

      setModoEdicion(false);
      setEditandoIndex(-1);
      alert('Trabajador actualizado correctamente');
    } else {
      if (filas.length >= totalTrabajadores) return alert('Ya alcanzó el límite máximo de trabajadores');
      const cuilExiste = filas.some((f) => f.CUIL === cuil.trim());
      if (cuilExiste) return alert('Este CUIL ya fue cargado');

      setFilas((p) => [
        ...p,
        {
          CUIL: cuil.trim(),
          Nombre: nombre.trim(),
          SectorTareas: sector.trim(),
          Ingreso: ingreso.trim(),
          FechaFin: fechaInicio.trim(),
          Exposicion: exposicion.trim(),
          FechaFinExposicion: fechaFinExposicion.trim(),
          UltimoExamenMedico: ultimoExamenMedico.trim(),
          CodigoAgente: codigoAgente.trim(),
        },
      ]);
    }

    // Limpiar campos
    setCuil('');
    setNombre('');
    setSector('');
    setIngreso('');
    setFechaInicio('');
    setExposicion('');
    setFechaFinExposicion('');
    setUltimoExamenMedico('');
    setCodigoAgente('');
    setModalTrabajadorOpen(false);
  };

  const handleEditarTrabajador = (index: number) => {
    const trabajador = filas[index];
    if (!trabajador) return;
    setCuil(trabajador.CUIL || '');
    setNombre(trabajador.Nombre || '');
    setSector(trabajador.SectorTareas || '');
    setIngreso(trabajador.Ingreso || '');
    setFechaInicio(trabajador.FechaFin || '');
    setExposicion(trabajador.Exposicion || '');
    setFechaFinExposicion(trabajador.FechaFinExposicion || '');
    setUltimoExamenMedico(trabajador.UltimoExamenMedico || '');
    setCodigoAgente(trabajador.CodigoAgente || '');
    setEditandoIndex(index);
    setModoEdicion(true);
    setModalTrabajadorOpen(true);
  };

  const handleEliminarTrabajador = (index: number) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este trabajador?')) {
      setFilas((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCancelarEdicion = () => {
    setCuil('');
    setNombre('');
    setSector('');
    setIngreso('');
    setFechaInicio('');
    setExposicion('');
    setFechaFinExposicion('');
    setUltimoExamenMedico('');
    setCodigoAgente('');
    setEditandoIndex(-1);
    setModoEdicion(false);
    setModalTrabajadorOpen(false);
  };

  const guardar = async () => {
    if (guardandoRef.current) return;
    if (!establecimientoSeleccionado) return alert('Seleccione establecimiento');
    if (filas.length === 0) return alert('Cargue al menos un trabajador');

    guardandoRef.current = true;
    try {
      const fechaActual = new Date().toISOString();
      const detalle = filas.map((f) => ({
        internoFormulariosRar: 0,
        cuil: Number((f.CUIL || '').replace(/\D/g, '')),
        nombre: f.Nombre || '',
        sectorTarea: f.SectorTareas || '',
        fechaIngreso: new Date(f.Ingreso || fechaActual).toISOString(),
        horasExposicion: Number(String(f.Exposicion || '0').replace(/[^\d]/g, '')) || 4,
        fechaUltimoExamenMedico: new Date(f.UltimoExamenMedico || fechaActual).toISOString(),
        codigoAgente: Number(f.CodigoAgente) || 1,
        fechaInicioExposicion: new Date(f.FechaFin || fechaActual).toISOString(),
        fechaFinExposicion: new Date(f.FechaFinExposicion || fechaActual).toISOString(),
      }));

      const body = {
        cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
        cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
        fechaCreacion: fechaActual,
        fechaPresentacion: fechaActual,
        internoPresentacion: 0,
        internoEstablecimiento: Number(establecimientoSeleccionado) || 0,
        formularioRARDetalle: detalle,
      };

      const r = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!r.ok) throw new Error(await r.text());
      alert('Formulario RAR actualizado exitosamente');
      finalizaCarga(true);
    } catch (e: any) {
      console.error(e);
      alert(`Error al guardar: ${e?.message || e}`);
    } finally {
      guardandoRef.current = false;
    }
  };

  const llegoAlTope = generar && totalTrabajadores > 0 && filas.length >= totalTrabajadores;

  return (
    <div className={styles.wrapperCol}>
      <h2>{`Editar Formulario RAR #${edita}`}</h2>

      <FormControl fullWidth required disabled={!!establecimientoSeleccionado}>
        <InputLabel>Establecimiento</InputLabel>
        <Select
          value={descripcion}
          label="Establecimiento"
          onChange={(e: SelectChangeEvent<string>) => {
            const val = e.target.value;
            setDescripcion(val);
            const sel = opcionesEstablecimientos.find((o) => o.displayText === val);
            setEstablecimientoSeleccionado(sel ? sel.interno : '');
          }}
        >
          <MenuItem value="">Seleccione un establecimiento</MenuItem>
          {opcionesEstablecimientos.length === 0 ? (
            <MenuItem disabled value="">
              No hay establecimientos
            </MenuItem>
          ) : (
            opcionesEstablecimientos.map((op) => (
              <MenuItem key={op.interno} value={op.displayText}>
                {op.displayText}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* CANTIDADES */}
      <div
        style={{
          background: establecimientoSeleccionadoValido ? '#f8f9fa' : '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          marginTop: '20px',
          opacity: establecimientoSeleccionadoValido ? 1 : 0.6,
        }}
      >
        <h4
          style={{
            margin: '0 0 15px 0',
            color: establecimientoSeleccionadoValido ? '#495057' : '#9e9e9e',
          }}
        >
          Cantidades de Trabajadores <span style={{ color: '#d32f2f', fontSize: '16px' }}>*</span>
          {!establecimientoSeleccionadoValido && (
            <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>(Seleccioná primero un establecimiento)</span>
          )}
          {establecimientoSeleccionadoValido && (
            <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>(Requerido para habilitar datos del trabajador)</span>
          )}
        </h4>
        <div className={styles.modalRow}>
          <TextField
            label="Cantidad de Trabajadores Expuestos"
            name="cantExpuestos"
            type="text"
            value={cantExpuestos}
            onChange={(e) => manejarCambioNumerico(e.target.value, setCantExpuestos)}
            fullWidth
            required
            disabled={!establecimientoSeleccionadoValido}
            className={`${styles.centeredInput} ${styles.flex1}`}
            error={cantExpuestos !== '' && !numerosValidos(cantExpuestos)}
            helperText={cantExpuestos !== '' && !numerosValidos(cantExpuestos) ? 'Ingrese un número válido (0-99999)' : ''}
          />
          <TextField
            label="Cantidad de Trabajadores NO Expuestos"
            name="cantNoExpuestos"
            type="text"
            value={cantNoExpuestos}
            onChange={(e) => manejarCambioNumerico(e.target.value, setCantNoExpuestos)}
            fullWidth
            required
            disabled={!establecimientoSeleccionadoValido}
            className={`${styles.centeredInput} ${styles.flex1}`}
            error={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos)}
            helperText={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos) ? 'Ingrese un número válido (0-99999)' : ''}
          />
        </div>
        {(cantExpuestos || cantNoExpuestos) && (
          <div style={{ background: '#bbdefb', padding: '10px', borderRadius: '3px', marginTop: '10px', textAlign: 'center' }}>
            <strong>Total de Trabajadores: {(Number(cantExpuestos) || 0) + (Number(cantNoExpuestos) || 0)}</strong>
          </div>
        )}

        {establecimientoSeleccionadoValido && (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <CustomButton onClick={confirmarCantidades} disabled={!puedeGenerar} style={{ background: puedeGenerar ? '#2196f3' : '#cccccc', color: 'white' }}>
              {generar ? 'Actualizar Cantidades' : 'Confirmar y Generar'}
            </CustomButton>
          </div>
        )}
      </div>

      {generar && totalTrabajadores > 0 && !llegoAlTope && (
        <div className={`${styles.btnCenter} ${styles.mt20}`}>
          <CustomButton onClick={() => setModalTrabajadorOpen(true)}>
            Agregar Trabajador ({filas.length}/{totalTrabajadores})
          </CustomButton>
        </div>
      )}

      {filas.length > 0 && (
        <div className={styles.tableBlock}>
          <span className={`${styles.bold} ${styles.fs20}`}>Datos del Trabajador:</span>
          <DataTableImport
            columns={[
              { accessorKey: 'CUIL', header: 'CUIL' },
              { accessorKey: 'Nombre', header: 'Nombre' },
              { accessorKey: 'SectorTareas', header: 'Sector/Tareas' },
              { accessorKey: 'Ingreso', header: 'Ingreso' },
              { accessorKey: 'FechaFin', header: 'Fecha de fin' },
              { accessorKey: 'Exposicion', header: 'Exposición' },
              { accessorKey: 'FechaFinExposicion', header: 'Fecha Fin Exposición' },
              { accessorKey: 'UltimoExamenMedico', header: 'Ult. Examen Médico' },
              { accessorKey: 'CodigoAgente', header: 'Cód. Agente' },
              {
                id: 'acciones',
                header: 'Acciones',
                cell: ({ row }: { row: { original: FilaTrabajador } }) => {
                  const index = filas.findIndex(
                    (fila) => fila.CUIL === row.original.CUIL && fila.Nombre === row.original.Nombre
                  );
                  const onEnter = (e: React.MouseEvent<SVGSVGElement>) => {
                    (e.currentTarget as SVGElement).style.color = '#E4840C';
                  };
                  const onLeave = (e: React.MouseEvent<SVGSVGElement>) => {
                    (e.currentTarget as SVGElement).style.color = '#E4840C';
                  };
                  return (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                      <EditIcon
                        onClick={() => handleEditarTrabajador(index)}
                        style={{ fontSize: '20px', color: '#E4840C', cursor: 'pointer', transition: 'color 0.2s ease' }}
                        onMouseEnter={onEnter}
                        onMouseLeave={onLeave}
                      />
                      <DeleteIcon
                        onClick={() => handleEliminarTrabajador(index)}
                        style={{ fontSize: '20px', color: '#E4840C', cursor: 'pointer', transition: 'color 0.2s ease' }}
                        onMouseEnter={onEnter}
                        onMouseLeave={onLeave}
                      />
                    </div>
                  );
                },
                enableSorting: false,
              },
            ]}
            data={filas}
          />
        </div>
      )}

      <div className={`${styles.flex} ${styles.gap8} ${styles.mt40}`}>
        <CustomButton onClick={guardar} disabled={!generar || filas.length === 0 || filas.length < totalTrabajadores}>
          Guardar Cambios
        </CustomButton>
        <CustomButton onClick={() => finalizaCarga(false)}>Cancelar</CustomButton>
      </div>

      {/* MODAL Trabajador */}
      <CustomModal
        open={modalTrabajadorOpen}
        onClose={modoEdicion ? handleCancelarEdicion : () => setModalTrabajadorOpen(false)}
        title={modoEdicion ? 'Editar Trabajador Expuesto' : 'Datos del Trabajador Expuesto'}
        size="large"
      >
        <div className={styles.modalGridCol}>
          <div className={styles.modalRow}>
            <TextField
              label="CUIL"
              value={cuil}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, '');
                if (v.length <= 11) {
                  let formatted = v;
                  if (v.length > 2) formatted = v.substring(0, 2) + '-' + v.substring(2);
                  if (v.length > 10) formatted = v.substring(0, 2) + '-' + v.substring(2, 10) + '-' + v.substring(10);
                  setCuil(formatted);
                }
              }}
              fullWidth
              required
              placeholder="XX-XXXXXXXX-X"
              inputProps={{ maxLength: 13 }}
              className={styles.flex1}
            />
            <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth required className={styles.flex1} />
          </div>

          <div className={styles.modalRow}>
            <TextField label="Sector/Tareas" value={sector} onChange={(e) => setSector(e.target.value)} fullWidth required className={styles.flex1} />
            <TextField label="Ingreso" type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
          </div>

          <div className={styles.modalRow}>
            <TextField label="Fecha Inicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
            <TextField label="Exposición" value={exposicion} onChange={(e) => setExposicion(e.target.value)} fullWidth required className={styles.flex1} />
          </div>

          <div className={styles.modalRow}>
            <TextField label="Fecha Fin Exposición" type="date" value={fechaFinExposicion} onChange={(e) => setFechaFinExposicion(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
            <TextField label="Último Examen Médico" type="date" value={ultimoExamenMedico} onChange={(e) => setUltimoExamenMedico(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
          </div>

          <div className={styles.modalRow}>
            <FormControl fullWidth required className={styles.flex1}>
              <InputLabel>Agente Causante</InputLabel>
              <Select value={codigoAgente} label="Agente Causante" onChange={(e: SelectChangeEvent<string>) => setCodigoAgente(e.target.value)}>
                <MenuItem value="">Seleccione…</MenuItem>
                {agentesCausantes.map((a) => (
                  <MenuItem key={a.codigo} value={String(a.codigo)}>
                    {a.displayText}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={styles.modalButtons}>
            <CustomButton
              onClick={cargarFila}
              disabled={!trabajadorCompleto || (!modoEdicion && filas.length >= totalTrabajadores)}
              style={modoEdicion ? { backgroundColor: '#ff9800', color: 'white' } : {}}
            >
              {modoEdicion ? 'Guardar Cambios' : 'Cargar Trabajador'}
            </CustomButton>
            <CustomButton
              onClick={() => {
                setCuil('');
                setNombre('');
                setSector('');
                setIngreso('');
                setFechaInicio('');
                setExposicion('');
                setFechaFinExposicion('');
                setUltimoExamenMedico('');
                setCodigoAgente('');
              }}
            >
              Limpiar Campos
            </CustomButton>
            <CustomButton onClick={modoEdicion ? handleCancelarEdicion : () => setModalTrabajadorOpen(false)} style={modoEdicion ? { backgroundColor: '#757575', color: 'white' } : {}}>
              Cancelar
            </CustomButton>
          </div>
        </div>
      </CustomModal>

      {/* MODAL Cantidades */}
      <CustomModal open={modalCantidadesOpen} onClose={() => setModalCantidadesOpen(false)} title="Configurar Cantidades de Trabajadores" size="mid">
        <div className={styles.modalGridCol}>
          <TextField
            label="Cantidad de Trabajadores Expuestos"
            type="text"
            value={cantExpuestos}
            onChange={(e) => setCantExpuestos(e.target.value.replace(/[^0-9]/g, ''))}
            fullWidth
            required
            className={styles.centeredInput}
          />
        </div>
        <div className={styles.modalGridCol}>
          <TextField
            label="Cantidad de Trabajadores NO Expuestos"
            type="text"
            value={cantNoExpuestos}
            onChange={(e) => setCantNoExpuestos(e.target.value.replace(/[^0-9]/g, ''))}
            fullWidth
            required
            className={styles.centeredInput}
          />
          <div className={styles.modalButtons}>
            <CustomButton onClick={confirmarCantidades} disabled={!puedeGenerar}>
              Confirmar y Generar
            </CustomButton>
            <CustomButton onClick={() => setModalCantidadesOpen(false)}>Cancelar</CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default FormulariosRAREditar;


// 'use client';
// import React from 'react';
// import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material/Select';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import dayjs from 'dayjs';
// import 'dayjs/locale/es';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import CustomButton from '../../../../../utils/ui/button/CustomButton';
// import DataTableImport from '../../../../../utils/ui/table/DataTable';
// import CustomModal from '../../../../../utils/ui/form/CustomModal';
// import styles from '../FormulariosRAR.module.css';

// dayjs.extend(customParseFormat);
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.locale('es');

// interface EditarProps {
//   edita: number;                // ID del formulario a editar
//   finalizaCarga: (ret?: boolean) => void;
// }

// const FormulariosRAREditar: React.FC<EditarProps> = ({ edita, finalizaCarga }) => {
//   const [cantExpuestos, setCantExpuestos] = React.useState<string>('');
//   const [cantNoExpuestos, setCantNoExpuestos] = React.useState<string>('');
//   const [descripcion, setDescripcion] = React.useState<string>('');
//   const [generar, setGenerar] = React.useState<boolean>(false);
//   const guardandoRef = React.useRef(false);

//   const [totalTrabajadores, setTotalTrabajadores] = React.useState<number>(0);
//   const [opcionesEstablecimientos, setOpcionesEstablecimientos] = React.useState<Array<{ interno: string; displayText: string }>>([]);
//   const [agentesCausantes, setAgentesCausantes] = React.useState<Array<{ codigo: number; displayText: string }>>([]);
//   const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = React.useState<string>('');

//   // trabajadores
//   const [filas, setFilas] = React.useState<any[]>([]);
//   const [modalTrabajadorOpen, setModalTrabajadorOpen] = React.useState<boolean>(false);
//   const [modalCantidadesOpen, setModalCantidadesOpen] = React.useState<boolean>(false);

//   const [cuil, setCuil] = React.useState<string>('');
//   const [nombre, setNombre] = React.useState<string>('');
//   const [sector, setSector] = React.useState<string>('');
//   const [ingreso, setIngreso] = React.useState<string>('');
//   const [fechaInicio, setFechaInicio] = React.useState<string>('');
//   const [exposicion, setExposicion] = React.useState<string>('');
//   const [fechaFinExposicion, setFechaFinExposicion] = React.useState<string>('');
//   const [ultimoExamenMedico, setUltimoExamenMedico] = React.useState<string>('');
//   const [codigoAgente, setCodigoAgente] = React.useState<string>('');

//   // Estados para edición
//   const [editandoIndex, setEditandoIndex] = React.useState<number>(-1);
//   const [modoEdicion, setModoEdicion] = React.useState<boolean>(false);

//   // CARGA INICIAL
//   React.useEffect(() => {
//     (async () => {
//       // detalle del formulario
//       const r = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`);
//       if (r.ok) {
//         const data = await r.json();
//         setCantExpuestos(String(data.cantTrabajadoresExpuestos || 0));
//         setCantNoExpuestos(String(data.cantTrabajadoresNoExpuestos || 0));
//         setTotalTrabajadores((data.cantTrabajadoresExpuestos || 0) + (data.cantTrabajadoresNoExpuestos || 0));

//         // establecimientos por CUIT del formulario
//         const cuitForm = data.cuit || data.CUIT;
//         if (cuitForm) {
//           const re = await fetch(`http://arttest.intersistemas.ar:8302/api/Establecimientos/Empresa/${cuitForm}`);
//           const arr = re.ok ? await re.json() : [];
//           const ests = (Array.isArray(arr) ? arr : arr?.data ? (Array.isArray(arr.data) ? arr.data : [arr.data]) : [arr]).map(
//             (est: any) => ({ interno: String(est.interno || ''), displayText: `${est.interno || 'S/C'} - ${est.domicilioCalle || ''}` })
//           );
//           setOpcionesEstablecimientos(ests);
//           const actual = ests.find((e) => String(e.interno) === String(data.internoEstablecimiento));
//           setDescripcion(actual?.displayText || '');
//           setEstablecimientoSeleccionado(actual?.interno || '');
//         }

//         // detalle trabajadores
//         if (Array.isArray(data.formularioRARDetalle) && data.formularioRARDetalle.length) {
//           const filasDetalle = data.formularioRARDetalle.map((d: any) => ({
//             CUIL: String(d.cuil || ''),
//             Nombre: d.nombre || '',
//             SectorTareas: d.sectorTarea || '',
//             Ingreso: d.fechaIngreso ? dayjs(d.fechaIngreso).format('YYYY-MM-DD') : '',
//             FechaFin: d.fechaInicioExposicion ? dayjs(d.fechaInicioExposicion).format('YYYY-MM-DD') : '',
//             Exposicion: `${d.horasExposicion || 0} horas`,
//             FechaFinExposicion: d.fechaFinExposicion ? dayjs(d.fechaFinExposicion).format('YYYY-MM-DD') : '',
//             UltimoExamenMedico: d.fechaUltimoExamenMedico ? dayjs(d.fechaUltimoExamenMedico).format('YYYY-MM-DD') : '',
//             CodigoAgente: String(d.codigoAgente || ''),
//           }));
//           setFilas(filasDetalle);
//           setGenerar(true);
//         }
//       }

//       // agentes
//       const ra = await fetch('http://arttest.intersistemas.ar:8302/api/AgentesCausantes');
//       const agents = ra.ok ? await ra.json() : [];
//       const ags = (Array.isArray(agents) ? agents : agents?.data ? (Array.isArray(agents.data) ? agents.data : [agents.data]) : [agents]).map(
//         (a: any) => ({ codigo: Number(a.codigo || 0), displayText: `${a.codigo || 'S/C'} - ${a.agenteCausante || ''}` })
//       );
//       setAgentesCausantes(ags);
//     })();
//   }, [edita]);

//   const numerosValidos = (v: string) => {
//     const n = Number(v.trim());
//     return !Number.isNaN(n) && n >= 0 && Number.isInteger(n) && n <= 99999;
//   };

//   const manejarCambioNumerico = (valor: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
//     const limpio = (valor ?? '').replace(/[^0-9]/g, '');
//     if (limpio.length <= 5) setter(limpio);
//   };

//   const establecimientoSeleccionadoValido = establecimientoSeleccionado.trim() !== '';

//   const puedeGenerar =
//     descripcion.trim() !== '' &&
//     numerosValidos(cantExpuestos) &&
//     numerosValidos(cantNoExpuestos) &&
//     establecimientoSeleccionado.trim() !== '';

//   const confirmarCantidades = () => {
//     if (!numerosValidos(cantExpuestos) || !numerosValidos(cantNoExpuestos)) return alert('Cantidades inválidas');
//     const total = Number(cantExpuestos) + Number(cantNoExpuestos);
//     if (total <= 0) return alert('El total debe ser > 0');
//     setTotalTrabajadores(total);
//     setGenerar(true);
//     setModalCantidadesOpen(false);
//   };

//   const trabajadorCompleto =
//     [cuil, nombre, sector, ingreso, fechaInicio, exposicion, fechaFinExposicion, ultimoExamenMedico, codigoAgente].every((x) => x && x.trim() !== '') &&
//     cuil.replace(/\D/g, '').length >= 11;

//   const cargarFila = () => {
//     if (!trabajadorCompleto) return;

//     if (modoEdicion) {
//       // Modo edición - verificar CUIL duplicado excluyendo el actual
//       const cuilExiste = filas.some((f, idx) => f.CUIL === cuil.trim() && idx !== editandoIndex);
//       if (cuilExiste) return alert('Este CUIL ya existe en otro trabajador');

//       // Actualizar trabajador existente
//       setFilas((prev) => {
//         const nuevasFilas = [...prev];
//         nuevasFilas[editandoIndex] = {
//           CUIL: cuil.trim(),
//           Nombre: nombre.trim(),
//           SectorTareas: sector.trim(),
//           Ingreso: ingreso.trim(),
//           FechaFin: fechaInicio.trim(),
//           Exposicion: exposicion.trim(),
//           FechaFinExposicion: fechaFinExposicion.trim(),
//           UltimoExamenMedico: ultimoExamenMedico.trim(),
//           CodigoAgente: codigoAgente.trim(),
//         };
//         return nuevasFilas;
//       });

//       // Salir del modo edición
//       setModoEdicion(false);
//       setEditandoIndex(-1);
//       alert('Trabajador actualizado correctamente');
//     } else {
//       // Modo creación
//       if (filas.length >= totalTrabajadores) return alert('Ya alcanzó el límite máximo de trabajadores');

//       const cuilExiste = filas.some((f) => f.CUIL === cuil.trim());
//       if (cuilExiste) return alert('Este CUIL ya fue cargado');

//       setFilas((p) => [
//         ...p,
//         {
//           CUIL: cuil.trim(),
//           Nombre: nombre.trim(),
//           SectorTareas: sector.trim(),
//           Ingreso: ingreso.trim(),
//           FechaFin: fechaInicio.trim(),
//           Exposicion: exposicion.trim(),
//           FechaFinExposicion: fechaFinExposicion.trim(),
//           UltimoExamenMedico: ultimoExamenMedico.trim(),
//           CodigoAgente: codigoAgente.trim(),
//         },
//       ]);
//     }

//     // Limpiar campos
//     setCuil('');
//     setNombre('');
//     setSector('');
//     setIngreso('');
//     setFechaInicio('');
//     setExposicion('');
//     setFechaFinExposicion('');
//     setUltimoExamenMedico('');
//     setCodigoAgente('');
//     setModalTrabajadorOpen(false);
//   };

//   // Función para editar un trabajador
//   const handleEditarTrabajador = (index: number) => {
//     const trabajador = filas[index];
//     if (!trabajador) return;

//     // Cargar los datos del trabajador en el formulario
//     setCuil(trabajador.CUIL || '');
//     setNombre(trabajador.Nombre || '');
//     setSector(trabajador.SectorTareas || '');
//     setIngreso(trabajador.Ingreso || '');
//     setFechaInicio(trabajador.FechaFin || '');
//     setExposicion(trabajador.Exposicion || '');
//     setFechaFinExposicion(trabajador.FechaFinExposicion || '');
//     setUltimoExamenMedico(trabajador.UltimoExamenMedico || '');
//     setCodigoAgente(trabajador.CodigoAgente || '');

//     // Activar modo edición
//     setEditandoIndex(index);
//     setModoEdicion(true);
//     setModalTrabajadorOpen(true);
//   };

//   // Función para eliminar un trabajador
//   const handleEliminarTrabajador = (index: number) => {
//     if (window.confirm('¿Estás seguro de que querés eliminar este trabajador?')) {
//       setFilas(prev => prev.filter((_, i) => i !== index));
//     }
//   };

//   // Función para cancelar la edición
//   const handleCancelarEdicion = () => {
//     setCuil('');
//     setNombre('');
//     setSector('');
//     setIngreso('');
//     setFechaInicio('');
//     setExposicion('');
//     setFechaFinExposicion('');
//     setUltimoExamenMedico('');
//     setCodigoAgente('');
//     setEditandoIndex(-1);
//     setModoEdicion(false);
//     setModalTrabajadorOpen(false);
//   };

//   const guardar = async () => {
//     if (guardandoRef.current) return;
//     if (!establecimientoSeleccionado) return alert('Seleccione establecimiento');
//     if (filas.length === 0) return alert('Cargue al menos un trabajador');

//     guardandoRef.current = true;
//     try {
//       const fechaActual = new Date().toISOString();
//       const detalle = filas.map((f: any) => ({
//         internoFormulariosRar: 0,
//         cuil: Number((f.CUIL || '').replace(/\D/g, '')),
//         nombre: f.Nombre || '',
//         sectorTarea: f.SectorTareas || '',
//         fechaIngreso: new Date(f.Ingreso || fechaActual).toISOString(),
//         horasExposicion: Number(String(f.Exposicion || '0').replace(/[^\d]/g, '')) || 4,
//         fechaUltimoExamenMedico: new Date(f.UltimoExamenMedico || fechaActual).toISOString(),
//         codigoAgente: Number(f.CodigoAgente) || 1,
//         fechaInicioExposicion: new Date(f.FechaFin || fechaActual).toISOString(),
//         fechaFinExposicion: new Date(f.FechaFinExposicion || fechaActual).toISOString(),
//       }));

//       const body = {
//         cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
//         cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
//         fechaCreacion: fechaActual,
//         fechaPresentacion: fechaActual,
//         internoPresentacion: 0,
//         internoEstablecimiento: Number(establecimientoSeleccionado) || 0,
//         formularioRARDetalle: detalle,
//       };

//       const r = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       if (!r.ok) throw new Error(await r.text());
//       alert('Formulario RAR actualizado exitosamente');
//       finalizaCarga(true);
//     } catch (e: any) {
//       console.error(e);
//       alert(`Error al guardar: ${e?.message || e}`);
//     } finally {
//       guardandoRef.current = false;
//     }
//   };

//   const llegoAlTope = generar && totalTrabajadores > 0 && filas.length >= totalTrabajadores;

//   return (
//     <div className={styles.wrapperCol}>
//       <h2>{`Editar Formulario RAR #${edita}`}</h2>

//       <FormControl fullWidth required disabled={!!establecimientoSeleccionado}>
//         <InputLabel>Establecimiento</InputLabel>
//         <Select
//           value={descripcion}
//           label="Establecimiento"
//           onChange={(e: SelectChangeEvent<string>) => {
//             const val = e.target.value;
//             setDescripcion(val);
//             const sel = opcionesEstablecimientos.find((o) => o.displayText === val);
//             setEstablecimientoSeleccionado(sel ? sel.interno : '');
//           }}
//         >
//           <MenuItem value="">Seleccione un establecimiento</MenuItem>
//           {opcionesEstablecimientos.length === 0 ? (
//             <MenuItem disabled value="">
//               No hay establecimientos
//             </MenuItem>
//           ) : (
//             opcionesEstablecimientos.map((op, idx) => (
//               <MenuItem key={`${op.interno}-${idx}`} value={op.displayText}>
//                 {op.displayText}
//               </MenuItem>
//             ))
//           )}
//         </Select>
//       </FormControl>

//       {/* SECCIÓN DE CANTIDADES DE TRABAJADORES */}
//       <div style={{ 
//         background: establecimientoSeleccionadoValido ? '#f8f9fa' : '#f5f5f5', 
//         padding: '15px', 
//         borderRadius: '5px', 
//         marginBottom: '20px',
//         marginTop: '20px',
//         opacity: establecimientoSeleccionadoValido ? 1 : 0.6
//       }}>
//         <h4 style={{ 
//           margin: '0 0 15px 0', 
//           color: establecimientoSeleccionadoValido ? '#495057' : '#9e9e9e'
//         }}>
//           Cantidades de Trabajadores 
//           <span style={{ color: '#d32f2f', fontSize: '16px' }}>*</span>
//           {!establecimientoSeleccionadoValido && (
//             <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
//               (Seleccioná primero un establecimiento)
//             </span>
//           )}
//           {establecimientoSeleccionadoValido && (
//             <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
//               (Requerido para habilitar datos del trabajador)
//             </span>
//           )}
//         </h4>
//         <div className={styles.modalRow}>
//           <TextField
//             label="Cantidad de Trabajadores Expuestos"
//             name="cantExpuestos"
//             type="text"
//             value={cantExpuestos}
//             onChange={(e) => manejarCambioNumerico(e.target.value, setCantExpuestos)}
//             fullWidth
//             required
//             disabled={!establecimientoSeleccionadoValido}
//             className={`${styles.centeredInput} ${styles.flex1}`}
//             error={cantExpuestos !== '' && !numerosValidos(cantExpuestos)}
//             helperText={cantExpuestos !== '' && !numerosValidos(cantExpuestos) ? 'Ingrese un número válido (0-99999)' : ''}
//           />
//           <TextField
//             label="Cantidad de Trabajadores NO Expuestos"
//             name="cantNoExpuestos"
//             type="text"
//             value={cantNoExpuestos}
//             onChange={(e) => manejarCambioNumerico(e.target.value, setCantNoExpuestos)}
//             fullWidth
//             required
//             disabled={!establecimientoSeleccionadoValido}
//             className={`${styles.centeredInput} ${styles.flex1}`}
//             error={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos)}
//             helperText={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos) ? 'Ingrese un número válido (0-99999)' : ''}
//           />
//         </div>
//         {(cantExpuestos || cantNoExpuestos) && (
//           <div style={{ background: '#bbdefb', padding: '10px', borderRadius: '3px', marginTop: '10px', textAlign: 'center' }}>
//             <strong>Total de Trabajadores: {(Number(cantExpuestos) || 0) + (Number(cantNoExpuestos) || 0)}</strong>
//           </div>
//         )}
        
//         {/* Botón para confirmar cantidades */}
//         {establecimientoSeleccionadoValido && (
//           <div style={{ textAlign: 'center', marginTop: '15px' }}>
//             <CustomButton 
//               onClick={confirmarCantidades} 
//               disabled={!puedeGenerar}
//               style={{ 
//                 background: puedeGenerar ? '#2196f3' : '#cccccc', 
//                 color: 'white' 
//               }}
//             >
//               {generar ? 'Actualizar Cantidades' : 'Confirmar y Generar'}
//             </CustomButton>
//           </div>
//         )}
//       </div>

//       {generar && totalTrabajadores > 0 && !llegoAlTope && (
//         <div className={`${styles.btnCenter} ${styles.mt20}`}>
//           <CustomButton onClick={() => setModalTrabajadorOpen(true)}>
//             Agregar Trabajador ({filas.length}/{totalTrabajadores})
//           </CustomButton>
//         </div>
//       )}

//       {filas.length > 0 && (
//         <div className={styles.tableBlock}>
//           <span className={`${styles.bold} ${styles.fs20}`}>Datos del Trabajador:</span>
//           <DataTableImport
//             columns={[
//               { accessorKey: 'CUIL', header: 'CUIL' },
//               { accessorKey: 'Nombre', header: 'Nombre' },
//               { accessorKey: 'SectorTareas', header: 'Sector/Tareas' },
//               { accessorKey: 'Ingreso', header: 'Ingreso' },
//               { accessorKey: 'FechaFin', header: 'Fecha de fin' },
//               { accessorKey: 'Exposicion', header: 'Exposición' },
//               { accessorKey: 'FechaFinExposicion', header: 'Fecha Fin Exposición' },
//               { accessorKey: 'UltimoExamenMedico', header: 'Ult. Examen Médico' },
//               { accessorKey: 'CodigoAgente', header: 'Cód. Agente' },
//               {
//                 id: 'acciones',
//                 header: 'Acciones',
//                 cell: ({ row }: { row: any }) => {
//                   const index = filas.findIndex(fila => 
//                     fila.CUIL === row.original.CUIL && 
//                     fila.Nombre === row.original.Nombre
//                   );
//                   return (
//                     <div style={{ 
//                       display: 'flex', 
//                       gap: '8px', 
//                       justifyContent: 'center', 
//                       alignItems: 'center' 
//                     }}>
//                       {/* Icono Editar */}
//                       <EditIcon
//                         onClick={() => handleEditarTrabajador(index)}
//                         style={{
//                           fontSize: '20px',
//                           color: '#E4840C',
//                           cursor: 'pointer',
//                           transition: 'color 0.2s ease'
//                         }}
//                         onMouseEnter={(e: any) => {
//                           e.target.style.color = '#E4840C';
//                         }}
//                         onMouseLeave={(e: any) => {
//                           e.target.style.color = '#E4840C';
//                         }}
//                       />
                      
//                       {/* Icono Eliminar */}
//                       <DeleteIcon
//                         onClick={() => handleEliminarTrabajador(index)}
//                         style={{
//                           fontSize: '20px',
//                           color: '#E4840C',
//                           cursor: 'pointer',
//                           transition: 'color 0.2s ease'
//                         }}
//                         onMouseEnter={(e: any) => {
//                           e.target.style.color = '#E4840C';
//                         }}
//                         onMouseLeave={(e: any) => {
//                           e.target.style.color = '#E4840C';
//                         }}
//                       />
//                     </div>
//                   );
//                 },
//                 enableSorting: false,
//               }
//             ]}
//             data={filas}
//           />
//         </div>
//       )}

//       <div className={`${styles.flex} ${styles.gap8} ${styles.mt40}`}>
//         <CustomButton onClick={guardar} disabled={!generar || filas.length === 0 || filas.length < totalTrabajadores}>
//           Guardar Cambios
//         </CustomButton>
//         <CustomButton onClick={() => finalizaCarga(false)}>Cancelar</CustomButton>
//       </div>

//       {/* MODAL Trabajador */}
//       <CustomModal 
//         open={modalTrabajadorOpen} 
//         onClose={modoEdicion ? handleCancelarEdicion : () => setModalTrabajadorOpen(false)} 
//         title={modoEdicion ? "Editar Trabajador Expuesto" : "Datos del Trabajador Expuesto"} 
//         size="large"
//       >
//         <div className={styles.modalGridCol}>
//           <div className={styles.modalRow}>
//             <TextField
//               label="CUIL"
//               value={cuil}
//               onChange={(e) => {
//                 const v = e.target.value.replace(/[^0-9]/g, '');
//                 if (v.length <= 11) {
//                   let formatted = v;
//                   if (v.length > 2) formatted = v.substring(0, 2) + '-' + v.substring(2);
//                   if (v.length > 10) formatted = v.substring(0, 2) + '-' + v.substring(2, 10) + '-' + v.substring(10);
//                   setCuil(formatted);
//                 }
//               }}
//               fullWidth
//               required
//               placeholder="XX-XXXXXXXX-X"
//               inputProps={{ maxLength: 13 }}
//               className={styles.flex1}
//             />
//             <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth required className={styles.flex1} />
//           </div>

//           <div className={styles.modalRow}>
//             <TextField label="Sector/Tareas" value={sector} onChange={(e) => setSector(e.target.value)} fullWidth required className={styles.flex1} />
//             <TextField label="Ingreso" type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
//           </div>

//           <div className={styles.modalRow}>
//             <TextField label="Fecha Inicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
//             <TextField label="Exposición" value={exposicion} onChange={(e) => setExposicion(e.target.value)} fullWidth required className={styles.flex1} />
//           </div>

//           <div className={styles.modalRow}>
//             <TextField label="Fecha Fin Exposición" type="date" value={fechaFinExposicion} onChange={(e) => setFechaFinExposicion(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
//             <TextField label="Último Examen Médico" type="date" value={ultimoExamenMedico} onChange={(e) => setUltimoExamenMedico(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} className={styles.flex1} />
//           </div>

//           <div className={styles.modalRow}>
//             <FormControl fullWidth required className={styles.flex1}>
//               <InputLabel>Agente Causante</InputLabel>
//               <Select value={codigoAgente} label="Agente Causante" onChange={(e: SelectChangeEvent<string>) => setCodigoAgente(e.target.value)}>
//                 <MenuItem value="">Seleccione…</MenuItem>
//                 {agentesCausantes.map((a, idx) => (
//                   <MenuItem key={`${a.codigo}-${idx}`} value={String(a.codigo)}>
//                     {a.displayText}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </div>

//           <div className={styles.modalButtons}>
//             <CustomButton 
//               onClick={cargarFila} 
//               disabled={!trabajadorCompleto || (!modoEdicion && filas.length >= totalTrabajadores)}
//               style={modoEdicion ? { backgroundColor: '#ff9800', color: 'white' } : {}}
//             >
//               {modoEdicion ? 'Guardar Cambios' : 'Cargar Trabajador'}
//             </CustomButton>
//             <CustomButton
//               onClick={() => {
//                 setCuil(''); setNombre(''); setSector(''); setIngreso(''); setFechaInicio(''); setExposicion(''); setFechaFinExposicion(''); setUltimoExamenMedico(''); setCodigoAgente('');
//               }}
//             >
//               Limpiar Campos
//             </CustomButton>
//             <CustomButton 
//               onClick={modoEdicion ? handleCancelarEdicion : () => setModalTrabajadorOpen(false)}
//               style={modoEdicion ? { backgroundColor: '#757575', color: 'white' } : {}}
//             >
//               Cancelar
//             </CustomButton>
//           </div>
//         </div>
//       </CustomModal>

//       {/* MODAL Cantidades */}
//       <CustomModal open={modalCantidadesOpen} onClose={() => setModalCantidadesOpen(false)} title="Configurar Cantidades de Trabajadores" size="mid">
//         <div className={styles.modalGridCol}>
//           <TextField
//             label="Cantidad de Trabajadores Expuestos"
//             type="text"
//             value={cantExpuestos}
//             onChange={(e) => setCantExpuestos(e.target.value.replace(/[^0-9]/g, ''))}
//             fullWidth
//             required
//             className={styles.centeredInput}
//           />
//         </div>
//         <div className={styles.modalGridCol}>
//           <TextField
//             label="Cantidad de Trabajadores NO Expuestos"
//             type="text"
//             value={cantNoExpuestos}
//             onChange={(e) => setCantNoExpuestos(e.target.value.replace(/[^0-9]/g, ''))}
//             fullWidth
//             required
//             className={styles.centeredInput}
//           />
//           <div className={styles.modalButtons}>
//             <CustomButton onClick={confirmarCantidades} disabled={!puedeGenerar}>
//               Confirmar y Generar
//             </CustomButton>
//             <CustomButton onClick={() => setModalCantidadesOpen(false)}>Cancelar</CustomButton>
//           </div>
//         </div>
//       </CustomModal>
//     </div>
//   );
// };

// export default FormulariosRAREditar;
