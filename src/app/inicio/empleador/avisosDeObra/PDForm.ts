// createForm.ts
import { 
    PDFDocument, 
    StandardFonts, 
    PDFForm, 
    PDFPage, 
    PDFCheckBox, 
    PDFFont, 
    PDFRadioGroup 
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Base64 } from "js-base64"; // Necesario para la conversión Base64 compatible con el navegador

// 🚨 Ajusta las rutas de importación según tu estructura de carpetas
import Formato from "@/utils/Formato";
import { Provincias } from "./provincias"; 
import { Provincia } from "./types";
import { PdfFormData } from "./types";

// ----------------------------------------------------
// Interfaces para funciones auxiliares (Mantenidas)
// ----------------------------------------------------
interface TextFieldParams {
    name: keyof PdfFormData | (string & {});
    formatter?: (v: any) => string;
    fontSize?: number;
    height?: number;
    lines?: number;
    borderWidth?: number;
    x: number;
    y: number;
    width: number;
}

interface CheckBoxParams {
    name: keyof PdfFormData | (string & {});
    width?: number;
    height?: number;
    trueValue?: string;
    x: number;
    y: number;
}

interface OptionParams {
    name: keyof PdfFormData | (string & {});
    value: string;
    width?: number;
    height?: number;
    x: number;
    y: number;
}


// ==========================================================
// 2. FUNCIÓN PRINCIPAL DE CREACIÓN DE PDF
// ==========================================================

