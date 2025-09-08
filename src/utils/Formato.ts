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

export function Numero(numero: any) {
	if (numero == null) return "";
	return Intl.NumberFormat("es-AR").format(numero);
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

export function Moneda(numero: any, codigo = "ARS") {
	if (numero == null) return "";
	return Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: codigo,
	}).format(numero);
}

export function Booleano(valor: any) {
	if (valor == null) return "";
	if (valor) return "Si";
	return "No";
}

export function Fecha(isoString: any) {
	return FechaHora(isoString, "date");
}

export function Hora(isoString: any) {
	return FechaHora(isoString, "time");
}

export function FechaHora(isoString: any, type: any = "datetime") {
	if (isoString == null) return "";
	let ms = Date.parse(isoString);
	if (isNaN(ms)) return "";

	const options: Intl.DateTimeFormatOptions = typeof type === "object" ? type : {};
	if (typeof type === "string") {
		type = type?.toLowerCase();
		if (["date", "datetime"].includes(type)) {
			options.day = "2-digit";
			options.month = "2-digit";
			options.year = "numeric";
		}
		if (["time", "datetime"].includes(type)) {
			options.hour = "2-digit";
			options.minute = "2-digit";
			options.second = "2-digit";
		}
	}
	options.timeZone ??= "UTC"
	return Intl.DateTimeFormat("es-AR", options).format(new Date(ms));
}

export function Periodo(numero: any) {
	return Mascara(numero, "####-##");
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
	CUIP = CUIP;
	Entero = Entero;
	Decimal = Decimal;
	DNI = DNI;
}

const Formato = new _Formato();

export default Formato;