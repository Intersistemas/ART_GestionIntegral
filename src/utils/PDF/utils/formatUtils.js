/**
 * Utilidades para formateo de datos en documentos PDF
 */

import moment from 'moment';

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {string|Date} fecha - Fecha a formatear
 * @param {string} formato - Formato deseado (por defecto DD/MM/YYYY)
 * @returns {string} - Fecha formateada o cadena vacía
 */
export const formatearFecha = (fecha, formato = 'DD/MM/YYYY') => {
  if (!fecha) return '';
  
  try {
    const fechaObj = new Date(fecha);
    
    // Verificar si es una fecha válida y no es del año 1800 (valor por defecto en algunas bases de datos)
    if (isNaN(fechaObj.getTime()) || fechaObj.getFullYear() === 1800) {
      return '';
    }
    
    return moment(fecha).format(formato);
  } catch (error) {
    console.warn('Error al formatear fecha:', fecha, error);
    return '';
  }
};

/**
 * Formatea una fecha y hora
 * @param {string|Date} fechaHora - Fecha y hora a formatear
 * @returns {string} - Fecha y hora formateada
 */
export const formatearFechaHora = (fechaHora) => {
  return formatearFecha(fechaHora, 'DD/MM/YYYY HH:mm');
};

/**
 * Formatea un número con separadores de miles
 * @param {number} numero - Número a formatear
 * @param {number} decimales - Cantidad de decimales (por defecto 2)
 * @returns {string} - Número formateado
 */
export const formatearNumero = (numero, decimales = 2) => {
  if (numero === null || numero === undefined || isNaN(numero)) {
    return '0';
  }
  
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  }).format(numero);
};

/**
 * Formatea un número como moneda
 * @param {number} monto - Monto a formatear
 * @param {string} moneda - Código de moneda (por defecto ARS)
 * @returns {string} - Monto formateado como moneda
 */
export const formatearMoneda = (monto, moneda = 'ARS') => {
  if (monto === null || monto === undefined || isNaN(monto)) {
    return '$0,00';
  }
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda
  }).format(monto);
};

/**
 * Trunca un texto si excede la longitud máxima
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} sufijo - Sufijo para agregar cuando se trunca (por defecto '...')
 * @returns {string} - Texto truncado
 */
export const truncarTexto = (texto, maxLength = 50, sufijo = '...') => {
  if (!texto) return '';
  
  if (texto.length <= maxLength) {
    return texto;
  }
  
  return texto.substring(0, maxLength - sufijo.length) + sufijo;
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
export const capitalizarTexto = (texto) => {
  if (!texto) return '';
  
  return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Formatea un CUIT/CUIL con guiones
 * @param {string} cuit - CUIT/CUIL sin formato
 * @returns {string} - CUIT/CUIL formateado (XX-XXXXXXXX-X)
 */
export const formatearCUIT = (cuit) => {
  if (!cuit) return '';
  
  // Remover cualquier carácter que no sea número
  const soloNumeros = cuit.toString().replace(/\D/g, '');
  
  if (soloNumeros.length !== 11) {
    return cuit; // Retornar sin formato si no tiene 11 dígitos
  }
  
  return `${soloNumeros.substring(0, 2)}-${soloNumeros.substring(2, 10)}-${soloNumeros.substring(10)}`;
};

/**
 * Formatea un DNI con puntos
 * @param {string|number} dni - DNI sin formato
 * @returns {string} - DNI formateado (XX.XXX.XXX)
 */
export const formatearDNI = (dni) => {
  if (!dni) return '';
  
  const soloNumeros = dni.toString().replace(/\D/g, '');
  
  if (soloNumeros.length < 7 || soloNumeros.length > 8) {
    return dni; // Retornar sin formato si no tiene 7-8 dígitos
  }
  
  return soloNumeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Maneja valores nulos o indefinidos para mostrar en PDF
 * @param {any} valor - Valor a verificar
 * @param {string} valorPorDefecto - Valor por defecto si es null/undefined
 * @returns {string} - Valor formateado para mostrar
 */
export const manejarValorNulo = (valor, valorPorDefecto = 'N/A') => {
  if (valor === null || valor === undefined || valor === '') {
    return valorPorDefecto;
  }
  return valor.toString();
};

/**
 * Formatea un booleano para mostrar en PDF
 * @param {boolean} valor - Valor booleano
 * @param {string} textoVerdadero - Texto para true (por defecto 'Sí')
 * @param {string} textoFalso - Texto para false (por defecto 'No')
 * @returns {string} - Texto formateado
 */
export const formatearBooleano = (valor, textoVerdadero = 'Sí', textoFalso = 'No') => {
  if (valor === null || valor === undefined) {
    return 'N/A';
  }
  return valor ? textoVerdadero : textoFalso;
};

// Exportación por defecto con todas las funciones
export default {
  formatearFecha,
  formatearFechaHora,
  formatearNumero,
  formatearMoneda,
  truncarTexto,
  capitalizarTexto,
  formatearCUIT,
  formatearDNI,
  manejarValorNulo,
  formatearBooleano
};