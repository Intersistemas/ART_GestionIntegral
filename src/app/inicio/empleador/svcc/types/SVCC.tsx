export type TContratacion = [
	{ interno: 1, descripcion: "PROPIO" },
	{ interno: 2, descripcion: "CONTRATADO" },
	{ interno: 3, descripcion: "NO INFORMA" },
];

export type TRepresentacion = [
	{ codigo: 1, descripcion: "REPRESENTANTE LEGAL" },
	{ codigo: 2, descripcion: "PRESIDENTE" },
	{ codigo: 3, descripcion: "DIRECTOR GENERAL" },
	{ codigo: 4, descripcion: "ADMINISTRADOR GENERAL" },
	{ codigo: 5, descripcion: "VICEPRESIDENTE" },
	{ codigo: 6, descripcion: "GERENTE GENERAL" },
	{ codigo: 99, descripcion: "OTROS" },
];

export type TTipoProfesionalResponsable = [
	{ interno: 1, descripcion: "Servicio de Higiene y Seguridad Laboral" },
	{ interno: 2, descripcion: "Servicio de Medicina del Trabajo" },
	{ interno: 3, descripcion: "Responsable de Datos" },
];

export type TSustancias = [
	{
		codigo: 1,
		descripcion:
			"Asbestos (en todas sus formas, incluyendo Actinolita, Amosita,  antofilita, crisotilo, crocidolita, tremolita) y las sustancias minerales (ej, talco o vermiculita) que contengan asbesto, también deben considerarse carcinógenas para los seres humanos",
		codigoesop: 40031,
	},
	{ codigo: 2, descripcion: "Berilio y sus compuestos", codigoesop: 40035 },
	{ codigo: 3, descripcion: "Benceno", codigoesop: 40036 },
	{ codigo: 4, descripcion: "Bifenilos policlorados", codigoesop: 40043 },
	{ codigo: 5, descripcion: "Cadmio y sus compuestos", codigoesop: 40044 },
	{
		codigo: 6,
		descripcion: "Bis(clorometil)eter; clorometil metil eter (grado técnico)",
		codigoesop: 40054,
	},
	{ codigo: 7, descripcion: "Cloruro de vinilo", codigoesop: 40058 },
	{ codigo: 8, descripcion: "1,2-Dicloropropano", codigoesop: 40071 },
	{ codigo: 9, descripcion: "Formaldehido", codigoesop: 40092 },
	{ codigo: 10, descripcion: "Producción de coque", codigoesop: 40096 },
	{ codigo: 11, descripcion: "Lindano", codigoesop: 40112 },
	{ codigo: 12, descripcion: "Compuestos  de níquel", codigoesop: 40130 },
	{ codigo: 13, descripcion: "Óxido de etileno", codigoesop: 40136 },
	{ codigo: 14, descripcion: "Pentaclorofenol", codigoesop: 40142 },
	{
		codigo: 15,
		descripcion:
			"Polvo de sílice cristalina, en forma de cuarzo o cristobalita",
		codigoesop: 40153,
	},
	{ codigo: 16, descripcion: "Orto-Toluidina", codigoesop: 40170 },
	{ codigo: 17, descripcion: "Tricloroetileno", codigoesop: 40173 },
	{
		codigo: 18,
		descripcion: "Aceites minerales no tratados o medianamente tratados",
		codigoesop: 40201,
	},
	{
		codigo: 19,
		descripcion: "Fabricación de Alcohol Isopropílico usando ácidos fuertes",
		codigoesop: 40202,
	},
	{ codigo: 20, descripcion: "Alquitrán de hulla", codigoesop: 40203 },
	{ codigo: 21, descripcion: "4-Aminobifenilo", codigoesop: 40204 },
	{ codigo: 22, descripcion: "Producción de auramina", codigoesop: 40206 },
	{ codigo: 23, descripcion: "Bencidina", codigoesop: 40207 },
	{ codigo: 24, descripcion: "Compuestos de cromo (VI)", codigoesop: 40208 },
	{ codigo: 25, descripcion: "Gas Mostaza", codigoesop: 40210 },
	{
		codigo: 26,
		descripcion: "Minería subterránea de la hematita",
		codigoesop: 40211,
	},
	{
		codigo: 27,
		descripcion:
			"Hollín (como se encuentra en la exposición ocupacional en el barrido de chimeneas)",
		codigoesop: 40212,
	},
	{ codigo: 28, descripcion: "Producción de magenta", codigoesop: 40213 },
	{ codigo: 29, descripcion: "2-Naftilamina", codigoesop: 40214 },
	{
		codigo: 30,
		descripcion: "Radón-222 y sus productos de decaimiento",
		codigoesop: 40216,
	},
	{
		codigo: 31,
		descripcion: "Exposición ocupacional asociada al Proceso Acheson",
		codigoesop: 40220,
	},
	{ codigo: 32, descripcion: "1,3-Butadieno", codigoesop: 40221 },
	{
		codigo: 33,
		descripcion: "2,3,4,7,8-Pentaclorodibenzofurano",
		codigoesop: 40222,
	},
	{
		codigo: 34,
		descripcion: "2,3,7,8-Tetraclorodibenzo-p-dioxina",
		codigoesop: 40223,
	},
	{
		codigo: 35,
		descripcion: "3,4,5,3 ?,4 ?-Pentaclorobifenilo (PCB-126)",
		codigoesop: 40224,
	},
	{
		codigo: 36,
		descripcion: "4,4 ?-Metilenbis(2-cloroanilina) (MOCA)",
		codigoesop: 40225,
	},
	{
		codigo: 37,
		descripcion: "Arsénico y sus compuestos inorgánicos",
		codigoesop: 40226,
	},
	{ codigo: 38, descripcion: "Azatioprina", codigoesop: 40227 },
	{ codigo: 39, descripcion: "Benzo [a] Pireno", codigoesop: 40228 },
	{
		codigo: 40,
		descripcion:
			"Bifenilos Policlorados, como dioxina, con un Factor de Toxicidad Equivalente (TEF) de acuerdo con la OMS (PCB 77, 81, 105, 115, 118, 123, 126, 157, 167, 169, 189)",
		codigoesop: 40229,
	},
	{ codigo: 41, descripcion: "Busulfan", codigoesop: 40230 },
	{ codigo: 42, descripcion: "Ciclofosfamida", codigoesop: 40231 },
	{ codigo: 43, descripcion: "Ciclosporina", codigoesop: 40232 },
	{ codigo: 44, descripcion: "Clorambucil", codigoesop: 40233 },
	{
		codigo: 45,
		descripcion: "Colorantes que se metabolizan a Bencidina",
		codigoesop: 40234,
	},
	{
		codigo: 46,
		descripcion: "Destilación de alquitran de hulla",
		codigoesop: 40235,
	},
	{ codigo: 47, descripcion: "Erionita", codigoesop: 40236 },
	{ codigo: 48, descripcion: "Etopósido", codigoesop: 40237 },
	{
		codigo: 49,
		descripcion: "Etopósido en combinación con cisplatino y bleomicina",
		codigoesop: 40238,
	},
	{
		codigo: 50,
		descripcion: "Fibras anfíboles de fluoro-edenita",
		codigoesop: 40239,
	},
	{ codigo: 51, descripcion: "Fósforo-32, como fosfato", codigoesop: 40240 },
	{ codigo: 52, descripcion: "Gasificación del carbón", codigoesop: 40241 },
	{ codigo: 53, descripcion: "Humo de tabaco, ajeno", codigoesop: 40242 },
	{
		codigo: 54,
		descripcion: "Iodos radiactivos, incluido el Iodo-131",
		codigoesop: 40243,
	},
	{ codigo: 55, descripcion: "Melfalán", codigoesop: 40244 },
	{
		codigo: 56,
		descripcion: "Nieblas de ácidos inorgánicos fuertes",
		codigoesop: 40245,
	},
	{
		codigo: 57,
		descripcion:
			"N-Nitrosonornicotina (NNN) y 4-(N-Nitrosometilamina)-1-(3-piridil)-1-butanona (NNK)",
		codigoesop: 40246,
	},
	{ codigo: 58, descripcion: "Plutonio", codigoesop: 40247 },
	{
		codigo: 59,
		descripcion: "Productos de fisión, incluido el Estroncio-90",
		codigoesop: 40248,
	},
	{
		codigo: 60,
		descripcion: "Radio-224 y sus productos de decaimiento",
		codigoesop: 40249,
	},
	{
		codigo: 61,
		descripcion: "Radio-226 y sus productos de decaimiento",
		codigoesop: 40250,
	},
	{
		codigo: 62,
		descripcion: "Radio-228 y sus productos de decaimiento",
		codigoesop: 40251,
	},
	{
		codigo: 63,
		descripcion:
			"Radionucleidos, emisores de partículas Alfa, internamente depositados",
		codigoesop: 40252,
	},
	{
		codigo: 64,
		descripcion:
			"Radionucleidos, emisores de partículas Beta, internamente depositados",
		codigoesop: 40253,
	},
	{
		codigo: 65,
		descripcion: "Torio-232 y sus productos de decaimiento",
		codigoesop: 40254,
	},
	{ codigo: 66, descripcion: "Aflatoxinas", codigoesop: 40255 },
	{
		codigo: 67,
		descripcion: "Virus de la Hepatitis B (infección crónica)",
		codigoesop: 60021,
	},
	{
		codigo: 68,
		descripcion: "Virus de la Hepatitis C (infección crónica)",
		codigoesop: 60022,
	},
	{ codigo: 69, descripcion: "Radiaciones ionizantes", codigoesop: 90002 },
	{
		codigo: 70,
		descripcion:
			"Radiación ultravioleta (longitudes de onda 100-400 nm abarcando las radiaciones UVA, UVB y UVC)",
		codigoesop: 90004,
	},
	{ codigo: 71, descripcion: "Radiación neutrónica", codigoesop: 90010 },
	{ codigo: 72, descripcion: "Rayos X y Radiación Gamma", codigoesop: 90011 },
];

