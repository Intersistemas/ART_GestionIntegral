import { StyleSheet } from '@react-pdf/renderer';

// Estilos compartidos para PDFs RGRL
const pdfStyles = StyleSheet.create({
  // fila: Header.png + título (igual que antes)
  cabecera: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  imagen: {
    height: 30,
    width: 125,
    marginRight: 12,
  },
  // contenedor SOLO
  cabeceraTitulo: {
    justifyContent: 'center',
  },
  cabeceraTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  barraTitulo: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 6,
    marginTop: -4,
  },
  barraTexto: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoWrapper: {
    width: '98%',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  logoTexto: {
    height: 40,
  },

  resolucion: { marginBottom: 10 },
  resolucionTitulo: { fontWeight: 'bold', fontSize: 12, marginBottom: 4 },
  resolucionTexto: { fontSize: 10, width: '95%' },
  containerCabeceraForm: { backgroundColor: '#92bd68', marginBottom: 8, width: '98%' },
  textoCabeceraForm: { color: 'white', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 4, paddingVertical: 2 },
  textoDatos: { fontSize: 10, marginBottom: 2 },
});

export default pdfStyles;
