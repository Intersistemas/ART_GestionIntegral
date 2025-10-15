'use client';
import React from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import Formato from '../../../../../utils/Formato';
import CustomButton from '../../../../../utils/ui/button/CustomButton';
import DataTableImport from '../../../../../utils/ui/table/DataTable';
import CustomModal from '../../../../../utils/ui/form/CustomModal';
import styles from '../FormulariosRAR.module.css';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

const cuipFormatter = (v: any) => Formato.CUIP(v);

interface CrearProps {
  cuit: number;
  internoEstablecimiento?: number; // opcional en creación
  referenteDatos?: unknown;
  finalizaCarga: (ret?: boolean) => void;
  formulariosRAR?: any[]; // opcional
}

type OpcionEstablecimiento = { interno: string; domicilioCalle: string; displayText: string };
type OpcionAgente = { interno: number; codigo: number; agenteCausante: string; agenteTipo: string; displayText: string };

const FormularioRARCrear: React.FC<CrearProps> = ({
  cuit,
  internoEstablecimiento = 0,
  finalizaCarga,
  formulariosRAR = [],
}) => {
  // encabezado
  const [cuitActual, setCuitActual] = React.useState<string>(String(cuit || ''));
  const [razonSocialActual, setRazonSocialActual] = React.useState<string>('');

  // establecimientos y agentes
  const [opcionesEstablecimientos, setOpcionesEstablecimientos] = React.useState<OpcionEstablecimiento[]>([]);
  const [agentesCausantes, setAgentesCausantes] = React.useState<OpcionAgente[]>([]);
  const [cargandoSelects, setCargandoSelects] = React.useState<boolean>(false);

  // selección establecimiento (usamos el **id** como value del Select)
  const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = React.useState<string>('');
  const displayEstablecimiento =
    opcionesEstablecimientos.find((o) => o.interno === establecimientoSeleccionado)?.displayText || '';

  // cantidades
  const [cantExpuestos, setCantExpuestos] = React.useState<string>('');
  const [cantNoExpuestos, setCantNoExpuestos] = React.useState<string>('');
  const [generar, setGenerar] = React.useState<boolean>(false);
  const [totalTrabajadores, setTotalTrabajadores] = React.useState<number>(0);

  // modal - Se abre automáticamente al cargar el componente
  const [modalTrabajadorOpen, setModalTrabajadorOpen] = React.useState<boolean>(true);

  // trabajadores
  const [cuil, setCuil] = React.useState<string>('');
  const [nombre, setNombre] = React.useState<string>('');
  const [sector, setSector] = React.useState<string>('');
  const [ingreso, setIngreso] = React.useState<string>('');
  const [fechaInicio, setFechaInicio] = React.useState<string>('');
  const [exposicion, setExposicion] = React.useState<string>('0'); // Valor predeterminado "0"
  const [fechaFinExposicion, setFechaFinExposicion] = React.useState<string>('');
  const [ultimoExamenMedico, setUltimoExamenMedico] = React.useState<string>('');
  const [codigoAgente, setCodigoAgente] = React.useState<string>('');
  const [filas, setFilas] = React.useState<any[]>([]);

  // Estados para edición
  const [editandoIndex, setEditandoIndex] = React.useState<number>(-1);
  const [modoEdicion, setModoEdicion] = React.useState<boolean>(false);

  // Estado para consulta de CUIL
  const [consultandoCuil, setConsultandoCuil] = React.useState<boolean>(false);

  // Estados para errores de validación del trabajador
  const [erroresCampos, setErroresCampos] = React.useState<{
    cuil: string;
    nombre: string;
    sector: string;
    ingreso: string;
    fechaInicio: string;
    exposicion: string;
    ultimoExamenMedico: string;
    codigoAgente: string;
  }>({
    cuil: '',
    nombre: '',
    sector: '',
    ingreso: '',
    fechaInicio: '',
    exposicion: '',
    ultimoExamenMedico: '',
    codigoAgente: ''
  });

  const guardandoRef = React.useRef(false);

  // ===== Funciones para manejo de trabajadores =====
  // Función para editar un trabajador
  const handleEditarTrabajador = React.useCallback((index: number) => {
    if (modoEdicion) {
      alert('Ya estás editando un trabajador. Guardá o cancelá los cambios antes de editar otro.');
      return;
    }

    const trabajador = filas[index];
    if (!trabajador) return;

    // Cargar los datos del trabajador en el formulario
    setCuil(trabajador.CUIL || '');
    setNombre(trabajador.Nombre || '');
    setSector(trabajador.SectorTareas || '');
    setIngreso(trabajador.Ingreso || '');
    setFechaInicio(trabajador.FechaInicio || '');
    setExposicion(trabajador.Exposicion || '');
    setFechaFinExposicion(trabajador.FechaFinExposicion || '');
    setUltimoExamenMedico(trabajador.UltimoExamenMedico || '');
    setCodigoAgente(trabajador.CodigoAgente || '');

    // Activar modo edición
    setEditandoIndex(index);
    setModoEdicion(true);
  }, [filas, modoEdicion]);

  // Función para eliminar un trabajador
  const handleEliminarTrabajador = React.useCallback((index: number) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este trabajador?')) {
      setFilas(prev => prev.filter((_, i) => i !== index));
    }
  }, []);

  // ===== Configuración de columnas para DataTable =====
  const columnasTabla = React.useMemo(() => [
    {
      accessorKey: 'CUIL',
      header: 'CUIL',
      size: 120,
    },
    {
      accessorKey: 'Nombre',
      header: 'Nombre',
      size: 180,
    },
    {
      accessorKey: 'SectorTareas',
      header: 'Sector/Tareas',
      size: 140,
    },
    {
      accessorKey: 'Ingreso',
      header: 'F. Ingreso',
      size: 100,
    },
    {
      accessorKey: 'FechaInicio',
      header: 'F. Inicio',
      size: 100,
    },
    {
      accessorKey: 'Exposicion',
      header: 'Exposición',
      size: 90,
    },
    {
      accessorKey: 'FechaFinExposicion',
      header: 'F. Fin Exp.*',
      size: 100,
      cell: ({ getValue }: any) => {
        const fecha = getValue();
        return fecha && fecha.trim() !== '' 
          ? fecha 
          : <span style={{ color: '#888', fontStyle: 'italic' }}>No especif.</span>;
      }
    },
    {
      accessorKey: 'UltimoExamenMedico',
      header: 'Últ. Examen',
      size: 100,
    },
    {
      accessorKey: 'AgenteCausanteDisplay',
      header: 'Agente Causante',
      size: 150,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      size: 100,
      cell: ({ row }: any) => {
        const index = filas.findIndex(fila => 
          fila.CUIL === row.original.CUIL && 
          fila.Nombre === row.original.Nombre
        );
        
        return (
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
            <EditIcon
              onClick={() => handleEditarTrabajador(index)}
              style={{
                fontSize: '16px',
                color: modoEdicion && editandoIndex !== index ? '#ccc' : '#2196f3',
                cursor: modoEdicion && editandoIndex !== index ? 'not-allowed' : 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e: any) => {
                if (!modoEdicion || editandoIndex === index) {
                  e.target.style.color = '#ff9800';
                }
              }}
              onMouseLeave={(e: any) => {
                if (!modoEdicion || editandoIndex === index) {
                  e.target.style.color = '#2196f3';
                } else {
                  e.target.style.color = '#ccc';
                }
              }}
            />
            <DeleteIcon
              onClick={() => !modoEdicion && handleEliminarTrabajador(index)}
              style={{
                fontSize: '16px',
                color: modoEdicion ? '#ccc' : '#f44336',
                cursor: modoEdicion ? 'not-allowed' : 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e: any) => {
                if (!modoEdicion) {
                  e.target.style.color = '#d32f2f';
                }
              }}
              onMouseLeave={(e: any) => {
                if (!modoEdicion) {
                  e.target.style.color = '#f44336';
                } else {
                  e.target.style.color = '#ccc';
                }
              }}
            />
          </div>
        );
      }
    }
  ], [filas, modoEdicion, editandoIndex, handleEditarTrabajador, handleEliminarTrabajador]);

  // ===== Helpers =====
  const numerosValidos = (v: string) => {
    const valor = (v ?? '').trim();
    if (valor === '') return false;
    const num = Number(valor);
    return !Number.isNaN(num) && num >= 0 && Number.isInteger(num) && num <= 99999;
  };
  const manejarCambioNumerico = (valor: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const limpio = (valor ?? '').replace(/[^0-9]/g, '');
    if (limpio.length <= 5) setter(limpio);
  };
  const trabajadorCompleto = React.useMemo(() => {
    // Verificar cada campo individualmente
    const cuilCompleto = cuil && cuil.trim() !== '' && cuil.replace(/\D/g, '').length >= 11;
    const nombreCompleto = nombre && nombre.trim() !== '';
    const sectorCompleto = sector && sector.trim() !== '';
    const ingresoCompleto = ingreso && ingreso.trim() !== '';
    const fechaInicioCompleto = fechaInicio && fechaInicio.trim() !== '';
    const exposicionCompleto = exposicion && exposicion.trim() !== '';
    const ultimoExamenMedicoCompleto = ultimoExamenMedico && ultimoExamenMedico.trim() !== '';
    const codigoAgenteCompleto = codigoAgente && codigoAgente.trim() !== '';
    
    const resultado = cuilCompleto && nombreCompleto && sectorCompleto && 
                     ingresoCompleto && fechaInicioCompleto && exposicionCompleto && 
                     ultimoExamenMedicoCompleto && codigoAgenteCompleto;
    
    console.log(' Validación trabajadorCompleto DETALLADA:', {
      cuilCompleto: { valor: cuil, completo: cuilCompleto, longitud: cuil ? cuil.replace(/\D/g, '').length : 0 },
      nombreCompleto: { valor: nombre, completo: nombreCompleto },
      sectorCompleto: { valor: sector, completo: sectorCompleto },
      ingresoCompleto: { valor: ingreso, completo: ingresoCompleto },
      fechaInicioCompleto: { valor: fechaInicio, completo: fechaInicioCompleto },
      exposicionCompleto: { valor: exposicion, completo: exposicionCompleto },
      ultimoExamenMedicoCompleto: { valor: ultimoExamenMedico, completo: ultimoExamenMedicoCompleto },
      codigoAgenteCompleto: { valor: codigoAgente, completo: codigoAgenteCompleto },
      resultado: resultado
    });
    
    return resultado;
  }, [cuil, nombre, sector, ingreso, fechaInicio, exposicion, ultimoExamenMedico, codigoAgente]);

  const puedeGenerar =
    (establecimientoSeleccionado || '').trim() !== '' &&
    numerosValidos(cantExpuestos) &&
    numerosValidos(cantNoExpuestos);

  // Verificar si hay establecimiento seleccionado para habilitar siguiente paso
  const establecimientoSeleccionadoValido = (establecimientoSeleccionado || '').trim() !== '';
  
  // Validación para cantidades completas (requisito esencial)
  const cantidadesCompletas = 
    establecimientoSeleccionadoValido &&
    numerosValidos(cantExpuestos) && 
    numerosValidos(cantNoExpuestos) &&
    (Number(cantExpuestos) + Number(cantNoExpuestos)) > 0;

  // Calcular total de trabajadores requeridos (EXPUESTOS + NO EXPUESTOS)
  const totalTrabajadoresRequeridos = cantidadesCompletas ? (Number(cantExpuestos) + Number(cantNoExpuestos)) : 0;
  const trabajadoresCargados = filas.length;
  const faltanTrabajadores = totalTrabajadoresRequeridos - trabajadoresCargados;

  // Console para debuggear totales
  console.log(' Cantidades:', {
    cantExpuestos,
    cantNoExpuestos,
    totalTrabajadoresRequeridos,
    trabajadoresCargados,
    faltanTrabajadores,
    cantidadesCompletas
  });

  // Nueva validación para el modal completo
  const puedeGuardarCompleto =
    (establecimientoSeleccionado || '').trim() !== '' &&
    cantidadesCompletas &&
    trabajadoresCargados >= totalTrabajadoresRequeridos &&
    !modoEdicion; // No permitir guardar mientras se está editando

  // ===== Carga inicial: encabezado + selects =====
  React.useEffect(() => {
    // Encabezado: si tenés datos en el listado padre, tomamos el CUIT/Razón Social de ahí
    const fila = formulariosRAR.find((f) => (f.cuit || f.CUIT) && (f.razonSocial || f.RazonSocial));
    if (fila) {
      setCuitActual(String(fila.cuit || fila.CUIT || cuit || ''));
      setRazonSocialActual(String(fila.razonSocial || fila.RazonSocial || ''));
    } else {
      setCuitActual(String(cuit || ''));
    }
  }, [cuit, formulariosRAR]);

  React.useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setCargandoSelects(true);

        // Validar CUIT
        const cuitParaUsar = cuitActual || cuit;
        
        if (!cuitParaUsar || cuitParaUsar === 0 || String(cuitParaUsar).trim() === '' || String(cuitParaUsar).trim() === '0') {
          if (!cancel) {
            setOpcionesEstablecimientos([]);
            setCargandoSelects(false);
          }
          return;
        }

        console.log(' Cargando selects para CUIT:', cuitParaUsar);

        // Establecimientos
        const url = `http://arttest.intersistemas.ar:8302/api/Establecimientos/Empresa/${cuitParaUsar}`;
        
        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        const establecimientos = resp.ok ? await resp.json() : [];
        
        console.log(' Respuesta establecimientos:', establecimientos);
        
        const estArr = Array.isArray(establecimientos)
          ? establecimientos
          : establecimientos?.data
          ? (Array.isArray(establecimientos.data) ? establecimientos.data : [establecimientos.data])
          : (establecimientos ? [establecimientos] : []);

        console.log(' Array procesado:', estArr);

        const opciones: OpcionEstablecimiento[] = estArr
          .filter((est: any) => est && (est.domicilioCalle || est.interno))
          .map((est: any) => ({
            interno: String(est.interno ?? ''),
            domicilioCalle: String(est.domicilioCalle ?? ''),
            displayText: `${est.interno ?? 'S/C'} - ${est.domicilioCalle ?? 'Sin dirección'}`
          }));

        console.log(' Opciones finales:', opciones);

        if (!cancel) setOpcionesEstablecimientos(opciones);

        // Preselección si viene por props
        if (!cancel && internoEstablecimiento && String(internoEstablecimiento) !== '0' && opciones.length > 0) {
          const existe = opciones.some(o => o.interno === String(internoEstablecimiento));
          if (existe) setEstablecimientoSeleccionado(String(internoEstablecimiento));
        }

        // Agentes
        const respAg = await fetch('http://arttest.intersistemas.ar:8302/api/AgentesCausantes');
        const agentes = respAg.ok ? await respAg.json() : [];
        const agArr = Array.isArray(agentes)
          ? agentes
          : agentes?.data
          ? (Array.isArray(agentes.data) ? agentes.data : [agentes.data])
          : (agentes ? [agentes] : []);

        const opcionesAgentes: OpcionAgente[] = agArr
          .filter((a: any) => a && (a.codigo || a.agenteCausante))
          .map((a: any) => ({
            interno: Number(a.interno || 0),
            codigo: Number(a.codigo || 0),
            agenteCausante: String(a.agenteCausante || ''),
            agenteTipo: String(a.agenteTipo || ''),
            displayText: `${a.codigo || 'S/C'} - ${a.agenteCausante || 'Sin descripción'}`
          }));

        if (!cancel) setAgentesCausantes(opcionesAgentes);
      } catch (e) {
        console.error('Error cargando selects:', e);
        if (!cancel) {
          setOpcionesEstablecimientos([]);
          setAgentesCausantes([]);
        }
      } finally {
        if (!cancel) setCargandoSelects(false);
      }
    })();
    return () => { cancel = true; };
  }, [cuit, cuitActual, internoEstablecimiento]);

  // ===== Efecto para manejar lógica de exposición y agente causante =====
  React.useEffect(() => {
    const exposicionNum = Number(exposicion) || 0;
    
    if (exposicionNum === 0 && agentesCausantes.length > 0) {
      // Si exposición es 0, buscar y seleccionar automáticamente el agente con código 90009
      const agenteOtrosFisicos = agentesCausantes.find(agente => agente.codigo === 90009);
      if (agenteOtrosFisicos) {
        setCodigoAgente(String(agenteOtrosFisicos.codigo));
        console.log(' Agente "OTROS AGENTES FISICOS" (90009) seleccionado automáticamente:', agenteOtrosFisicos);
      } else {
        // Fallback: si no se encuentra el agente 90009, usar el primero de la lista
        const primerAgente = agentesCausantes[0];
        if (primerAgente) {
          setCodigoAgente(String(primerAgente.codigo));
          console.log('Agente 90009 no encontrado, usando primer agente como fallback:', primerAgente);
        }
      }
    } else if (exposicionNum > 0) {
      // Si exposición > 0, limpiar la selección para que el usuario pueda elegir
      // Solo limpiar si el agente actual es el código 90009 (seleccionado automáticamente)
      if (codigoAgente === '90009') {
        setCodigoAgente('');
        console.log(' Limpiando selección automática del agente 90009 para permitir selección manual');
      }
    }
  }, [exposicion, agentesCausantes, codigoAgente]);

  // ===== Función para consultar datos por CUIL =====
  const consultarDatosPorCuil = React.useCallback(async (cuilCompleto: string) => {
    // Limpiar CUIL y verificar que tenga 11 dígitos
    const cuilNumerico = cuilCompleto.replace(/\D/g, '');
    if (cuilNumerico.length !== 11) {
      return;
    }

    setConsultandoCuil(true);
    
    try {
      console.log(' Consultando CUIL:', cuilNumerico);
      
      const url = `https://api.artmutualrural.org.ar:8182/api/AfiliadoDatos/BuscarPorCUILSimple?pCUIL=${cuilNumerico}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const datos = await response.json();
        console.log(' Datos obtenidos:', datos);
        
        // Si tiene nombre, completar automáticamente
        if (datos && datos.Nombre && datos.Nombre.trim() !== '') {
          setNombre(datos.Nombre.trim());
          console.log(' Nombre completado automáticamente:', datos.Nombre);
        } else {
          console.log(' No se encontró nombre en la respuesta');
        }
      } else {
        console.log(' Error en la consulta:', response.status, response.statusText);
      }
    } catch (error) {
      console.error(' Error consultando CUIL:', error);
    } finally {
      setConsultandoCuil(false);
    }
  }, []);

  // ===== Helper para determinar si el agente causante debe estar habilitado =====
  const agenteCausanteHabilitado = cantidadesCompletas && Number(exposicion) > 0;
  const exposicionEsCero = Number(exposicion) === 0;

  // ===== Función para validar campos y actualizar errores =====
  const validarCamposTrabajador = React.useCallback(() => {
    const nuevosErrores = {
      cuil: '',
      nombre: '',
      sector: '',
      ingreso: '',
      fechaInicio: '',
      exposicion: '',
      ultimoExamenMedico: '',
      codigoAgente: ''
    };

    // Validar CUIL
    if (!cuil || cuil.trim() === '') {
      nuevosErrores.cuil = 'El CUIL es requerido';
    } else if (cuil.replace(/\D/g, '').length < 11) {
      nuevosErrores.cuil = 'El CUIL debe tener 11 dígitos';
    }

    // Validar Nombre
    if (!nombre || nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre completo es requerido';
    }

    // Validar Sector
    if (!sector || sector.trim() === '') {
      nuevosErrores.sector = 'El sector/tareas es requerido';
    }

    // Validar Fecha de Ingreso
    if (!ingreso || ingreso.trim() === '') {
      nuevosErrores.ingreso = 'La fecha de ingreso es requerida';
    }

    // Validar Fecha Inicio Exposición
    if (!fechaInicio || fechaInicio.trim() === '') {
      nuevosErrores.fechaInicio = 'La fecha de inicio de exposición es requerida';
    }

    // Validar Nivel de Exposición
    if (!exposicion || exposicion.trim() === '') {
      nuevosErrores.exposicion = 'El nivel de exposición es requerido';
    } else if (isNaN(Number(exposicion)) || Number(exposicion) < 0) {
      nuevosErrores.exposicion = 'Debe ser un número mayor o igual a 0';
    }

    // Validar Último Examen Médico
    if (!ultimoExamenMedico || ultimoExamenMedico.trim() === '') {
      nuevosErrores.ultimoExamenMedico = 'La fecha del último examen médico es requerida';
    }

    // Validar Código Agente (solo si la exposición es mayor a 0)
    if (Number(exposicion) > 0 && (!codigoAgente || codigoAgente.trim() === '')) {
      nuevosErrores.codigoAgente = 'Debe seleccionar un agente causante cuando la exposición es mayor a 0';
    }

    setErroresCampos(nuevosErrores);
    
    // Retornar si hay errores
    return Object.values(nuevosErrores).some(error => error !== '');
  }, [cuil, nombre, sector, ingreso, fechaInicio, exposicion, ultimoExamenMedico, codigoAgente]);

  // ===== Handlers =====

  const handleCargarFila = () => {
    console.log(' handleCargarFila iniciado');
    console.log(' Estado de campos:', {
      cuil,
      nombre,
      sector,
      ingreso,
      fechaInicio,
      exposicion,
      ultimoExamenMedico,
      codigoAgente,
      trabajadorCompleto
    });
    
    // Si estamos en modo edición, usar la función de guardar edición
    if (modoEdicion) {
      console.log(' Modo edición activo, ejecutando handleGuardarEdicion');
      handleGuardarEdicion();
      return;
    }

    // Validar campos y mostrar errores
    const hayErrores = validarCamposTrabajador();
    if (hayErrores) {
      console.log(' Trabajador incompleto con errores de validación');
      return;
    }
    
    if (filas.length >= totalTrabajadoresRequeridos) {
      alert(`Ya cargaste todos los trabajadores requeridos (${totalTrabajadoresRequeridos})`);
      return;
    }

    const cuilNum = (cuil || '').replace(/\D/g, '');
    if (filas.some((f) => f.CUIL?.replace(/\D/g, '') === cuilNum)) {
      alert('Este CUIL ya fue cargado');
      return;
    }

    const agente = agentesCausantes.find((a) => String(a.codigo) === (codigoAgente || '').trim());

    const nuevoTrabajador = {
      CUIL: (cuil || '').trim(),
      Nombre: (nombre || '').trim(),
      SectorTareas: (sector || '').trim(),
      Ingreso: (ingreso || '').trim(),
      FechaInicio: (fechaInicio || '').trim(),
      Exposicion: (exposicion || '').trim(),
      FechaFinExposicion: (fechaFinExposicion || '').trim(),
      UltimoExamenMedico: (ultimoExamenMedico || '').trim(),
      CodigoAgente: (codigoAgente || '').trim(),
      AgenteCausanteDisplay: agente ? agente.displayText : (codigoAgente || '').trim(),
    };

    console.log(' Cargando trabajador:', nuevoTrabajador);

    setFilas((prev) => {
      const nuevasFilas = [...prev, nuevoTrabajador];
      console.log('👥 DEBUG - Filas actualizadas:', nuevasFilas);
      return nuevasFilas;
    });

    // limpiar campos pero mantener modal abierto
    setCuil('');
    setNombre('');
    setSector('');
    setIngreso('');
    setFechaInicio('');
    setExposicion('0'); // Volver al valor por defecto
    setFechaFinExposicion('');
    setUltimoExamenMedico('');
    setCodigoAgente('');
    
    // Mensaje de confirmación pero mantener modal abierto
    if (filas.length + 1 >= totalTrabajadoresRequeridos) {
      alert(`¡Perfecto! Has cargado todos los ${totalTrabajadoresRequeridos} trabajadores expuestos. Ya podés guardar el formulario RAR completo.`);
    }
  };



  // Función para guardar la edición
  const handleGuardarEdicion = () => {
    // Validar campos y mostrar errores
    const hayErrores = validarCamposTrabajador();
    if (hayErrores) {
      return;
    }

    if (editandoIndex < 0) return;

    const cuilNum = cuil.replace(/\D/g, '');
    // Verificar CUIL duplicado (excluyendo el que estamos editando)
    const duplicado = filas.some((f, idx) => 
      idx !== editandoIndex && f.CUIL?.replace(/\D/g, '') === cuilNum
    );

    if (duplicado) {
      alert('Este CUIL ya fue cargado por otro trabajador');
      return;
    }

    const agente = agentesCausantes.find((a) => String(a.codigo) === codigoAgente.trim());

    // Actualizar el trabajador en la posición editandoIndex
    setFilas((prev) => {
      const nuevasFilas = [...prev];
      nuevasFilas[editandoIndex] = {
        CUIL: cuil.trim(),
        Nombre: nombre.trim(),
        SectorTareas: sector.trim(),
        Ingreso: ingreso.trim(),
        FechaInicio: fechaInicio.trim(),
        Exposicion: exposicion.trim(),
        FechaFinExposicion: fechaFinExposicion.trim(),
        UltimoExamenMedico: ultimoExamenMedico.trim(),
        CodigoAgente: codigoAgente.trim(),
        AgenteCausanteDisplay: agente ? agente.displayText : codigoAgente.trim(),
      };
      return nuevasFilas;
    });

    // Limpiar y salir del modo edición
    handleCancelarEdicion();
    alert('Trabajador actualizado correctamente');
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setCuil('');
    setNombre('');
    setSector('');
    setIngreso('');
    setFechaInicio('');
    setExposicion('0'); // Volver al valor por defecto
    setFechaFinExposicion('');
    setUltimoExamenMedico('');
    setCodigoAgente('');
    setEditandoIndex(-1);
    setModoEdicion(false);
  };

  // Nueva función para guardar directamente desde el modal completo
  const handleGuardarCompleto = async () => {
    console.log(' Iniciando handleGuardarCompleto');
    console.log('📊 DEBUG - Estado actual:', {
      puedeGuardarCompleto,
      cantExpuestos,
      cantNoExpuestos,
      establecimientoSeleccionado,
      filas: filas.length,
      totalTrabajadoresRequeridos,
      trabajadoresCargados: filas.length
    });

    if (!puedeGuardarCompleto) {
      console.log(' No puede guardar completo');
      alert('Completá todos los campos requeridos');
      return;
    }

    const total = Number(cantExpuestos) + Number(cantNoExpuestos);
    if (total === 0) return alert('El total de trabajadores debe ser mayor a 0.');
    if (total > 99999) return alert('El total no puede exceder 99,999.');

    if (guardandoRef.current) return;
    guardandoRef.current = true;

    try {
      const fechaActual = dayjs().toISOString();
      const establecimientoParaEnvio = Number(establecimientoSeleccionado) || 0;

      console.log(' Datos básicos:', {
        fechaActual,
        establecimientoParaEnvio,
        filasCargadas: filas
      });

      // USAR TODOS LOS TRABAJADORES DE LA TABLA, NO SOLO LOS CAMPOS DEL MODAL
      const formularioRARDetalle = filas.map((f, index) => {
        const trabajador = {
          internoFormulariosRar: 0,
          cuil: Number(String(f.CUIL || '').replace(/\D/g, '') || 0),
          nombre: f.Nombre || '',
          sectorTarea: f.SectorTareas || '',
          fechaIngreso: dayjs(f.Ingreso || fechaActual).toISOString(),
          horasExposicion: Number(String(f.Exposicion || '').replace(/[^\d]/g, '')) || 4,
          fechaUltimoExamenMedico: dayjs(f.UltimoExamenMedico || fechaActual).toISOString(),
          codigoAgente: Number(f.CodigoAgente) || 1,
          fechaInicioExposicion: dayjs(f.FechaInicio || fechaActual).toISOString(),
          fechaFinExposicion: f.FechaFinExposicion && f.FechaFinExposicion.trim() !== '' 
            ? dayjs(f.FechaFinExposicion).toISOString()
            : dayjs('2099-01-01').toISOString(), // Fecha por defecto: 01/01/2099 para indicar "no especificada"
        };
        console.log(`👤 DEBUG - Trabajador ${index + 1}:`, trabajador);
        return trabajador;
      });

      const payload = {
        cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
        cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
        fechaCreacion: fechaActual,
        fechaPresentacion: fechaActual,
        internoPresentacion: 0,
        internoEstablecimiento: establecimientoParaEnvio,
        formularioRARDetalle: formularioRARDetalle,
      };

      console.log(' Payload completo:', JSON.stringify(payload, null, 2));

      console.log(' Enviando POST request...');
      
      const resp = await fetch('http://arttest.intersistemas.ar:8302/api/FormulariosRAR', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log(' Respuesta del servidor:', {
        status: resp.status,
        statusText: resp.statusText,
        ok: resp.ok
      });

      if (!resp.ok) {
        const t = await resp.text();
        console.log(' Error del servidor:', t);
        throw new Error(`Error del servidor (${resp.status}): ${t}`);
      }

      const responseData = await resp.json();
      console.log(' Respuesta exitosa:', responseData);

      // Mostrar mensaje de éxito y preguntar qué hacer
      const confirmacion = window.confirm(
        'Formulario RAR creado exitosamente!\n\n' +
        '¿Querés crear otro formulario RAR?\n\n' +
        '• Presioná "Aceptar" para crear otro formulario\n' +
        '• Presioná "Cancelar" para volver a la lista'
      );

      if (confirmacion) {
        // Limpiar el formulario para crear otro
        setCuil(''); setNombre(''); setSector(''); setIngreso('');
        setFechaInicio(''); setExposicion('0'); setFechaFinExposicion('');
        setUltimoExamenMedico(''); setCodigoAgente('');
        setCantExpuestos(''); setCantNoExpuestos('');
        setEstablecimientoSeleccionado('');
        setFilas([]);
        setEditandoIndex(-1);
        setModoEdicion(false);
        // Mantener el modal abierto para crear otro formulario
      } else {
        // Cerrar modal y volver a la lista
        setModalTrabajadorOpen(false);
        finalizaCarga(true);
      }
    } catch (e: any) {
      console.error(' Error al guardar (handleGuardarCompleto):', e);
      console.error(' Stack trace:', e.stack);
      alert(e?.message || 'Error desconocido al guardar');
    } finally {
      guardandoRef.current = false;
    }
  };

  const handleGuardar = async () => {
    if (!numerosValidos(cantExpuestos) || !numerosValidos(cantNoExpuestos)) {
      return alert('Ingresá cantidades válidas');
    }
    if (!establecimientoSeleccionado) return alert('Seleccioná un establecimiento válido');
    if (filas.length === 0) return alert('Cargá al menos un trabajador');

    if (guardandoRef.current) return;
    guardandoRef.current = true;

    try {
      const fechaActual = dayjs().toISOString();
      const establecimientoParaEnvio = Number(establecimientoSeleccionado) || Number(internoEstablecimiento) || 0;

      const formularioRARDetalle = filas.map((f) => ({
        internoFormulariosRar: 0,
        cuil: Number(String(f.CUIL || '').replace(/\D/g, '') || 0),
        nombre: f.Nombre || '',
        sectorTarea: f.SectorTareas || '',
        fechaIngreso: dayjs(f.Ingreso || fechaActual).toISOString(),
        horasExposicion: Number(String(f.Exposicion || '').replace(/[^\d]/g, '')) || 4,
        fechaUltimoExamenMedico: dayjs(f.UltimoExamenMedico || fechaActual).toISOString(),
        codigoAgente: Number(f.CodigoAgente) || 1,
        fechaInicioExposicion: dayjs(f.FechaFin || fechaActual).toISOString(),
        fechaFinExposicion: f.FechaFinExposicion && f.FechaFinExposicion.trim() !== '' 
          ? dayjs(f.FechaFinExposicion).toISOString()
          : dayjs('2099-01-01').toISOString(), // Fecha por defecto: 01/01/2099 para indicar "no especificada"
      }));

      const payload = {
        cantTrabajadoresExpuestos: Number(cantExpuestos) || 0,
        cantTrabajadoresNoExpuestos: Number(cantNoExpuestos) || 0,
        fechaCreacion: fechaActual,
        fechaPresentacion: fechaActual,
        internoPresentacion: 0,
        internoEstablecimiento: establecimientoParaEnvio,
        formularioRARDetalle: formularioRARDetalle,
      };

      const resp = await fetch('http://arttest.intersistemas.ar:8302/api/FormulariosRAR', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`Error del servidor (${resp.status}): ${t}`);
      }

      alert('Formulario RAR creado exitosamente');
      finalizaCarga(true);
    } catch (e: any) {
      console.error('Error al guardar:', e);
      alert(e?.message || 'Error desconocido al guardar');
    } finally {
      guardandoRef.current = false;
    }
  };

  const llegoAlTope = generar && totalTrabajadores > 0 && filas.length >= totalTrabajadores;

  // ===== UI =====
  return (
    <div className={styles.wrapperCol}>


      {/* MODAL COMPLETO - Establecimiento + Cantidades + Trabajador */}
      <CustomModal
        open={modalTrabajadorOpen}
        onClose={() => {
          // Cerrar modal y redirigir a la pantalla principal (igual que botón Cancelar)
          setModalTrabajadorOpen(false);
          // Limpiar todos los campos del formulario
          setCuil(''); setNombre(''); setSector(''); setIngreso('');
          setFechaInicio(''); setExposicion('0'); setFechaFinExposicion('');
          setUltimoExamenMedico(''); setCodigoAgente('');
          setCantExpuestos(''); setCantNoExpuestos('');
          setEstablecimientoSeleccionado('');
          setFilas([]);
          setEditandoIndex(-1);
          setModoEdicion(false);
          // Redirigir a la pantalla principal
          finalizaCarga(false);
        }}
        title="Formulario RAR"
        size="large"
      >
        <div className={styles.modalGridCol}>
          {/* SECCIÓN 0: INFORMACIÓN DEL EMPLEADOR */}
          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>Datos del Empleador</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center' }}>
              <div style={{ fontSize: '14px' }}>
                <strong>CUIT:</strong> {cuipFormatter(cuitActual) || 'No disponible'}
              </div>
              <div style={{ fontSize: '14px' }}>
                <strong>Razón Social:</strong> {razonSocialActual || 'No disponible'}
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: SELECTOR DE ESTABLECIMIENTO */}
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
              Selección de Establecimiento
              <span style={{ color: '#d32f2f', fontSize: '16px' }}>*</span>
            </h4>
            <div className={styles.modalRow}>
              <FormControl fullWidth required className={styles.flex1}>
                <InputLabel>Establecimiento</InputLabel>
                <Select
                  value={establecimientoSeleccionado}
                  onChange={(e) => setEstablecimientoSeleccionado(e.target.value)}
                  label="Establecimiento"
                  disabled={cargandoSelects}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {cargandoSelects ? (
                    <MenuItem disabled value="">
                      Cargando establecimientos...
                    </MenuItem>
                  ) : opcionesEstablecimientos.length === 0 ? (
                    <MenuItem disabled value="">
                      No hay establecimientos disponibles
                    </MenuItem>
                  ) : (
                    opcionesEstablecimientos.map((est) => (
                      <MenuItem key={est.interno} value={est.interno}>
                        {est.displayText}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* SECCIÓN 2: CANTIDADES DE TRABAJADORES */}
          <div style={{ 
            background: establecimientoSeleccionadoValido ? '#f8f9fa' : '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            opacity: establecimientoSeleccionadoValido ? 1 : 0.6
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              color: establecimientoSeleccionadoValido ? '#495057' : '#9e9e9e'
            }}>
              Cantidades de Trabajadores 
              <span style={{ color: '#d32f2f', fontSize: '16px' }}>*</span>
              {!establecimientoSeleccionadoValido && (
                <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
                  (Seleccioná primero un establecimiento)
                </span>
              )}
              {establecimientoSeleccionadoValido && (
                <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
                  (Requerido para habilitar datos del trabajador)
                </span>
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
          </div>

          {/* SECCIÓN 3: DATOS DEL TRABAJADOR */}
          <div style={{ 
            background: cantidadesCompletas ? '#f8f9fa' : '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            opacity: cantidadesCompletas ? 1 : 0.6
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              color: cantidadesCompletas ? '#495057' : '#9e9e9e'
            }}>
              Datos del Trabajador
              {!cantidadesCompletas && (
                <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
                  (Completá primero las cantidades de trabajadores)
                </span>
              )}
            </h4>
            {/* FILA 1: CUIL y Nombre */}
            <div className={styles.modalRow} style={{ marginBottom: '20px' }}>
              <TextField
                label="CUIL"
                name="cuil"
                value={cuil}
                onChange={(e) => {
                  if (!cantidadesCompletas) return;
                  const value = (e.target.value || '').replace(/[^0-9]/g, '');
                  if (value.length <= 11) {
                    let f = value;
                    if (value.length > 2) f = value.substring(0, 2) + '-' + value.substring(2);
                    if (value.length > 10) f = value.substring(0, 2) + '-' + value.substring(2, 10) + '-' + value.substring(10);
                    setCuil(f);
                    
                    // Limpiar error al escribir
                    if (erroresCampos.cuil) {
                      setErroresCampos(prev => ({ ...prev, cuil: '' }));
                    }
                    
                    // Si el CUIL está completo (11 dígitos), consultar datos automáticamente
                    if (value.length === 11) {
                      consultarDatosPorCuil(f);
                    }
                  }
                }}
                fullWidth
                required
                disabled={!cantidadesCompletas}
                placeholder={cantidadesCompletas ? "XX-XXXXXXXX-X" : "Completá primero las cantidades"}
                inputProps={{ maxLength: 13 }}
                className={styles.flex1}
                style={{ marginRight: '15px' }}
                error={!!erroresCampos.cuil}
                helperText={
                  erroresCampos.cuil || 
                  (cantidadesCompletas ? "El nombre se completará automáticamente al ingresar el CUIL completo" : "")
                }
              />
              <TextField
                label={consultandoCuil ? "Nombre Completo (Consultando...)" : "Nombre Completo"}
                name="nombre"
                value={nombre}
                onChange={(e) => {
                  if (cantidadesCompletas && !consultandoCuil) {
                    setNombre(e.target.value);
                    // Limpiar error al escribir
                    if (erroresCampos.nombre) {
                      setErroresCampos(prev => ({ ...prev, nombre: '' }));
                    }
                  }
                }}
                fullWidth
                required
                disabled={!cantidadesCompletas || consultandoCuil}
                placeholder={
                  !cantidadesCompletas 
                    ? "Completá primero las cantidades"
                    : consultandoCuil 
                    ? "Consultando datos..." 
                    : "Se completará automáticamente al ingresar CUIL o ingresalo manualmente"
                }
                className={styles.flex1}
                error={!!erroresCampos.nombre}
                helperText={
                  erroresCampos.nombre || 
                  (consultandoCuil ? "🔍 Consultando datos del afiliado..." : "")
                }
              />
            </div>

            {/* FILA 2: Sector y Fecha de Ingreso */}
            <div className={styles.modalRow} style={{ marginBottom: '20px' }}>
              <TextField
                label="Sector/Tareas"
                name="sector"
                value={sector}
                onChange={(e) => {
                  if (cantidadesCompletas) {
                    setSector(e.target.value);
                    // Limpiar error al escribir
                    if (erroresCampos.sector) {
                      setErroresCampos(prev => ({ ...prev, sector: '' }));
                    }
                  }
                }}
                fullWidth
                required
                disabled={!cantidadesCompletas}
                placeholder={cantidadesCompletas ? "Descripción del sector o tareas realizadas" : "Completá primero las cantidades"}
                className={styles.flex1}
                style={{ marginRight: '15px' }}
                error={!!erroresCampos.sector}
                helperText={erroresCampos.sector}
              />
              <TextField
                label="Fecha de Ingreso"
                name="ingreso"
                type="date"
                value={ingreso}
                onChange={(e) => {
                  if (cantidadesCompletas) {
                    setIngreso(e.target.value);
                    // Limpiar error al escribir
                    if (erroresCampos.ingreso) {
                      setErroresCampos(prev => ({ ...prev, ingreso: '' }));
                    }
                  }
                }}
                fullWidth
                required
                disabled={!cantidadesCompletas}
                InputLabelProps={{ shrink: true }}
                className={styles.flex1}
                error={!!erroresCampos.ingreso}
                helperText={erroresCampos.ingreso}
              />
            </div>

            {/* FILA 3: Fecha Inicio Exposición y Tipo de Exposición */}
            <div className={styles.modalRow} style={{ marginBottom: '20px' }}>
              <TextField
                label="Fecha Inicio Exposición"
                name="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => {
                  if (cantidadesCompletas) {
                    setFechaInicio(e.target.value);
                    // Limpiar error al escribir
                    if (erroresCampos.fechaInicio) {
                      setErroresCampos(prev => ({ ...prev, fechaInicio: '' }));
                    }
                  }
                }}
                fullWidth
                required
                disabled={!cantidadesCompletas}
                InputLabelProps={{ shrink: true }}
                className={styles.flex1}
                style={{ marginRight: '15px' }}
                error={!!erroresCampos.fechaInicio}
                helperText={erroresCampos.fechaInicio}
              />
              <TextField
                label="Nivel de Exposición"
                name="exposicion"
                type="number"
                value={exposicion}
                onChange={(e) => {
                  if (cantidadesCompletas) {
                    const valor = e.target.value;
                    // Solo permitir números enteros >= 0
                    if (valor === '' || (/^\d+$/.test(valor) && Number(valor) >= 0)) {
                      setExposicion(valor);
                      // Limpiar error al escribir
                      if (erroresCampos.exposicion) {
                        setErroresCampos(prev => ({ ...prev, exposicion: '' }));
                      }
                    }
                  }
                }}
                fullWidth
                required
                disabled={!cantidadesCompletas}
                placeholder={cantidadesCompletas ? "Ingresá el nivel de exposición (0 = no expuesto)" : "Completá primero las cantidades"}
                className={styles.flex1}
                inputProps={{
                  min: 0,
                  step: 1
                }}
                error={!!erroresCampos.exposicion}
                helperText={erroresCampos.exposicion}
              />
            </div>

            {/* FILA 4: Fecha Fin Exposición y Último Examen Médico */}
            <div className={styles.modalRow} style={{ marginBottom: '20px' }}>
              <TextField
                label="Fecha Fin Exposición (Opcional)"
                name="fechaFinExposicion"
                type="date"
                value={fechaFinExposicion}
                onChange={(e) => cantidadesCompletas && setFechaFinExposicion(e.target.value)}
                fullWidth
                disabled={!cantidadesCompletas}
                InputLabelProps={{ shrink: true }}
                className={styles.flex1}
                style={{ marginRight: '15px' }}
                
              />
              <TextField
                label="Último Examen Médico"
                name="ultimoExamenMedico"
                type="date"
                value={ultimoExamenMedico}
                onChange={(e) => {
                  if (cantidadesCompletas) {
                    setUltimoExamenMedico(e.target.value);
                    // Limpiar error al escribir
                    if (erroresCampos.ultimoExamenMedico) {
                      setErroresCampos(prev => ({ ...prev, ultimoExamenMedico: '' }));
                    }
                  }
                }}
                fullWidth
                required
                disabled={!cantidadesCompletas}
                InputLabelProps={{ shrink: true }}
                className={styles.flex1}
                error={!!erroresCampos.ultimoExamenMedico}
                helperText={erroresCampos.ultimoExamenMedico}
              />
            </div>

            {/* FILA 5: Agente Causante (ocupa todo el ancho) */}
            <div className={styles.modalRow} style={{ marginBottom: '20px' }}>
              <FormControl fullWidth required className={styles.flex1} error={!!erroresCampos.codigoAgente}>
                <InputLabel id="lbl-agente">
                  {!cantidadesCompletas 
                    ? "Agente Causante (Completá primero las cantidades)"
                    : exposicionEsCero 
                    ? "Agente Causante (Selección automática: OTROS AGENTES FISICOS)"
                    : "Agente Causante"
                  }
                </InputLabel>
                <Select
                  labelId="lbl-agente"
                  name="codigoAgente"
                  value={codigoAgente}
                  label="Agente Causante"
                  disabled={!cantidadesCompletas || exposicionEsCero}
                  onChange={(e: SelectChangeEvent<string>) => {
                    if (cantidadesCompletas && !exposicionEsCero) {
                      setCodigoAgente(e.target.value);
                      // Limpiar error al seleccionar
                      if (erroresCampos.codigoAgente) {
                        setErroresCampos(prev => ({ ...prev, codigoAgente: '' }));
                      }
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    {!cantidadesCompletas 
                      ? "Completá primero las cantidades"
                      : exposicionEsCero
                      ? "Automático: OTROS AGENTES FISICOS (90009)"
                      : "Seleccione un agente causante"
                    }
                  </MenuItem>
                  {cantidadesCompletas && agentesCausantes.length === 0 ? (
                    <MenuItem disabled value="__empty__">No hay agentes causantes disponibles</MenuItem>
                  ) : cantidadesCompletas ? (
                    agentesCausantes.map((agente) => (
                      <MenuItem key={agente.codigo} value={String(agente.codigo)}>
                        {agente.displayText}
                      </MenuItem>
                    ))
                  ) : null}
                </Select>
                {erroresCampos.codigoAgente && (
                  <div style={{ 
                    color: '#d32f2f', 
                    fontSize: '0.75rem', 
                    marginTop: '3px', 
                    marginLeft: '14px' 
                  }}>
                    {erroresCampos.codigoAgente}
                  </div>
                )}
              </FormControl>
     
            </div>
            
            {/* BOTÓN CARGAR TRABAJADOR */}
            {cantidadesCompletas && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '25px', 
                paddingTop: '20px', 
                borderTop: '1px solid #e0e0e0' 
              }}>
                {/* Botones Centrados - Modo Edición o Normal */}
                {modoEdicion ? (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '15px'
                  }}>
                    <CustomButton
                      onClick={handleCargarFila}
                      style={{
                        background: '#ff9800',
                        color: 'white',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      Guardar Cambios
                    </CustomButton>
                    
                    <CustomButton
                      onClick={handleCancelarEdicion}
                      style={{
                        background: '#757575',
                        color: 'white',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      Cancelar Edición
                    </CustomButton>
                  </div>
                ) : (
                  <CustomButton
                    onClick={handleCargarFila}
                    disabled={filas.length >= totalTrabajadoresRequeridos}
                    style={{
                      background: filas.length < totalTrabajadoresRequeridos ? '#2196f3' : '#cccccc',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    {filas.length >= totalTrabajadoresRequeridos 
                      ? `Ya cargaste todos los trabajadores (${totalTrabajadoresRequeridos})`
                      : ` Cargar Trabajador (${filas.length + 1}/${totalTrabajadoresRequeridos})`
                    }
                  </CustomButton>
                )}
              </div>
            )}
          </div>

          {/* TABLA DE TRABAJADORES CARGADOS */}
          {filas.length > 0 && (
            <div style={{ background: 'white', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                Trabajadores Cargados ({filas.length}/{totalTrabajadoresRequeridos})
              </h4>
              
              <DataTableImport
                data={filas}
                columns={columnasTabla}
                size="small"
                pageSizeOptions={[5, 10, 15]}
                enableSorting={true}
                enableFiltering={false}
                onRowClick={(rowData) => {
                  // Resaltar la fila seleccionada si está en modo edición
                  const index = filas.findIndex(fila => 
                    fila.CUIL === rowData.CUIL && 
                    fila.Nombre === rowData.Nombre
                  );
                  if (editandoIndex === index && modoEdicion) {
                    console.log('Fila en edición seleccionada');
                  }
                }}
              />
              
              {/* RESUMEN DE PROGRESO */}
              <div style={{ 
                background: filas.length >= totalTrabajadoresRequeridos ? '#c8e6c9' : '#fff3cd', 
                padding: '10px', 
                borderRadius: '3px', 
                marginTop: '10px', 
                textAlign: 'center',
                border: `1px solid ${filas.length >= totalTrabajadoresRequeridos ? '#4caf50' : '#ffc107'}`
              }}>
                {filas.length >= totalTrabajadoresRequeridos ? (
                  <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    Has cargado todos los trabajadores expuestos requeridos
                  </span>
                ) : (
                  <span style={{ color: '#f57f17', fontWeight: 'bold' }}>
                    Faltan {totalTrabajadoresRequeridos - filas.length} trabajadores por cargar
                  </span>
                )}
              </div>
            </div>
          )}

          {/* MENSAJE DE ESTADO */}
          {!establecimientoSeleccionado && (
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <strong>Para continuar:</strong> Seleccione primero un establecimiento
            </div>
          )}


          {/* {cantidadesCompletas && !trabajadorCompleto && (
            <div style={{ 
              background: '#e3f2fd', 
              border: '1px solid #90caf9', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <strong>Siguiente paso:</strong> Completá todos los datos del trabajador para poder guardar
            </div>
          )} */}

          {/* BOTONES DE ACCIÓN */}
           {!establecimientoSeleccionado ? null : (
          <div className={styles.modalButtons}>
            <CustomButton 
              onClick={handleGuardarCompleto} 
              disabled={!puedeGuardarCompleto}
              style={{ 
                background: puedeGuardarCompleto ? '#4caf50' : '#cccccc', 
                color: 'white' 
              }}
            >
              {puedeGuardarCompleto ? 'Guardar Formulario RAR Completo' : 'Completá todos los campos requeridos'}
            </CustomButton>
            <CustomButton
              onClick={() => {
                // Limpiar todos los campos del formulario
                setCuil(''); setNombre(''); setSector(''); setIngreso('');
                setFechaInicio(''); setExposicion('0'); setFechaFinExposicion('');
                setUltimoExamenMedico(''); setCodigoAgente('');
                setCantExpuestos(''); setCantNoExpuestos('');
                setEstablecimientoSeleccionado('');
                setFilas([]); // Limpiar también la tabla de trabajadores cargados
                // Cancelar edición si está activa
                setEditandoIndex(-1);
                setModoEdicion(false);
              }}
            >
              Limpiar Todo
            </CustomButton>
            <CustomButton 
              onClick={() => {
                // Cerrar modal y redirigir a la pantalla principal
                setModalTrabajadorOpen(false);
                // Limpiar todos los campos del formulario
                setCuil(''); setNombre(''); setSector(''); setIngreso('');
                setFechaInicio(''); setExposicion('0'); setFechaFinExposicion('');
                setUltimoExamenMedico(''); setCodigoAgente('');
                setCantExpuestos(''); setCantNoExpuestos('');
                setEstablecimientoSeleccionado('');
                setFilas([]);
                setEditandoIndex(-1);
                setModoEdicion(false);
                // Redirigir a la pantalla principal
                finalizaCarga(false);
              }}
              style={{ 
                background: '#757575', 
                color: 'white' 
              }}
            >
              Cancelar
            </CustomButton>
          </div>
           )
           }
        </div>
      </CustomModal>

    </div>
  );
};

export default FormularioRARCrear;