export type TUnidadesMedidas = [
	{ interno: 1, descripcion: "gm" },
	{ interno: 2, descripcion: "Ton" },
	{ interno: 3, descripcion: "kg" },
	{ interno: 4, descripcion: "m3" },
	{ interno: 5, descripcion: "lt" },
	{ interno: 6, descripcion: "cm3" },
	{ interno: 7, descripcion: "Otros" },
];

export type TUsoOrigen = [
	{ codigo: 1, descripcion: "Comercialización" },
	{ codigo: 2, descripcion: "Aditivo" },
	{ codigo: 3, descripcion: "Desinfectante" },
	{ codigo: 4, descripcion: "Disolvente" },
	{ codigo: 5, descripcion: "Pigmento" },
	{ codigo: 6, descripcion: "Plastificante" },
	{ codigo: 7, descripcion: "Componente de Equipo Industrial" },
	{ codigo: 8, descripcion: "Componente de Equipo Médico" },
	{ codigo: 9, descripcion: "Ambiental" },
	{ codigo: 10, descripcion: "Originado en el Proceso Industrial" },
	{ codigo: 11, descripcion: "Uso Médico" },
	{ codigo: 12, descripcion: "Uso Farmacéutico" },
	{ codigo: 13, descripcion: "Uso Terapéutico" },
	{ codigo: 14, descripcion: "Uso Veterinario" },
	{ codigo: 15, descripcion: "Uso forense" },
	{ codigo: 16, descripcion: "Uso en Seguridad" },
	{ codigo: 17, descripcion: "Uso Investigación" },
	{ codigo: 18, descripcion: "Docencia" },
	{ codigo: 19, descripcion: "Energía Nuclear" },
	{ codigo: 20, descripcion: "Otros" },
];

