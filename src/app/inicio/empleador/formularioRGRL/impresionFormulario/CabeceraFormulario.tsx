'use client';
import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { CabeceraData } from './types/impresion';
import Formato from '@/utils/Formato';

const headerPng = '/images/Header.png';

//Estilos del PDF
const styles = StyleSheet.create({
  cabecera: { flexDirection: 'row', marginBottom: 12 },
  imagen: { height: 40, width: 125, marginRight: 12 },
  cabeceraTitulo: { justifyContent: 'center' },
  cabeceraTexto: { color: 'white', backgroundColor: '#F8A700', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 6 },
  resolucion: { marginBottom: 10 },
  resolucionTitulo: { fontWeight: 'bold', fontSize: 12, marginBottom: 4 },
  resolucionTexto: { fontSize: 10, width: '95%' },
  containerCabeceraForm: { backgroundColor: '#83BC00', marginBottom: 8, width: '98%' },
  textoCabeceraForm: { color: 'white', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 4, paddingVertical: 2 },
  textoDatos: { fontSize: 10, marginBottom: 2 },
});

const CabeceraFormulario: React.FC<CabeceraData> = ({ empresa, establecimiento, fechaSRT }) => {
  //Anexo y leyes
  const anexoI =
    'El presente relevamiento deberá ser completado obligatoriamente en todos sus campos por el empleador oprofesional responsable, revistiendo los datos allí consignados carácter de declaración jurada. El relevamiento deberá ser realizado para cada uno de los establecimientos que disponga la empresa. Para los empleadores cuya actividad se desarrolle en embarcaciones, las mismas serán consideradas como establecimientos.';
  const ley19587 =
    '"… los términos "establecimiento", "explotación", "centro de trabajo" o "puesto de trabajo" designan todo lugar destinado a la realización o donde se realicen tareas de cualquier índole o naturaleza con la presencia permanente, circunstancial o transitoria o eventual de personas físicas, y a los depósitos y dependencias anexas de todo tipo en que las mismas deban permanecer o a los que asistan o concurran por el hecho o en ocasión del trabajo o con el consentimiento expreso o tácito del principal… Así mismo el espacio físico, geográco o domicilio donde se realicen las tareas, deben estar bajo el control material o responsabilidad del empleador.';

  return (
    <>
      <View style={styles.cabecera}>
        <Image src={headerPng} style={styles.imagen} />
        <View style={styles.cabeceraTitulo}>
          <Text style={styles.cabeceraTexto}>RELEVAMIENTO GENERAL DE</Text>
          <Text style={styles.cabeceraTexto}>RIESGOS LABORALES (RGRL)</Text>
        </View>
      </View>

      <View style={styles.resolucion}>
        <Text style={styles.resolucionTitulo}>Anexo I - Resolución 463/2009</Text>
        <Text style={styles.resolucionTexto}>{anexoI}</Text>
      </View>
      <View style={styles.resolucion}>
        <Text style={styles.resolucionTitulo}>Según lo establece el art.2° de la Ley n°19.587</Text>
        <Text style={styles.resolucionTexto}>{ley19587}</Text>
      </View>

      <View style={styles.containerCabeceraForm}>
        <Text style={styles.textoCabeceraForm}>DATOS DE LA EMPRESA</Text>
      </View>
      <View>
        <Text style={styles.textoDatos}>Razón Social: {empresa.razonSocial || '—'}</Text>
        <Text style={styles.textoDatos}>CUIT: {Formato.CUIP(empresa.cuit) || '—'}</Text>
        <Text style={styles.textoDatos}>CIIU: {empresa.ciiu || '—'}</Text>
      </View>

      <View style={styles.containerCabeceraForm}>
        <Text style={styles.textoCabeceraForm}>DATOS DEL ESTABLECIMIENTO</Text>
      </View>
      <View>
        <Text style={styles.textoDatos}>Nro Establecimiento: {establecimiento.numero || '—'}</Text>
        <Text style={styles.textoDatos}>CIIU: {establecimiento.ciiu || '—'}</Text>
        <Text style={styles.textoDatos}>Dirección del Establecimiento: {establecimiento.direccion || '—'}</Text>
        <Text style={styles.textoDatos}>CP: {establecimiento.cp || '—'}</Text>
        <Text style={styles.textoDatos}>Localidad: {establecimiento.localidad || '—'}</Text>
        <Text style={styles.textoDatos}>Provincia: {establecimiento.provincia || '—'}</Text>
        <Text style={styles.textoDatos}>Superficie M2: {establecimiento.superficie ?? '—'}</Text>
        <Text style={styles.textoDatos}>Cant. Trabajadores: {establecimiento.cantTrabajadores ?? '—'}</Text>
      </View>

      <View>
        <Text style={styles.textoDatos}>Fecha SRT: {Formato.Fecha(fechaSRT) || '—'}</Text>
      </View>
    </>
  );
};

export default CabeceraFormulario;
