'use client';
import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';
import type { CabeceraData } from './types/impresion';
import Formato from '@/utils/Formato';
import pdfStyles from './pdfStyles';

const headerPng = '/images/Header.png';
const logoTextoPng = '/icons/LogoTexto.png';


const CabeceraFormulario: React.FC<CabeceraData> = ({ empresa, establecimiento, fechaSRT }) => {
  //Anexo y leyes
  const anexoI =
    'El presente relevamiento deberá ser completado obligatoriamente en todos sus campos por el empleador oprofesional responsable, revistiendo los datos allí consignados carácter de declaración jurada. El relevamiento deberá ser realizado para cada uno de los establecimientos que disponga la empresa. Para los empleadores cuya actividad se desarrolle en embarcaciones, las mismas serán consideradas como establecimientos.';
  const ley19587 =
    '"… los términos "establecimiento", "exploración", "centro de trabajo" o "puesto de trabajo" designan todo lugar destinado a la realización o donde se realicen tareas de cualquier índole o naturaleza con la presencia permanente, circunstancial o transitoria o eventual de personas físicas, y a los depósitos y dependencias anexas de todo tipo en que las mismas deban permanecer o a los que asistan o concurran por el hecho o en ocasión del trabajo o con el consentimiento expreso o tácito del principal… Así mismo el espacio físico, geográco o domicilio donde se realicen las tareas, deben estar bajo el control material o responsabilidad del empleador.';

  return (
    <>
      <View style={pdfStyles.logoWrapper}>
        <Image src={logoTextoPng} style={pdfStyles.logoTexto} />
      </View>
      <View style={pdfStyles.barraTitulo}>
        <Text style={pdfStyles.barraTexto}>RELEVAMIENTO GENERAL DE </Text>
        <Text style={pdfStyles.barraTexto}>RIESGOS LABORALES (RGRL)</Text>
      </View>

      {/* resto igual */}
      <View style={pdfStyles.resolucion}>
        <Text style={pdfStyles.resolucionTitulo}>Anexo I - Resolución 463/2009</Text>
        <Text style={pdfStyles.resolucionTexto}>{anexoI}</Text>
      </View>
      <View style={pdfStyles.resolucion}>
        <Text style={pdfStyles.resolucionTitulo}>Según lo establece el art.2° de la Ley n°19.587</Text>
        <Text style={pdfStyles.resolucionTexto}>{ley19587}</Text>
      </View>

      <View style={pdfStyles.containerCabeceraForm}>
        <Text style={pdfStyles.textoCabeceraForm}>DATOS DE LA EMPRESA</Text>
      </View>
      <View>
        <Text style={pdfStyles.textoDatos}>Razón Social: {empresa.razonSocial || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>CUIT: {Formato.CUIP(establecimiento.cuit) || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>CIIU: {empresa.ciiu || '—'}</Text>
      </View>

      <View style={pdfStyles.containerCabeceraForm}>
        <Text style={pdfStyles.textoCabeceraForm}>DATOS DEL ESTABLECIMIENTO</Text>
      </View>
      <View>
        <Text style={pdfStyles.textoDatos}>Nro Establecimiento: {establecimiento.numero || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>CIIU: {establecimiento.ciiu || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>Dirección del Establecimiento: {establecimiento.direccion || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>CP: {establecimiento.cp || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>Localidad: {establecimiento.localidad || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>Provincia: {establecimiento.provincia || '—'}</Text>
        <Text style={pdfStyles.textoDatos}>Superficie M2: {establecimiento.superficie ?? '—'}</Text>
        <Text style={pdfStyles.textoDatos}>Cant. Trabajadores: {establecimiento.cantTrabajadores ?? '—'}</Text>
      </View>

      <View>
        <Text style={pdfStyles.textoDatos}>Fecha SRT: {Formato.Fecha(fechaSRT) || '—'}</Text>
      </View>
    </>
  );
};

export default CabeceraFormulario;