export async function createForm({ data }: { data?: PdfFormData } = {}): Promise<string> {
    const url = "/Formulario_Aviso_de_Obra.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const font: PDFFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages: PDFPage[] = pdfDoc.getPages();
    let page: PDFPage = pages[0];

    const form: PDFForm = pdfDoc.getForm();

    // ----------------------------------------------------
    // Funciones Auxiliares Tipadas
    // ----------------------------------------------------

    const newTextField = ({
        name,
        formatter = (v) => ((v ?? "") === "" ? "--" : `${v}`),
        fontSize = 10,
        height = 13,
        lines = 1,
        borderWidth = 0,
        ...x
    }: TextFieldParams) => {
        const nameKey = String(name);

        const tf = form.createTextField(nameKey);
        tf.addToPage(page, {
            font: font,
            height: height * lines,
            borderWidth: borderWidth,
            ...x,
        });
        if (lines > 1) tf.enableMultiline();
        tf.setFontSize(fontSize);
        
        if (data == null) return;
        // ✅ CORRECCIÓN LÍNEA 80: Acceso directo a data[name]
        tf.setText(formatter(data[name])); 
    };

    const newDateField = ({
        formatter = (v: any) => ((v ?? "") === "" ? "--" : Formato.Fecha(v)),
        ...x
    }: Omit<TextFieldParams, 'formatter'> & { formatter?: (v: any) => string }) => 
        newTextField({ formatter: formatter, ...x });


    const newCheckBox = ({
        name,
        width = 10,
        height = 10,
        trueValue = "S",
        ...x
    }: CheckBoxParams) => {
        const nameKey = String(name);
        const cb: PDFCheckBox = form.createCheckBox(nameKey);
        cb.addToPage(page, { width: width, height: height, ...x });
        
        // ✅ CORRECCIÓN LÍNEA 109: Acceso directo a data[name]
        if (data != null && data[name] === trueValue) cb.check();
    };

    let radioGroups: { [key: string]: { group: PDFRadioGroup; options: string[] } } = {};
    
    const newOption = ({ name, value, width = 10, height = 10, ...x }: OptionParams) => {
        if (name == null || value == null) return;
        const nameKey = String(name);

        let radio = radioGroups[nameKey];
        if (radio == null) {
            radio = {
                group: form.createRadioGroup(nameKey),
                options: [],
            };
            radioGroups[name] = radio;
        }
        radio.options.push(value);
        radio.group.addOptionToPage(value, page, {
            width: width,
            height: height,
            ...x,
        });
    };
    
    const selectOption = (name: keyof PdfFormData) => {
        if (data == null) return;
        const value: any = data[name];
        if (value == null) return;
        const radio = radioGroups[name];
        if (radio == null) return;
        if (radio.options.find((r) => r === value) == null) return;
        radio.group.select(value);
    };

    // Formatter tipado para Provincias
    const provinciaFormatter = (v: any): string => {
        const pcia = (Provincias as Provincia[]).find((r) => r.Codigo === v);
        return pcia?.Descripcion ?? "--";
    };

    // ----------------------------------------------------
    // Creación de Campos (Página 1)
    // ----------------------------------------------------

    newTextField({ name: "empleadorCUIT", formatter: Formato.CUIP, x: 215, y: 725, width: 298 }); 
    newTextField({ name: "empleadorRazonSocial", x: 215, y: 710, width: 298 });

    newTextField({ name: "direccionCalleRuta", x: 215, y: 680, width: 298 });
    newTextField({ name: "direccionNumero", x: 215, y: 665, width: 298 });
    newTextField({ name: "direccionLocalidad", x: 215, y: 650, width: 298 });
    newTextField({ name: "direccionDeptoPartido", x: 215, y: 635, width: 298 });
    newTextField({
        name: "direccionPciaCodigo",
        formatter: provinciaFormatter,
        x: 215,
        y: 620,
        width: 298,
    });
    newTextField({ name: "direccionCPA", x: 215, y: 605, width: 298 });

    newOption({ name: "obraTipo", value: "A", x: 216, y: 591 });
    newOption({ name: "obraTipo", value: "S", x: 316, y: 591 });
    newOption({ name: "obraTipo", value: "E", x: 416, y: 591 });
    selectOption("obraTipo");

    newOption({ name: "obraResolucion", value: "51/97", x: 216, y: 576 });
    newOption({ name: "obraResolucion", value: "35/98", x: 316, y: 576 });
    selectOption("obraResolucion");

    newDateField({ name: "actividadInicioFecha", x: 315, y: 559, width: 198 });

    newTextField({ name: "superficie", x: 215, y: 527, width: 298 });
    newTextField({ name: "plantas", x: 215, y: 512, width: 298 });

    // Ingeniería Civil
    newCheckBox({ name: "ingCivCaminos", x: 85, y: 483 });
    newCheckBox({ name: "ingCivCalles", x: 216, y: 483 });
    newCheckBox({ name: "ingCivAutopistas", x: 301, y: 483 });
    newCheckBox({ name: "ingCivPuentes", x: 85, y: 468 });
    newCheckBox({ name: "ingCivTuneles", x: 216, y: 468 });
    newCheckBox({ name: "ingCivObrFerroviarias", x: 301, y: 468 });
    newCheckBox({ name: "ingCivObrHidraulicas", x: 85, y: 453 });
    newCheckBox({ name: "ingCivAlcantarillas", x: 216, y: 453 });
    newCheckBox({ name: "ingCivPuertos", x: 85, y: 438 });
    newCheckBox({ name: "ingCivAeropuertos", x: 216, y: 438 });
    newCheckBox({ name: "ingCivOtros", x: 301, y: 438 });

    // Arquitectura
    newCheckBox({ name: "arqViviendas", x: 85, y: 407 });
    newCheckBox({ name: "arqEdifPisosMultiples", x: 216, y: 407 });
    newCheckBox({ name: "arqEdifComerciales", x: 85, y: 392 });
    newCheckBox({ name: "arqEdifOficinas", x: 216, y: 392 });
    newCheckBox({ name: "arqHospitales", x: 85, y: 377 });
    newCheckBox({ name: "arqOtros", x: 216, y: 377 });
    newCheckBox({ name: "arqEscuelas", x: 85, y: 362 });
    newCheckBox({ name: "arqUrbanizacion", x: 216, y: 362 });

    // Montajes Industriales
    newCheckBox({ name: "monIndDestileria", x: 85, y: 332 });
    newCheckBox({ name: "monIndGenElectrica", x: 301, y: 332 });
    newCheckBox({ name: "monIndMineria", x: 85, y: 317 });
    newCheckBox({ name: "monIndManufUrbana", x: 301, y: 317 });
    newCheckBox({ name: "monIndOtros", x: 85, y: 302 });

    // Ductos y Tuberías
    newCheckBox({ name: "ductosTuberias", x: 85, y: 272 });
    newCheckBox({ name: "ductosEstaciones", x: 216, y: 272 });
    newCheckBox({ name: "ductosOtros", x: 301, y: 272 });

    // Redes
    newCheckBox({ name: "redesTransElectAV", x: 85, y: 241 });
    newCheckBox({ name: "redesComunicaciones", x: 301, y: 241 });
    newCheckBox({ name: "redesOtros", x: 85, y: 226 });
    newCheckBox({ name: "redesTransElectBV", x: 216, y: 226 });

    // Otras Construcciones
    newCheckBox({ name: "otrasConstExcavaciones", x: 85, y: 196 });
    newCheckBox({ name: "otrasConstInstHidrGas", x: 301, y: 196 });
    newCheckBox({ name: "otrasConstInstElectro", x: 85, y: 181 });
    newCheckBox({ name: "otrasConstInstAireAcon", x: 301, y: 181 });
    newCheckBox({ name: "otrasConstReparaciones", x: 85, y: 166 });
    newCheckBox({ name: "otrasConstOtros", x: 301, y: 166 });

    // ----------------------------------------------------
    // Creación de Campos (Página 2)
    // ----------------------------------------------------

    page = pages[1]; // Cambia a la segunda página

    // Actividades
    newCheckBox({ name: "actExcavacion", x: 85, y: 742 });
    newCheckBox({ name: "actDemolicion", x: 237, y: 742 });
    newCheckBox({ name: "actAlbanileria", x: 380, y: 742 });
    newCheckBox({ name: "actHA", x: 85, y: 727 });
    newCheckBox({ name: "actMontajesElectro", x: 237, y: 727 });
    newCheckBox({ name: "actInstalaciones", x: 380, y: 727 });
    newCheckBox({ name: "actEstructMetalicas", x: 85, y: 712 });
    newCheckBox({ name: "actElectricidad", x: 237, y: 712 });
    newCheckBox({ name: "actAscensores", x: 380, y: 712 });
    newCheckBox({ name: "actPintura", x: 85, y: 697 });
    newCheckBox({ name: "actMayorMilSupCubierta", x: 237, y: 697 });
    newCheckBox({ name: "actSilletas", x: 85, y: 682 });
    newCheckBox({ name: "actMediosIzaje", x: 237, y: 682 });
    newCheckBox({ name: "actAltaMediaTension", x: 85, y: 667 });
    
    // Lógica para el checkbox "Otros"
    if (data != null) {
        // Asignamos el valor temporal 'actOtrosCheck' basado en si 'actOtros' tiene contenido
        data.actOtrosCheck = (data.actOtros ?? "") === "" ? "N" : "S";
    }
    newCheckBox({ name: "actOtrosCheck", x: 85, y: 652 });
    newTextField({ name: "actOtros", x: 175, y: 626, width: 338, lines: 3 });

    // Fechas específicas
    newDateField({ name: "excavacionInicioFecha", x: 260, y: 605, width: 253 });
    newDateField({ name: "excavacionFinFecha", x: 300, y: 590, width: 213 });

    newDateField({ name: "demolicionInicioFecha", x: 260, y: 575, width: 253 });
    newDateField({ name: "demolicionFinFecha", x: 300, y: 560, width: 213 });

    newDateField({ name: "actividadFinFecha", x: 340, y: 544, width: 173 });

    newDateField({ name: "suspensionFecha", x: 250, y: 529, width: 263, });
    newDateField({ name: "reinicioFecha", x: 290, y: 514, width: 223 });

    // ----------------------------------------------------
    // Finalización
    // ----------------------------------------------------
    if (data != null) form.flatten();

    // ✅ CORRECCIÓN LÍNEA 123: Se usa pdfDoc.save() y se codifica a Base64
    const pdfBytes = await pdfDoc.save();
    
    // Convertir Uint8Array a Base64 y prefijar con data URI para uso en el navegador
    const base64String = Base64.fromUint8Array(pdfBytes);
    return `data:application/pdf;base64,${base64String}`;
}

export default createForm;