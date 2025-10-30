import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

// Tipos base de Day.js para referencia
type FormatType = "date" | "time" | "datetime" | string;

/**
 * Formatea una cadena ISO a fecha/hora usando Day.js.
 * @param isoString Cadena de fecha ISO.
 * @param type Tipo de formato o un string de formato Day.js personalizado (ej: 'DD/MM/YYYY').
 */
export function FechaHora(isoString: any, type: any = "datetime"): string {
    if (isoString == null) return "";

    let date;
    const s = `${isoString}`;

    // 1. Detección y parsing especial para cadenas YYYY-MM (Ej: "2021-11")
    if (/^\d{4}-\d{2}$/.test(s)) {
        // Usamos dayjs sin .utc() inicialmente, especificando el formato 'YYYY-MM'
        // Esto le dice a Day.js: "La cadena es YYYY-MM, porséala como tal."
        date = dayjs(s, "YYYY-MM"); 
		
    } else if (/^\d{6}$/.test(s)) {
        // Indica a Day.js que la cadena de 6 dígitos es YYYYMM
        date = dayjs(s, "YYYYMM"); 
    } else {
        // 2. Para el resto de formatos (ISO completos, Date objects, etc.), usamos el método original (con UTC)
        date = dayjs.utc(s);
    }
    
    if (!date.isValid()) return "";

    let formatString = "";
    // Aseguramos que la fecha esté en la zona horaria local antes de aplicar el formato
    const localDate = date.local();

    // Mapeo simple de tus tipos existentes a tokens de Day.js
    const lowerType = typeof type === "string" ? type.toLowerCase() : "";

    switch (lowerType) {
        case "date":
            formatString = "DD/MM/YYYY"; // Formato de fecha estándar
            break;
        case "time":
            formatString = "HH:mm:ss"; // Formato de hora estándar
            break;
        case "datetime":
            formatString = "DD/MM/YYYY HH:mm:ss"; // Formato completo
            break;
        default:
            // Permite pasar un string de formato Day.js personalizado
            formatString = type;
            break;
    }

    return localDate.format(formatString);
}

export function Mascara(numero: any, patron: string) {
	let r = "";
	if (!numero) return r;
	let s = `${numero}`;
	if (!patron) return s;
	let p = `${patron}`;
	if (s.length > (p.match(/#/g) || []).length) return patron;
	for (let px = p.length - 1, sx = s.length - 1; px > -1; px--) {
		let d = p[px];
		if (d === "#") {
			if (sx > -1) d = s[sx--];
			else d = "0";
		}
		r = `${d}${r}`;
	}
	return r;
}

export function Numero(numero: number | string | null | undefined): string {
    if (numero == null) return "";
    // Aseguramos que el argumento de format sea un número
    const numValue = typeof numero === 'string' ? parseFloat(numero) : numero; 
    if (isNaN(numValue)) return "";
    
    return Intl.NumberFormat("es-AR").format(numValue);
}

export function Porcentaje(numero: any) {
	if (numero == null) return "";
	return Intl.NumberFormat("es-AR", {
		style: "percent",
		maximumFractionDigits: 6,
	}).format(numero);
}

export function Unidad(numero: any, unidad?: string | undefined, display: "short" | "long" | "narrow" | undefined = "short") {
	if (numero == null) return "";
	return Intl.NumberFormat("es-AR", {
		style: "unit",
		unit: unidad,
		unitDisplay: display,
	}).format(numero);
}

export function Moneda(numero: number | string | null | undefined, codigo = "ARS"): string {
    if (numero == null) return "";
    const numValue = typeof numero === 'string' ? parseFloat(numero) : numero; 
    if (isNaN(numValue)) return "";

    return Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: codigo,
    }).format(numValue);
}

export function Booleano(valor: any) {
	if (valor == null) return "";
	if (valor) return "Si";
	return "No";
}


/**
 * Formatea una cadena ISO a fecha.
 * @param isoString Cadena de fecha ISO.
 * @param format Opcional. Puede ser un token de formato Day.js personalizado (ej: 'D/M/YY').
 */
export function Fecha(isoString: any, format: string = "DD/MM/YYYY"): string {
    if (isoString == null) return "";

        // Día, Mes y Año (Default)
    return FechaHora(isoString, format);
}

export function Hora(isoString: any): string {
    return FechaHora(isoString, "time"); 
}

export function Periodo(numero: any): string {
    return Mascara(numero, "####-##"); 
}

export function PeriodoMA(numero: any): string {
    return Mascara(numero, "##-####"); 
}

export function CUIP(numero: any) {
	return Mascara(numero, "##-##.###.###-#");
}

export function DNI(numero: any) {
	return Mascara(numero, "##.###.###");
}

export function Entero(numero: any) {
	if (numero == null || numero === "") return numero;
	numero = `${numero}`;
	let r = parseInt(numero);
	if (isNaN(r)) return Entero(numero.slice(0, numero.length - 2));
	return r;
}

export function Decimal(numero: any) {
	if (numero == null || numero === "") return numero;
	numero = `${numero}`;
	let r = parseFloat(numero);
	if (isNaN(r)) return Decimal(numero.slice(0, numero.length - 2));
	return r;
}

class _Formato {
	Mascara = Mascara;
	Numero = Numero;
	Porcentaje = Porcentaje;
	Unidad = Unidad;
	Moneda = Moneda;
	Booleano = Booleano;
	Fecha = Fecha;
	Hora = Hora;
	FechaHora = FechaHora;
	Periodo = Periodo;
	PeriodoMA = PeriodoMA;
	CUIP = CUIP;
	Entero = Entero;
	Decimal = Decimal;
	DNI = DNI;
}

const Formato = new _Formato();

export default Formato;