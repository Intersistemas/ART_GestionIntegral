import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import BaseDocumentPDF from '../BaseDocumentPDF';
import { formatearFecha, manejarValorNulo } from '../utils/formatUtils';

// Importa tu logo aquí
// import logo from '../../../images/Header.png';

/**
 * Componente de cabecera personalizado para formularios RAR
 */
const CabeceraRAR = ({ referenteDatos = [], formularioRAR = {} }) => {
  const styles = StyleSheet.create({
    cabecera: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    imagen: {
      height: 80,
      width: 300,
      alignItems: 'left',
    },
    containerCabeceraForm: {
      backgroundColor: '#83BC00',
      marginBottom: 10,
      width: '98%',
      padding: 5,
    },
    textoCabeceraForm: {
      color: 'white',
      fontWeight: 'extrabold',
      fontSize: 16,
      textAlign: 'center',
    },
    textoDatosBold: {
      fontSize: 16,
      fontWeight: 'extrabold',
      marginBottom: 5,
    },
    datosRow: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    datosColumn: {
      width: '30%',
      fontSize: 12,
      fontWeight: 'light',
    },
  });

  if (!referenteDatos.length || !formularioRAR) {
    return <Text>Error: Datos de cabecera no disponibles</Text>;
  }

  const empresa = referenteDatos[0];
  const establecimiento = formularioRAR.RefEstablecimiento || {};

  return (
    <>
      {/* Logo y cabecera */}
      <View style={styles.cabecera}>
        {/* Descomenta para usar logo */}
        {/* <Image source={logo} style={styles.imagen} /> */}
        <Text style={styles.textoDatosBold}>LOGO EMPRESA</Text>
      </View>

      {/* Título del formulario */}
      <View style={styles.containerCabeceraForm}>
        <Text style={styles.textoCabeceraForm}>
          RELEVAMIENTO DE TRABAJADORES EXPUESTOS A AGENTES DE RIESGO
        </Text>
      </View>

      {/* Datos de la empresa */}
      <View style={styles.textoDatosBold}>
        <Text>Razón Social: {manejarValorNulo(empresa.RazonSocial)}</Text>
      </View>

      <View style={styles.datosColumn}>
        <Text>Fecha: {formatearFecha(formularioRAR.FechaPresentacion)}</Text>
      </View>

      <View style={styles.datosRow}>
        <View style={styles.datosColumn}>
          <Text>Contrato: {manejarValorNulo(empresa.RefEmpleador?.ContratoNro)}</Text>
        </View>
        <View style={styles.datosColumn}>
          <Text>CUIT: {manejarValorNulo(empresa.CUIT)}</Text>
        </View>
        <View style={styles.datosColumn}>
          <Text>CIIU: {manejarValorNulo(empresa.RefEmpleador?.CIIU)}</Text>
        </View>
      </View>

      {/* Datos del establecimiento */}
      <View style={styles.textoDatosBold}>
        <Text>Nro Establecimiento: {manejarValorNulo(establecimiento.Codigo)}</Text>
      </View>

      <View style={styles.datosRow}>
        <View style={styles.datosColumn}>
          <Text>Dirección: {manejarValorNulo(establecimiento.DomicilioCalle)} {manejarValorNulo(establecimiento.DomicilioNro)}</Text>
        </View>
        <View style={styles.datosColumn}>
          <Text>Actividad Principal: {manejarValorNulo(empresa.ActividadPrincipal)}</Text>
        </View>
      </View>

      <View style={styles.datosRow}>
        <View style={styles.datosColumn}>
          <Text>Localidad: {manejarValorNulo(establecimiento.SRTLocalidad?.Nombre)}</Text>
        </View>
        <View style={styles.datosColumn}>
          <Text>Trabajadores Expuestos: {manejarValorNulo(formularioRAR.CantTrabajadoresExpuestos)}</Text>
        </View>
      </View>

      <View style={styles.datosRow}>
        <View style={styles.datosColumn}>
          <Text>Provincia: {manejarValorNulo(establecimiento.SRTLocalidad?.NombreProvincia)}</Text>
        </View>
        <View style={styles.datosColumn}>
          <Text>Trabajadores NO Expuestos: {manejarValorNulo(formularioRAR.CantTrabajadoresNoExpuestos)}</Text>
        </View>
      </View>
    </>
  );
};

/**
 * Ejemplo de uso del componente base para crear un formulario RAR
 */
const EjemploFormularioRAR = (props) => {
  const { formularioRAR = {}, referenteDatos = [] } = props;
  
  // Definir las columnas de la tabla
  const columns = [
    { 
      key: 'CUIL', 
      title: 'CUIL', 
      width: '8%' 
    },
    { 
      key: 'Nombre', 
      title: 'Apellido y Nombre', 
      width: '25%' 
    },
    { 
      key: 'SectorTarea', 
      title: 'Sector y/o Tarea', 
      width: '8%' 
    },
    { 
      key: 'FechaIngreso', 
      title: 'Fecha Ingr', 
      width: '9%',
      render: (value) => formatearFecha(value)
    },
    { 
      key: 'HorasExposicion', 
      title: 'Hs Expos.', 
      width: '7%' 
    },
    { 
      key: 'FechaUltimoExamenMedico', 
      title: 'Fecha Ult. Examen', 
      width: '9%',
      render: (value) => formatearFecha(value)
    },
    { 
      key: 'agenteRiesgo', 
      title: 'Agente de Riesgo', 
      width: '35%',
      render: (value, row) => {
        if (row.HorasExposicion > 0 && row.SRTSiniestralidadAgenteCausante) {
          return `${row.SRTSiniestralidadAgenteCausante.Codigo}-${row.SRTSiniestralidadAgenteCausante.Descripcion}`;
        }
        return 'Sin Exposición';
      }
    }
  ];

  // Preparar los datos, ordenados por horas de exposición
  const data = formularioRAR.FormulariosRARDetalle 
    ? [...formularioRAR.FormulariosRARDetalle].sort((a, b) => b.HorasExposicion - a.HorasExposicion)
    : [];

  return (
    <BaseDocumentPDF
      title="Relevamiento de Trabajadores Expuestos a Agentes de Riesgo"
      headerComponent={CabeceraRAR}
      columns={columns}
      data={data}
      orientation="landscape"
      itemsPerPage={62}
      formularioRAR={formularioRAR}
      referenteDatos={referenteDatos}
      {...props}
    />
  );
};

export default EjemploFormularioRAR;