export type TModoEmpleo = [
	{ codigo: 1, descripcion: "Otros" },
	{ codigo: 2, descripcion: "Materia Prima" },
	{ codigo: 3, descripcion: "Producto intermedio" },
	{ codigo: 4, descripcion: "Producto Final" },
	{ codigo: 5, descripcion: "Almacenamiento" },
	{ codigo: 6, descripcion: "Medicamento" },
	{ codigo: 7, descripcion: "Comercialización" },
	{ codigo: 8, descripcion: "Fraccionamiento" },
	{ codigo: 9, descripcion: "Tratamiento / Diagnóstico" },
	{ codigo: 10, descripcion: "Desecho de producción" },
	{ codigo: 11, descripcion: "Pericial" },
	{ codigo: 12, descripcion: "Tratamiento" },
	{ codigo: 13, descripcion: "Diagnóstico" },
	{ codigo: 14, descripcion: "Mediciones" },
	{ codigo: 15, descripcion: "Control de Seguridad" },
	{ codigo: 16, descripcion: "Mantenimiento" },
	{ codigo: 17, descripcion: "Ventas" },
	{ codigo: 18, descripcion: "Aeronavegación" },
	{ codigo: 19, descripcion: "Minería" },
];

export type TMedidasPreventivas = [
	{
		codigo: 1,
		descripcion:
			"Política Documentada del Sistema de Gestión de Seguridad, Prevención y Salud Ocupacional",
	},
	{
		codigo: 2,
		descripcion:
			"Existencia del Servicio de Higiene y Seguridad del Trabajo y registros respectivos",
	},
	{
		codigo: 3,
		descripcion:
			"Existencia del Servicio de Medicina Laboral y registros respectivos",
	},
	{
		codigo: 4,
		descripcion: "Relevamiento General de Riesgos Laborales actualizado",
	},
	{
		codigo: 5,
		descripcion:
			"Documental actualizada de Análisis de Riesgos por puesto de trabajo con medidas preventivas. Normas de procedimiento de trabajo",
	},
	{
		codigo: 6,
		descripcion:
			"Nómina  de trabajadores expuestos a cada uno de los agentes de riesgo (N.T.E.), actualizada",
	},
	{ codigo: 7, descripcion: "Programa de Seguridad para las Obras Activas" },
];

