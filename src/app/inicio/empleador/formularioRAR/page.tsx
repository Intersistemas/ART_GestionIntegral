
'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../data/AuthContext';
import { FechaHora } from '../../../../utils/Formato';
import CustomButton from '../../../../utils/ui/button/CustomButton';
import DataTableImport from '../../../../utils/ui/table/DataTable';
import CustomModal from '../../../../utils/ui/form/CustomModal';
import Formato from '../../../../utils/Formato';
import { 
  TextField, MenuItem, Select, InputLabel, 
  FormControl
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BaseDocumentPDF from '../../../../utils/PDF/BaseDocumentPDF';
import PDFModalViewer from '../../../../utils/PDF/PDFModalViewer';
import { Text, View } from '@react-pdf/renderer';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from './FormulariosRAR.module.css';

// Componente header simple para PDF
class SimpleHeader extends React.Component {
  render() {
    return (
      <View style={{ backgroundColor: '#83BC00', padding: 10, marginBottom: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          Formulario RAR - Sistema ART
        </Text>
      </View>
    );
  }
}

/* dayjs setup */
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

/* Helpers de fecha (sin cambios funcionales) */
const formatearFecha = (fecha: string | Date | null | undefined, formato: string = 'DD/MM/YYYY'): string => {
  if (!fecha) return '';
  return dayjs(fecha).format(formato);
};
const formatearFechaParaInput = (fecha: string | Date | null | undefined): string => {
  if (!fecha) return '';
  return dayjs(fecha).format('YYYY-MM-DD');
};
const validarFecha = (fecha: string): boolean => dayjs(fecha).isValid();
const obtenerFechaActual = (): string => dayjs().format('YYYY-MM-DD');

const numeroSiniestroFormatter = (v: any) => Formato.Mascara(v, "####-######-##");
const fechaHoraFormatter = (v: any) => Formato.FechaHora(v);
const fechaFormatter = (v: any) => Formato.Fecha(v);
const numeroFormatter = (v: any) => Formato.Numero(v);
const cuipFormatter = (v: any) => Formato.CUIP(v);

/* Props del hijo */
interface NuevoFormularioRARProps {
  cuit: number;
  internoEstablecimiento: number;
  referenteDatos?: unknown;
  finalizaCarga: (ret?: boolean) => void;
  edita: number;
  registroSeleccionado?: any;
}


const NuevoFormularioRAR: React.FC<NuevoFormularioRARProps & { formulariosRAR: any[] }> = ({
  cuit, internoEstablecimiento, finalizaCarga, edita, formulariosRAR, registroSeleccionado
}) => {
  const [cantExpuestos, setCantExpuestos] = React.useState<string>('');
  const [cantNoExpuestos, setCantNoExpuestos] = React.useState<string>('');
  const [descripcion, setDescripcion] = React.useState<string>('');
  const [generar, setGenerar] = React.useState<boolean>(false);
  const guardandoRef = React.useRef(false);

  const [totalTrabajadores, setTotalTrabajadores] = React.useState<number>(0);
  const [cuitActual, setCuitActual] = React.useState<string>('');
  const [razonSocialActual, setRazonSocialActual] = React.useState<string>('');

  const [opcionesEstablecimientos, setOpcionesEstablecimientos] = React.useState<Array<{
    interno: string; domicilioCalle: string; displayText: string;
  }>>([]);

  // Estados para agentes causantes
  const [agentesCausantes, setAgentesCausantes] = React.useState<Array<{
    interno: number; codigo: number; agenteCausante: string; agenteTipo: string; displayText: string;
  }>>([]);

  useEffect(() => {
    const fila = formulariosRAR.find(f => (f.cuit || f.CUIT) && (f.razonSocial || f.RazonSocial));
    if (fila) {
      setCuitActual(String(fila.cuit || fila.CUIT || ''));
      setRazonSocialActual(String(fila.razonSocial || fila.RazonSocial || ''));
    }
    const cuitParaConsulta = fila?.cuit || fila?.CUIT || cuit;
    if (!cuitParaConsulta) { setOpcionesEstablecimientos([]); return; }

    (async () => {
      try {
        const resp = await fetch(`http://arttest.intersistemas.ar:8302/api/Establecimientos/Empresa/${cuitParaConsulta}`);
        if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
        const establecimientos = await resp.json();
        const establecimientosArray = Array.isArray(establecimientos)
          ? establecimientos
          : establecimientos?.data
            ? (Array.isArray(establecimientos.data) ? establecimientos.data : [establecimientos.data])
            : [establecimientos];

        const opciones = establecimientosArray
          .filter((est: any) => est && (est.domicilioCalle || est.interno))
          .map((est: any) => ({
            interno: String(est.interno || ''),
            domicilioCalle: String(est.domicilioCalle || ''),
            displayText: `${est.interno || 'S/C'} - ${est.domicilioCalle || 'Sin dirección'}`
          }));
        setOpcionesEstablecimientos(opciones);
      } catch (e) {
        console.error('Error consultando establecimientos:', e);
        setOpcionesEstablecimientos([]);
      }
    })();

    // Cargar agentes causantes
    (async () => {
      try {
        const respAgentes = await fetch('http://arttest.intersistemas.ar:8302/api/AgentesCausantes');
        if (!respAgentes.ok) throw new Error(`HTTP error! status: ${respAgentes.status}`);
        const agentes = await respAgentes.json();
        
        const agentesArray = Array.isArray(agentes)
          ? agentes
          : agentes?.data
            ? (Array.isArray(agentes.data) ? agentes.data : [agentes.data])
            : [agentes];

        const opcionesAgentes = agentesArray
          .filter((agente: any) => agente && (agente.codigo || agente.agenteCausante))
          .map((agente: any) => ({
            interno: Number(agente.interno || 0),
            codigo: Number(agente.codigo || 0),
            agenteCausante: String(agente.agenteCausante || ''),
            agenteTipo: String(agente.agenteTipo || ''),
            displayText: `${agente.codigo || 'S/C'} - ${agente.agenteCausante || 'Sin descripción'}`
          }));
        
        setAgentesCausantes(opcionesAgentes);
        console.log(`Se cargaron ${opcionesAgentes.length} agentes causantes`);
      } catch (e) {
        console.error('Error consultando agentes causantes:', e);
        setAgentesCausantes([]);
      }
    })();
  }, [formulariosRAR, cuit]);

  const [cuil, setCuil] = React.useState<string>('');
  const [nombre, setNombre] = React.useState<string>('');
  const [sector, setSector] = React.useState<string>('');
  const [ingreso, setIngreso] = React.useState<string>('');
  const [fechaInicio, setFechaInicio] = React.useState<string>('');
  const [exposicion, setExposicion] = React.useState<string>('');
  const [fechaFinExposicion, setFechaFinExposicion] = React.useState<string>('');
  const [ultimoExamenMedico, setUltimoExamenMedico] = React.useState<string>('');
  const [codigoAgente, setCodigoAgente] = React.useState<string>('');
  const [filas, setFilas] = React.useState<any[]>([]);
  const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = React.useState<string>('');
  const [modalTrabajadorOpen, setModalTrabajadorOpen] = React.useState<boolean>(false);
  const [modalCantidadesOpen, setModalCantidadesOpen] = React.useState<boolean>(false);
  
  // Estados para edición de trabajadores
  const [editandoTrabajador, setEditandoTrabajador] = React.useState<boolean>(false);
  const [indiceTrabajadorEditando, setIndiceTrabajadorEditando] = React.useState<number>(-1);

  const cargarDatosFormulario = useCallback(async (internoFormulario: number) => {
    try {
      const response = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${internoFormulario}`);
      if (!response.ok) throw new Error(`Error al cargar formulario: ${response.status}`);
      const data = await response.json();

      setCantExpuestos(String(data.cantTrabajadoresExpuestos || 0));
      setCantNoExpuestos(String(data.cantTrabajadoresNoExpuestos || 0));

      const est = opcionesEstablecimientos.find(e => e.interno === String(data.internoEstablecimiento));
      if (est) { setDescripcion(est.displayText); setEstablecimientoSeleccionado(est.interno); }

      if (data.formularioRARDetalle?.length) {
        const filasDetalle = data.formularioRARDetalle.map((d: any) => {
          const codigoAgente = String(d.codigoAgente || d.CodigoAgente || '');
          // Buscar el agente en la lista para obtener su información completa
          const agenteEncontrado = agentesCausantes.find(agente => String(agente.codigo) === codigoAgente);
          
          return {
            CUIL: String(d.cuil || ''),
            Nombre: d.nombre || '',
            SectorTareas: d.sectorTarea || '',
            Ingreso: d.fechaIngreso ? dayjs(d.fechaIngreso).format('YYYY-MM-DD') : '',
            FechaFin: d.fechaInicioExposicion ? dayjs(d.fechaInicioExposicion).format('YYYY-MM-DD') : '',
            Exposicion: `${d.horasExposicion || 0} horas`,
            FechaFinExposicion: d.fechaFinExposicion ? dayjs(d.fechaFinExposicion).format('YYYY-MM-DD') : '',
            UltimoExamenMedico: d.fechaUltimoExamenMedico ? dayjs(d.fechaUltimoExamenMedico).format('YYYY-MM-DD') : '',
            CodigoAgente: codigoAgente,
            AgenteCausanteDisplay: agenteEncontrado ? agenteEncontrado.displayText : codigoAgente
          };
        });
        setFilas(filasDetalle);
        const total = (data.cantTrabajadoresExpuestos || 0) + (data.cantTrabajadoresNoExpuestos || 0);
        setTotalTrabajadores(total);
        setGenerar(true);
      }
    } catch (error) {
      console.error('Error cargando datos del formulario:', error);
      alert(`Error al cargar los datos del formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }, [opcionesEstablecimientos, agentesCausantes]);

  useEffect(() => {
    if (edita && edita > 0) cargarDatosFormulario(edita);
  }, [edita, cargarDatosFormulario]);

  const handleAbrirModalTrabajador = () => setModalTrabajadorOpen(true);
  const handleCerrarModalTrabajador = () => setModalTrabajadorOpen(false);
  const handleAbrirModalCantidades = () => setModalCantidadesOpen(true);
  const handleCerrarModalCantidades = () => setModalCantidadesOpen(false);

  const numerosValidos = (v: string) => {
    const valor = v.trim();
    if (valor === '') return false;
    const num = Number(valor);
    return !Number.isNaN(num) && num >= 0 && Number.isInteger(num) && num <= 99999;
  };

  const manejarCambioNumerico = (valor: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Solo permitir números enteros positivos
    const valorLimpio = valor.replace(/[^0-9]/g, '');
    // Limitar a máximo 5 dígitos
    if (valorLimpio.length <= 5) {
      setter(valorLimpio);
    }
  };
  const puedeGenerar = descripcion.trim() !== '' &&
    numerosValidos(cantExpuestos) &&
    numerosValidos(cantNoExpuestos) &&
    establecimientoSeleccionado.trim() !== '';

  const handleConfirmarCantidades = () => {
    // Validaciones adicionales antes de generar
    if (!numerosValidos(cantExpuestos) || !numerosValidos(cantNoExpuestos)) {
      alert('Por favor, ingrese números válidos para las cantidades de trabajadores.');
      return;
    }

    const expuestos = Number(cantExpuestos);
    const noExpuestos = Number(cantNoExpuestos);
    const total = expuestos + noExpuestos;

    if (total === 0) {
      alert('El total de trabajadores debe ser mayor a 0.');
      return;
    }

    if (total > 99999) {
      alert('El total de trabajadores no puede exceder 99,999.');
      return;
    }

    if (puedeGenerar) {
      setTotalTrabajadores(total);
      setGenerar(true);
      handleCerrarModalCantidades();
    }
  };



  const camposTrabajador = [cuil, nombre, sector, ingreso, fechaInicio, exposicion, fechaFinExposicion, ultimoExamenMedico, codigoAgente];
  const trabajadorCompleto = camposTrabajador.every(c => c && c.trim() !== '') && cuil.length >= 11;

  const handleCargarFila = () => {
    if (!trabajadorCompleto) return;
    
    // Si estamos editando, no validar límite ni CUIL duplicado (excepto con otros trabajadores)
    if (!editandoTrabajador) {
      if (filas.length >= totalTrabajadores) {
        alert('Ya alcanzó el límite máximo de trabajadores');
        return;
      }
      
      const cuilExiste = filas.some(f => f.CUIL === cuil.trim());
      if (cuilExiste) { 
        alert('Este CUIL ya fue cargado'); 
        return; 
      }
    } else {
      // En edición, verificar que el CUIL no esté duplicado (excepto el que estamos editando)
      const cuilExiste = filas.some((f, index) => f.CUIL === cuil.trim() && index !== indiceTrabajadorEditando);
      if (cuilExiste) { 
        alert('Este CUIL ya existe en otro trabajador'); 
        return; 
      }
    }
    
    // Buscar el agente seleccionado para obtener su información completa
    const agenteSeleccionado = agentesCausantes.find(agente => String(agente.codigo) === codigoAgente.trim());
    

    
    const datosTrabajador = {
      CUIL: cuil.trim(),
      Nombre: nombre.trim(),
      SectorTareas: sector.trim(),
      Ingreso: ingreso.trim(),
      FechaFin: fechaInicio.trim(),
      Exposicion: exposicion.trim(),
      FechaFinExposicion: fechaFinExposicion.trim(),
      UltimoExamenMedico: ultimoExamenMedico.trim(),
      CodigoAgente: codigoAgente.trim(),
      AgenteCausanteDisplay: agenteSeleccionado ? agenteSeleccionado.displayText : codigoAgente.trim(),
    };
    
    if (editandoTrabajador) {
      // Actualizar trabajador existente
      const nuevasFilas = [...filas];
      nuevasFilas[indiceTrabajadorEditando] = datosTrabajador;
      setFilas(nuevasFilas);

      
      // Resetear estado de edición
      setEditandoTrabajador(false);
      setIndiceTrabajadorEditando(-1);
    } else {
      // Agregar nuevo trabajador
      setFilas(prev => [...prev, datosTrabajador]);

    }
    
    handleBorrarCampos();
    handleCerrarModalTrabajador();
  };

  const handleBorrarCampos = () => {
    [setCuil, setNombre, setSector, setIngreso, setFechaInicio, setExposicion, setFechaFinExposicion, setUltimoExamenMedico, setCodigoAgente]
      .forEach(setter => setter(''));
  };

  // Función para iniciar edición de trabajador
  const handleEditarTrabajador = (index: number) => {

    const trabajador = filas[index];
    
    // Cargar datos del trabajador en el formulario
    setCuil(trabajador.CUIL);
    setNombre(trabajador.Nombre);
    setSector(trabajador.SectorTareas);
    setIngreso(trabajador.Ingreso);
    setFechaInicio(trabajador.FechaFin);
    setExposicion(trabajador.Exposicion);
    setFechaFinExposicion(trabajador.FechaFinExposicion);
    setUltimoExamenMedico(trabajador.UltimoExamenMedico);
    setCodigoAgente(trabajador.CodigoAgente);
    
    // Configurar estado de edición
    setEditandoTrabajador(true);
    setIndiceTrabajadorEditando(index);
    setModalTrabajadorOpen(true);
    

  };

  // Función para eliminar trabajador
  const handleEliminarTrabajador = (index: number) => {

    
    if (window.confirm('¿Está seguro que desea eliminar este trabajador?')) {
      const nuevasFilas = filas.filter((_, i) => i !== index);
      setFilas(nuevasFilas);

    }
  };

  // Función para cancelar edición
  const handleCancelarEdicion = () => {

    setEditandoTrabajador(false);
    setIndiceTrabajadorEditando(-1);
    handleBorrarCampos();
    handleCerrarModalTrabajador();
  };

  const handleGuardar = async () => {
    console.log('Iniciando guardado...');
    
    if (!cantExpuestos && !cantNoExpuestos) {
      alert('Debe ingresar al menos una cantidad de trabajadores');
      return;
    }
    
    if (!establecimientoSeleccionado || Number(establecimientoSeleccionado) === 0) {
      alert('Debe seleccionar un establecimiento válido');
      return;
    }

    if (guardandoRef.current) {
      console.log('⚠️ Ya se está guardando, abortando...');
      return;
    }
    
    if (filas.length === 0) { 
      console.log('❌ Error: No hay trabajadores cargados');
      alert('Debe cargar al menos un trabajador antes de guardar'); 
      return; 
    }
    
    guardandoRef.current = true;
    
    try {
      const fechaActual = dayjs().toISOString();
      const internoEstablecimientoFinal = Number(establecimientoSeleccionado) || 0;
      const establecimientoParaEnvio = internoEstablecimientoFinal || internoEstablecimiento || 0;

      const esEdicionFormularioCompleto = edita && edita > 0;
      console.log('Modo edición:', esEdicionFormularioCompleto);
      
      let formulariosRARDetalle = [];
      
      if (esEdicionFormularioCompleto) {
        try {
          console.log('Obteniendo detalles existentes...');
          const responseExistente = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`);
          if (responseExistente.ok) {
            const datosExistentes = await responseExistente.json();
            let detallesExistentes = datosExistentes.formularioRARDetalle || [];
            
            // Actualizar o agregar los detalles del formulario actual
            filas.forEach((fila: any, index: number) => {
              const cuilFila = String(fila.CUIL || '').replace(/\D/g, '');
              
              // Buscar si este trabajador ya existe en los detalles del servidor
              const indiceExistente = detallesExistentes.findIndex((d: any) => 
                String(d.cuil || d.Cuil || d.CUIL || '').replace(/\D/g, '') === cuilFila
              );
              
              const detalleActualizado = {
                internoFormulariosRar: indiceExistente >= 0 ? (detallesExistentes[indiceExistente].id || detallesExistentes[indiceExistente].internoFormulariosRar || 0) : 0,
                cuil: Number(cuilFila || 0),
                nombre: fila.Nombre || '',
                sectorTarea: fila.SectorTareas || '',
                fechaIngreso: dayjs(fila.Ingreso || fechaActual).toISOString(),
                horasExposicion: Number(fila.Exposicion?.replace(/[^\d]/g, '')) || 4,
                fechaUltimoExamenMedico: dayjs(fila.UltimoExamenMedico || fechaActual).toISOString(),
                codigoAgente: Number(fila.CodigoAgente) || 1,
                fechaInicioExposicion: dayjs(fila.FechaFin || fechaActual).toISOString(),
                fechaFinExposicion: dayjs(fila.FechaFinExposicion || fechaActual).toISOString()
              };
              
              if (indiceExistente >= 0) {
                detallesExistentes[indiceExistente] = detalleActualizado;
              } else {
                detallesExistentes.push(detalleActualizado);
              }
            });
            
            formulariosRARDetalle = detallesExistentes;
          } else {
            throw new Error('No se pudieron obtener los datos existentes');
          }
        } catch (error) {
          console.error('❌ Error obteniendo detalles existentes:', error);
          // Fallback: usar solo los datos del formulario actual
          formulariosRARDetalle = filas.map((fila: any, index: number) => ({
            internoFormulariosRar: 0,
            cuil: Number(fila.CUIL?.replace(/\D/g, '') || 0),
            nombre: fila.Nombre || '',
            sectorTarea: fila.SectorTareas || '',
            fechaIngreso: dayjs(fila.Ingreso || fechaActual).toISOString(),
            horasExposicion: Number(fila.Exposicion?.replace(/[^\d]/g, '')) || 4,
            fechaUltimoExamenMedico: dayjs(fila.UltimoExamenMedico || fechaActual).toISOString(),
            codigoAgente: Number(fila.CodigoAgente) || 1,
            fechaInicioExposicion: dayjs(fila.FechaFin || fechaActual).toISOString(),
            fechaFinExposicion: dayjs(fila.FechaFinExposicion || fechaActual).toISOString()
          }));
        }
      } else {
        formulariosRARDetalle = filas.map((fila: any) => ({
          internoFormulariosRar: 0,
          cuil: Number(fila.CUIL?.replace(/\D/g, '') || 0),
          nombre: fila.Nombre || '',
          sectorTarea: fila.SectorTareas || '',
          fechaIngreso: dayjs(fila.Ingreso || fechaActual).toISOString(),
          horasExposicion: Number(fila.Exposicion?.replace(/[^\d]/g, '')) || 4,
          fechaUltimoExamenMedico: dayjs(fila.UltimoExamenMedico || fechaActual).toISOString(),
          codigoAgente: Number(fila.CodigoAgente) || 1,
          fechaInicioExposicion: dayjs(fila.FechaFin || fechaActual).toISOString(),
          fechaFinExposicion: dayjs(fila.FechaFinExposicion || fechaActual).toISOString()
        }));
      }

      // Preparar datos finales para envío
      // Para PUT necesitamos estructura diferente que para POST
      let datosParaEnviar;
      
      if (esEdicionFormularioCompleto) {
        // Para PUT: estructura completa que coincida exactamente con el ejemplo del servidor
        datosParaEnviar = {
          cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
          cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
          fechaCreacion: new Date().toISOString(),
          fechaPresentacion: new Date().toISOString(),
          internoPresentacion: 0,
          internoEstablecimiento: establecimientoParaEnvio,
          formularioRARDetalle: formulariosRARDetalle
        };
        

        
      } else {
        // Para POST: estructura de creación
        datosParaEnviar = {
          cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
          cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
          fechaCreacion: fechaActual,
          fechaPresentacion: fechaActual,
          internoPresentacion: 0,
          internoEstablecimiento: establecimientoParaEnvio,
          formularioRARDetalle: formulariosRARDetalle
        };
      }

      console.log('📦 Datos preparados para envío:', JSON.stringify(datosParaEnviar, null, 2));
      console.log('📊 Estructura FormularioRARDetalle:', {
        totalDetalles: formulariosRARDetalle.length,
        primerDetalle: formulariosRARDetalle[0] || 'Sin detalles',
        camposDetalle: formulariosRARDetalle.length > 0 ? Object.keys(formulariosRARDetalle[0]) : []
      });

      // Determinar URL y método
      // Solo es edición de formulario completo si viene el prop "edita" (formulario ya guardado en BD)
      // La edición local de trabajadores NO afecta esto
      const metodo = esEdicionFormularioCompleto ? 'PUT' : 'POST';
      const url = esEdicionFormularioCompleto
        ? `http://arttest.intersistemas.ar:8302/api/FormulariosRAR/${edita}`
        : 'http://arttest.intersistemas.ar:8302/api/FormulariosRAR';




      
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaEnviar)
      });

      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`Error del servidor (${respuesta.status}): ${errorText}`);
      }

      const resultado = await respuesta.json();


      const mensaje = esEdicionFormularioCompleto 
        ? 'Formulario RAR actualizado exitosamente'
        : 'Formulario RAR creado exitosamente';
      

      
      alert(mensaje);
      finalizaCarga(true);

    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`Error al guardar el formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      guardandoRef.current = false;
    }
  };

  const handleGenerar = () => {
    if (!puedeGenerar) return;
    
    // Validaciones adicionales
    if (!numerosValidos(cantExpuestos) || !numerosValidos(cantNoExpuestos)) {
      alert('Por favor, ingrese números válidos para las cantidades de trabajadores.');
      return;
    }

    const total = Number(cantExpuestos) + Number(cantNoExpuestos);
    
    if (total === 0) {
      alert('El total de trabajadores debe ser mayor a 0.');
      return;
    }

    setTotalTrabajadores(total);
    setGenerar(true);
  };

  const llegoAlTope = generar && totalTrabajadores > 0 && filas.length >= totalTrabajadores;

  // Componente PDF para formulario RAR
  const FormularioRARPDF = ({ datos }: { datos: any }) => {
    if (!datos) return null;

    const columnas = [
      { key: 'interno', title: 'Interno', width: '10%' },
      { key: 'cuit', title: 'CUIT', width: '15%' },
      { key: 'razonSocial', title: 'Razón Social', width: '25%' },
      { key: 'direccion', title: 'Dirección', width: '20%' },
      { key: 'estado', title: 'Estado', width: '10%' },
      { key: 'cantTrabajadoresExpuestos', title: 'Expuestos', width: '10%' },
      { key: 'cantTrabajadoresNoExpuestos', title: 'No Expuestos', width: '10%' }
    ];

    const datosFormateados = [{
      interno: datos.interno || datos.InternoFormularioRAR || '',
      cuit: cuipFormatter(datos.cuit || datos.CUIT || ''),
      razonSocial: datos.razonSocial || datos.RazonSocial || '',
      direccion: datos.direccion || datos.Direccion || '',
      estado: datos.estado || datos.Estado || '',
      cantTrabajadoresExpuestos: datos.cantTrabajadoresExpuestos || datos.CantTrabExpuestos || 0,
      cantTrabajadoresNoExpuestos: datos.cantTrabajadoresNoExpuestos || datos.CantTrabNoExpuestos || 0
    }];

    return (
      <BaseDocumentPDF
        title={`Formulario RAR #${datos.interno || datos.InternoFormularioRAR}`}
         headerComponent={SimpleHeader as any}
        columns={columnas}
        data={datosFormateados}
        orientation="landscape"
        itemsPerPage={1}
        customStyles={{}}
        renderCustomContent={() => (
          <>
            {/* Información adicional del formulario */}
            <Text style={{ fontSize: 10, marginBottom: 10, textAlign: 'center' }}>
              Fecha de creación: {formatearFecha(datos.fechaCreacion || datos.FechaHoraCreacion)}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 10, textAlign: 'center' }}>
              Fecha de presentación: {formatearFecha(datos.fechaPresentacion || datos.FechaHoraConfirmado)}
            </Text>
          </>
        )}
      />
    );
  };

  return (
    <div className={`${styles.wrapperCol}`}>
      <h2>{edita ? `Editar Formulario RAR #${edita}` : 'Crear Nuevo Formulario RAR'}</h2>

      <div className={`${styles.row} ${styles.mb20} ${styles.alignCenter}`}>
        <TextField
          label="CUIT del Empleador a Registrar"
          value={cuitActual}
          fullWidth
          disabled
          InputProps={{ readOnly: true }}
          className={`${styles.centeredInput} ${styles.flex1}`}
        />
        <TextField
          label="Razón Social"
          value={razonSocialActual}
          fullWidth
          disabled
          InputProps={{ readOnly: true }}
          className={`${styles.centeredInput} ${styles.flex1}`}
        />
      </div>

      <div>
        <FormControl fullWidth required disabled={establecimientoSeleccionado !== ''}>
          <InputLabel>Establecimiento</InputLabel>
          <Select
            name="establecimiento"
            value={descripcion}
            label="Establecimiento"
            onChange={(e: SelectChangeEvent<string>) => {
              const value = e.target.value;
              setDescripcion(value);
              const sel = opcionesEstablecimientos.find(o => o.displayText === value);
              setEstablecimientoSeleccionado(sel ? sel.interno : '');
            }}
          >
            <MenuItem value="">Seleccione un establecimiento</MenuItem>
            {opcionesEstablecimientos.length === 0 ? (
              <MenuItem disabled value="">No hay establecimientos disponibles</MenuItem>
            ) : (
              opcionesEstablecimientos.map((op, idx) => (
                <MenuItem key={`${op.interno}-${idx}`} value={op.displayText}>
                  {op.displayText}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {descripcion && !generar && (
          <div className={`${styles.btnCenter} ${styles.mt40}`}>
            <CustomButton onClick={handleAbrirModalCantidades}>
              Configurar Cantidades de Trabajadores
            </CustomButton>
          </div>
        )}

        {descripcion && generar && (
          <div className={styles.summaryBox}>
            <div className={`${styles.flex} ${styles.spaceBetween} ${styles.alignCenter}`}>
              <div>
                <strong>Configuración del Formulario:</strong><br />
                Trabajadores Expuestos: <strong>{cantExpuestos}</strong><br />
                Trabajadores NO Expuestos: <strong>{cantNoExpuestos}</strong>
              </div>
              <CustomButton onClick={handleAbrirModalCantidades} className={styles.btnSmall}>
                Modificar
              </CustomButton>
            </div>
          </div>
        )}

        {generar && totalTrabajadores > 0 && !llegoAlTope && (
          <div className={`${styles.btnCenter} ${styles.mt20}`}>
            <CustomButton onClick={handleAbrirModalTrabajador}>
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
                { accessorKey: 'AgenteCausanteDisplay', header: 'Agente Causante' },
                {
                  id: 'acciones',
                  header: 'Acciones',
                  cell: ({ row }: { row: any }) => {
                    const index = filas.findIndex(fila => 
                      fila.CUIL === row.original.CUIL && 
                      fila.Nombre === row.original.Nombre
                    );
                    return (
                      <div className={`${styles.flex} ${styles.gap8}`}>
                        <CustomButton
                          onClick={(e: any) => {
                            e.stopPropagation?.();
                            handleEditarTrabajador(index);
                          }}
                          className={styles.tableBtnSmall}
                          style={{ backgroundColor: '#2196F3', color: 'white' }}
                        >
                          <EditIcon />
                        </CustomButton>
                        <CustomButton
                          onClick={(e: any) => {
                            e.stopPropagation?.();
                            handleEliminarTrabajador(index);
                          }}
                          className={styles.tableBtnSmall}
                          style={{ backgroundColor: '#f44336', color: 'white' }}
                        >
                          <DeleteIcon />
                        </CustomButton>
                      </div>
                    );
                  },
                  enableSorting: false,
                }
              ]}
              data={filas}
              size='small'
            />
          </div>
        )}
      </div>

      <div className={`${styles.flex} ${styles.gap8} ${styles.mt40}`}>
        <CustomButton
          onClick={handleGuardar}
          disabled={!llegoAlTope || filas.length === 0 || filas.length < totalTrabajadores}
        >
          Guardar
        </CustomButton>
        <CustomButton onClick={() => finalizaCarga(false)}>Cancelar</CustomButton>
      </div>

      {/* MODAL trabajador */}
      <CustomModal
        open={modalTrabajadorOpen}
        onClose={editandoTrabajador ? handleCancelarEdicion : handleCerrarModalTrabajador}
        title={editandoTrabajador ? "Editar Trabajador Expuesto" : "Datos del Trabajador Expuesto"}
        size="large"
      >
        <div className={styles.modalGridCol}>
          <div className={styles.modalRow}>
            <TextField
              label="CUIL"
              name="cuil"
              value={cuil}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 11) {
                  let formatted = value;
                  if (value.length > 2) formatted = value.substring(0, 2) + '-' + value.substring(2);
                  if (value.length > 10) formatted = value.substring(0, 2) + '-' + value.substring(2, 10) + '-' + value.substring(10);
                  setCuil(formatted);
                }
              }}
              fullWidth
              required
              placeholder="XX-XXXXXXXX-X"
              inputProps={{ maxLength: 13 }}
              className={styles.flex1}
            />
            <TextField
              label="Nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              fullWidth
              required
              placeholder="Nombre completo"
              className={styles.flex1}
            />
          </div>

          <div className={styles.modalRow}>
            <TextField
              label="Sector/Tareas"
              name="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              fullWidth
              required
              placeholder="Descripción del sector o tareas"
              className={styles.flex1}
            />
            <TextField
              label="Ingreso"
              name="ingreso"
              type="date"
              value={ingreso}
              onChange={(e) => setIngreso(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              className={styles.flex1}
            />
          </div>

          <div className={styles.modalRow}>
            <TextField
              label="Fecha Inicio"
              name="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              className={styles.flex1}
            />
            <TextField
              label="Exposición"
              name="exposicion"
              value={exposicion}
              onChange={(e) => setExposicion(e.target.value)}
              fullWidth
              required
              placeholder="Tipo de exposición"
              className={styles.flex1}
            />
          </div>

          <div className={styles.modalRow}>
            <TextField
              label="Fecha Fin Exposición"
              name="fechaFinExposicion"
              type="date"
              value={fechaFinExposicion}
              onChange={(e) => setFechaFinExposicion(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              className={styles.flex1}
            />
            <TextField
              label="Último Examen Médico"
              name="ultimoExamenMedico"
              type="date"
              value={ultimoExamenMedico}
              onChange={(e) => setUltimoExamenMedico(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              className={styles.flex1}
            />
          </div>

          <div className={styles.modalRow}>
            <FormControl fullWidth required className={styles.flex1}>
              <InputLabel>Agente Causante</InputLabel>
              <Select
                name="codigoAgente"
                value={codigoAgente}
                label="Agente Causante"
                onChange={(e: SelectChangeEvent<string>) => {
                  setCodigoAgente(e.target.value);
                }}
              >
                <MenuItem value="">Seleccione un agente causante</MenuItem>
                {agentesCausantes.length === 0 ? (
                  <MenuItem disabled value="">No hay agentes causantes disponibles</MenuItem>
                ) : (
                  agentesCausantes.map((agente, idx) => (
                    <MenuItem key={`${agente.codigo}-${idx}`} value={String(agente.codigo)}>
                      {agente.displayText}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <div className={styles.flex1}></div>
          </div>

          <div className={styles.modalButtons}>
            <CustomButton 
              onClick={handleCargarFila} 
              disabled={!trabajadorCompleto || (!editandoTrabajador && filas.length >= totalTrabajadores)}
              style={editandoTrabajador ? { backgroundColor: '#2196F3', color: 'white' } : {}}
            >
              {editandoTrabajador ? 'Actualizar Trabajador' : 'Cargar Trabajador'}
            </CustomButton>
            <CustomButton onClick={handleBorrarCampos}>Limpiar Campos</CustomButton>
            <CustomButton onClick={editandoTrabajador ? handleCancelarEdicion : handleCerrarModalTrabajador}>
              Cancelar
            </CustomButton>
          </div>
        </div>
      </CustomModal>

      {/* MODAL cantidades */}
      <CustomModal
        open={modalCantidadesOpen}
        onClose={handleCerrarModalCantidades}
        title="Configurar Cantidades de Trabajadores"
        size="mid"
      >
        <div className={styles.modalGridCol}>
          <div className={styles.modalTextBlock}>
            <p className={styles.modalTextGray}>
              Ingrese la cantidad de trabajadores expuestos y no expuestos para el establecimiento:
            </p>
            <p className={styles.modalTextBold}>{descripcion}</p>
          </div>

          <TextField
            label="Cantidad de Trabajadores Expuestos"
            name="cantExpuestos"
            type="text"
            value={cantExpuestos}
            onChange={e => manejarCambioNumerico(e.target.value, setCantExpuestos)}
            fullWidth
            required
            placeholder="Ingrese cantidad de expuestos"
            inputProps={{ 
              min: 0, 
              max: 99999,
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            className={styles.centeredInput}
            error={cantExpuestos !== '' && !numerosValidos(cantExpuestos)}
            helperText={cantExpuestos !== '' && !numerosValidos(cantExpuestos) ? 'Ingrese un número válido entre 0 y 99999' : ''}
          />

          <TextField
            label="Cantidad de Trabajadores NO Expuestos"
            name="cantNoExpuestos"
            type="text"
            value={cantNoExpuestos}
            onChange={e => manejarCambioNumerico(e.target.value, setCantNoExpuestos)}
            fullWidth
            required
            placeholder="Ingrese cantidad de no expuestos"
            inputProps={{ 
              min: 0, 
              max: 99999,
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            className={styles.centeredInput}
            error={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos)}
            helperText={cantNoExpuestos !== '' && !numerosValidos(cantNoExpuestos) ? 'Ingrese un número válido entre 0 y 99999' : ''}
          />

          {(cantExpuestos || cantNoExpuestos) && (
            <div className={styles.totalBox}>
              <strong>Total de Trabajadores: {(Number(cantExpuestos) || 0) + (Number(cantNoExpuestos) || 0)}</strong>
            </div>
          )}

          <div className={styles.modalButtons}>
            <CustomButton onClick={handleConfirmarCantidades} disabled={!puedeGenerar}>
              Confirmar y Generar
            </CustomButton>
            <CustomButton onClick={handleCerrarModalCantidades}>Cancelar</CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

/* Spinner simple */
const Spinner: React.FC = () => (
  <div className={styles.spinner}>
    <span>cargando...</span>
  </div>
);

/* Tipos originales */
export interface FormulariosRARProps {
  cuit: number;
  referenteDatos?: unknown;
}
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

const FormulariosRAR: React.FC<FormulariosRARProps> = ({ cuit, referenteDatos }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [internoFormularioRAR, setInternoFormularioRAR] = useState<number>(0);
  const [internoEstablecimiento, setInternoEstablecimiento] = useState<number>(0);
  const [cargarFormulario, setCargarFormulario] = useState<boolean>(false);
  const [estado, setEstado] = useState<string>('');
  const [formulariosRAR, setFormulariosRAR] = useState<FormularioRAR[]>([]);
  const [edita, setEdita] = useState<number>(0);
  const [idFormularioSeleccionado, setIdFormularioSeleccionado] = useState<number>(0);
  const [internoPresentacion] = useState<number>(0);

  // Estados para PDF
  const [modalPDFOpen, setModalPDFOpen] = useState<boolean>(false);
  const [datosPDF, setDatosPDF] = useState<any>(null);

  // Estados para tabla de detalles del interno
  const [detallesInterno, setDetallesInterno] = useState<any[]>([]);
  const [loadingDetalles, setLoadingDetalles] = useState<boolean>(false);
  const [errorDetalles, setErrorDetalles] = useState<string>('');
  const [registroSeleccionado, setRegistroSeleccionado] = useState<any>(null);

  const fetchFormularios = useCallback(async () => {
    try {
      const cuitUsuario = user?.cuit || cuit;
      const response = await fetch(`http://arttest.intersistemas.ar:8302/api/FormulariosRAR?CUIL=${cuitUsuario}&PageSize=500`);
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
  }, [user?.cuit, cuit]);

  // Función para obtener los detalles del interno seleccionado
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
      
      if (!response.ok) {
        throw new Error(`Error al consultar detalles: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();

      
      // Procesar los detalles del formulario RAR
      if (data && data.formularioRARDetalle && Array.isArray(data.formularioRARDetalle)) {
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
          fechaUltimoExamenMedico: detalle.fechaUltimoExamenMedico ? formatearFecha(detalle.fechaUltimoExamenMedico) : ''
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

  useEffect(() => { fetchFormularios(); }, [fetchFormularios, referenteDatos, cuit]);

  const handleClickNuevo = () => {
    setCargarFormulario(true);
    setInternoFormularioRAR(0);
    setInternoEstablecimiento(0);
    setEstado('');
    setIdFormularioSeleccionado(0); // Resetear ID para nuevo formulario
  };
  const handleClickCerrar = () => { window.history.back(); window.close(); };
  const handleEdita = () => { 
    setCargarFormulario(true); 
    setEdita(idFormularioSeleccionado > 0 ? idFormularioSeleccionado : internoFormularioRAR); 
  };

  const seleccionaRegistro = (internoFormRAR: number, internoEstab: number, estadoSel: string) => {
    setInternoFormularioRAR(internoFormRAR);
    setInternoEstablecimiento(internoEstab);
    setEstado(estadoSel);
  };

  const handleFinalizaCarga = async (ret?: boolean) => {
    setCargarFormulario(false);
    setEstado('');
    if (ret) { setLoading(true); await fetchFormularios(); }
  };

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
            totalTrabajadores: detallesFormulario.formularioRARDetalle?.length || 0
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

  const disableEdita = cuit !== 99999999999 && internoFormularioRAR !== 0 ? false : true;
  const disableGenera = cuit === 99999999999 ? true : false;

  // Componente PDF para formulario RAR
  const FormularioRARPDF = ({ datos }: { datos: any }) => {
    if (!datos) return null;

    const columnas = [
      { key: 'interno', title: 'Interno', width: '10%' },
      { key: 'cuit', title: 'CUIT', width: '15%' },
      { key: 'razonSocial', title: 'Razón Social', width: '25%' },
      { key: 'direccion', title: 'Dirección', width: '20%' },
      { key: 'estado', title: 'Estado', width: '10%' },
      { key: 'cantTrabajadoresExpuestos', title: 'Expuestos', width: '10%' },
      { key: 'cantTrabajadoresNoExpuestos', title: 'No Expuestos', width: '10%' }
    ];

    const datosFormateados = [{
      interno: datos.interno || datos.InternoFormularioRAR || '',
      cuit: cuipFormatter(datos.cuit || datos.CUIT || ''),
      razonSocial: datos.razonSocial || datos.RazonSocial || '',
      direccion: datos.direccion || datos.Direccion || '',
      estado: datos.estado || datos.Estado || '',
      cantTrabajadoresExpuestos: datos.cantTrabajadoresExpuestos || datos.CantTrabExpuestos || 0,
      cantTrabajadoresNoExpuestos: datos.cantTrabajadoresNoExpuestos || datos.CantTrabNoExpuestos || 0
    }];

    // Agregar información de trabajadores si está disponible
    const trabajadores = datos.detallesTrabajadores || [];
    const columnasTrabajadores = trabajadores.length > 0 ? [
      { key: 'cuil', title: 'CUIL', width: '15%' },
      { key: 'nombre', title: 'Nombre', width: '25%' },
      { key: 'sectorTarea', title: 'Sector/Tarea', width: '20%' },
      { key: 'fechaIngreso', title: 'F. Ingreso', width: '12%' },
      { key: 'horasExposicion', title: 'Horas Exp.', width: '10%' },
      { key: 'codigoAgente', title: 'Cód. Agente', width: '18%' }
    ] : [];

    const trabajadoresFormateados = trabajadores.map((t: any) => ({
      cuil: cuipFormatter(t.cuil || ''),
      nombre: t.nombre || '',
      sectorTarea: t.sectorTarea || '',
      fechaIngreso: fechaFormatter(t.fechaIngreso || ''),
      horasExposicion: t.horasExposicion || 0,
      codigoAgente: t.codigoAgente || ''
    }));

    return (
      <BaseDocumentPDF
        title={`Formulario RAR #${datos.interno || datos.InternoFormularioRAR}`}
         headerComponent={SimpleHeader as any}
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
                  {/* Encabezados de trabajadores */}
                  <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 5 }}>
                    <Text style={{ fontSize: 8, width: '15%', fontWeight: 'bold' }}>CUIL</Text>
                    <Text style={{ fontSize: 8, width: '25%', fontWeight: 'bold' }}>NOMBRE</Text>
                    <Text style={{ fontSize: 8, width: '20%', fontWeight: 'bold' }}>SECTOR/TAREA</Text>
                    <Text style={{ fontSize: 8, width: '12%', fontWeight: 'bold' }}>F. INGRESO</Text>
                    <Text style={{ fontSize: 8, width: '10%', fontWeight: 'bold' }}>HORAS EXP.</Text>
                    <Text style={{ fontSize: 8, width: '18%', fontWeight: 'bold' }}>CÓD. AGENTE</Text>
                  </View>
                  {/* Filas de trabajadores */}
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

  // Columnas para la tabla de detalles del interno
  const detallesTableColumns = [
    { accessorKey: 'id', header: '#' },
    { accessorKey: 'cuil', header: 'CUIL', cell: (info: any) => cuipFormatter(info.getValue()) },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'sectorTarea', header: 'Sector/Tarea' },
    { accessorKey: 'fechaIngreso', header: 'F. Ingreso' },
    { accessorKey: 'fechaInicioExposicion', header: 'F. Inicio Exposición' },
    { accessorKey: 'fechaFinExposicion', header: 'F. Fin Exposición' },
    { accessorKey: 'horasExposicion', header: 'Horas Exp.' },
    { accessorKey: 'codigoAgente', header: 'Cód. Agente' },
    { accessorKey: 'fechaUltimoExamenMedico', header: 'Último Examen Médico' },
  ];

  const onRowClick = (row: any) => {
    // El ID para el PUT - intentar varios campos posibles
    const idFormulario = Number(row.id || row.Id || row.ID || row.InternoFormularioRAR || row.interno || 0);
    const internoForm = Number(row.InternoFormularioRAR || row.interno || 0);
    const internoEstab = Number(row.internoEstablecimiento || row.InternoEstablecimiento || 0);
    const est = String(row.Estado || row.estado || '');
    

    
    // Seleccionar el registro (funcionalidad original)
    seleccionaRegistro(internoForm, internoEstab, est);
    
    // Guardar el ID del formulario para futuras operaciones PUT
    setIdFormularioSeleccionado(idFormulario);
    
    // Guardar el registro completo seleccionado
    setRegistroSeleccionado(row);
    
    if (internoForm > 0) {
      fetchDetallesInterno(internoForm);
    } else {
      setDetallesInterno([]);
      setErrorDetalles('');
      setRegistroSeleccionado(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {!cargarFormulario ? (
        <div>
          <h1>Consulta de Formularios RAR</h1>

          <div className={`${styles.flex} ${styles.gap12} ${styles.mb16}`}>
            <CustomButton onClick={handleEdita} disabled={disableEdita}>Edita Formulario</CustomButton>
            <CustomButton onClick={handleClickNuevo} disabled={disableGenera}>Genera Formulario</CustomButton>
            <CustomButton onClick={handleClickCerrar}>Finaliza</CustomButton>
          </div>

          <div className={styles.compactTable}>
            <DataTableImport
              columns={tableColumns}
              data={formulariosRAR}
              onRowClick={onRowClick}
              size='small'
            />
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
      ) : (
        <NuevoFormularioRAR
          cuit={cuit}
          internoEstablecimiento={internoEstablecimiento}
          referenteDatos={referenteDatos}
          finalizaCarga={handleFinalizaCarga}
          edita={edita}
          formulariosRAR={formulariosRAR}
          registroSeleccionado={registroSeleccionado}
        />
      )}
      
      {/* Modal para PDF */}
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