export type TElementosProteccionPersonal = [
	{ interno: 1, descripcion: "Gafas Plomadas" },
	{ interno: 2, descripcion: "Delantal Plomado" },
	{ interno: 3, descripcion: "Polainas" },
	{ interno: 4, descripcion: "Filtro Protección Solar" },
	{ interno: 5, descripcion: "Lentes con protección UV" },
	{ interno: 6, descripcion: "Arnés con cabo de vida" },
	{ interno: 7, descripcion: "Calzado de seguridad" },
	{ interno: 8, descripcion: "Casco" },
	{ interno: 9, descripcion: "Equipo de respiración autónoma" },
	{ interno: 10, descripcion: "Guantes" },
	{ interno: 11, descripcion: "Protección Auditiva" },
	{ interno: 12, descripcion: "Protección Facial" },
	{ interno: 13, descripcion: "Protección Respiratoria" },
	{ interno: 14, descripcion: "Protección Visual" },
	{ interno: 15, descripcion: "Ropa de trabajo" },
	{ interno: 16, descripcion: "Gorro con ala" },
	{ interno: 17, descripcion: "Casco con protección para el cuello" },
	{ interno: 18, descripcion: "Otros" },
	{ interno: 19, descripcion: "No Aplica" },
];

export type TTiposEquipos = [
	{ interno: 1, descripcion: "Otros" },
	{ interno: 2, descripcion: "Gammagrafía" },
	{ interno: 3, descripcion: "Radiología" },
	{ interno: 4, descripcion: "Fluoroscopio" },
	{ interno: 5, descripcion: "Angiografía" },
	{ interno: 6, descripcion: "Radioterapia" },
	{ interno: 7, descripcion: "Acelerador lineal" },
];

export type TCaracteristicasEquipos = [
	{ codigo: 1, descripcion: "Text para pruebas" },
	{ codigo: 2, descripcion: "Fijo" },
	{ codigo: 3, descripcion: "Móvil" },
	{ codigo: 4, descripcion: "Portátil" },
];

export type TTiposRadiaciones = [
	{ interno: 1, descripcion: "Otros" },
	{ interno: 2, descripcion: "Alfa" },
	{ interno: 3, descripcion: "Beta" },
	{ interno: 4, descripcion: "Gamma" },
	{ interno: 5, descripcion: "Rayos X" },
	{ interno: 6, descripcion: "Neutrones" },
	{ interno: 7, descripcion: "Radiación Ionizante ó NORM" },
	{ interno: 8, descripcion: "Radiación Ionizante - Cósmica" },
];

export type TTiposFuentesEquipos = [
	{ codigo: 1, descripcion: "Sellada" },
	{ codigo: 2, descripcion: "No Sellada" },
];

export type TMetodosProcesadosImagenes = [
	{ codigo: 1, descripcion: "Digital" },
	{ codigo: 2, descripcion: "Manual" },
	{ codigo: 3, descripcion: "Automático" },
	{ codigo: 5, descripcion: "No aplica" },
];

export type TFrecuencia = [
	{ codigo: 1, descripcion: "Anual" },
	{ codigo: 2, descripcion: "Diaria" },
	{ codigo: 3, descripcion: "Semanal" },
	{ codigo: 4, descripcion: "Mensual" },
	{ codigo: 5, descripcion: "Trimestral" },
	{ codigo: 6, descripcion: "Semestral" },
	{ codigo: 7, descripcion: "Bianual" },
];

export type ExamenMedico = [
	{ codigo: 0, descripcion: "Preocupacional" },
	{ codigo: 1, descripcion: "Periódico" },
	{ codigo: 2, descripcion: "Previo a cada tarea" },
	{ codigo: 3, descripcion: "Ausencia prolongada" },
	{ codigo: 4, descripcion: "Egreso" },
];

///// Tipos de dosimetría a confirmar
export type TiposDosimetria = [
	{ codigo: 1, descripcion: "Personal"},
	{ codigo: 2, descripcion: "Ambiental"},
	{ codigo: 3, descripcion: "De área"},
];

///// Metodos de dosimetría a confirmar
export type MetodosDosimetria = [
	{ codigo: 1, descripcion: "Film"},
	{ codigo: 2, descripcion: "Termoluminiscencia (TLD)"},
	{ codigo: 3, descripcion: "Luminiscencia ópticamente estimulada (OSL)"},
];
