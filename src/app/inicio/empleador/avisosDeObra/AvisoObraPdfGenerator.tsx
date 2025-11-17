// src/app/inicio/empleador/avisosDeObra/AvisoObraPdfGenerator.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import styles from "./AvisoObraPdfGenerator.module.css";

import { Provincias } from "./data/provincias";
import { AvisosObraTipos } from "./data/avisosObraTipos";
import Formato from "@/utils/Formato";
import { AvisoObraRecord } from "./types/types";
import CustomButton from "@/utils/ui/button/CustomButton";
import { getDefaultAvisoObra } from "./data/defaultAvisoObra";


const Field: React.FC<{ label: string; value: any; large?: boolean }> = ({ label, value, large = false }) => (
  <div className={`${styles.fieldWrapper} ${large ? styles.fieldLarge : ""}`}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={styles.fieldValue}>{value ?? "--"}</span>
  </div>
);

const CheckboxItem = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className={styles.checkboxItem}>
    <div className={`${styles.checkboxBox} ${checked ? styles.checkboxChecked : ""}`}>
      {checked && <span className={styles.checkboxTick}>&#x2713;</span>}
    </div>
    <span className={styles.checkboxLabel}>{label}</span>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className={styles.sectionTitle}>{title}</div>
);

const PX_PER_MM = 96 / 25.4;

const generatePdfFromHtml = async (
  elementRef: React.RefObject<HTMLElement | null>,
  filename: string,
  setIsGenerating: (v: boolean) => void
) => {
  if (!elementRef.current) return;
  setIsGenerating(true);

  try {
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setProperties({ title: filename });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const marginMM = 8;

    const A4_PX_W = Math.round(210 * PX_PER_MM);
    const A4_PX_H = Math.round(297 * PX_PER_MM);

    const root = elementRef.current;
    const pages = Array.from(root.children) as HTMLElement[];

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];

      pageEl.style.width = `${A4_PX_W}px`;
      pageEl.style.height = `${A4_PX_H}px`;
      pageEl.style.background = "#ffffff";

      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgWmm = canvas.width / PX_PER_MM;
      const imgHmm = canvas.height / PX_PER_MM;

      if (i > 0) pdf.addPage();

      const availableW = pdfW - marginMM * 2;
      const availableH = pdfH - marginMM * 2;
      const scale = Math.min(availableW / imgWmm, availableH / imgHmm);

      const drawW = imgWmm * scale;
      const drawH = imgHmm * scale;
      const x = (pdfW - drawW) / 2;
      const y = marginMM;

      pdf.addImage(
        canvas.toDataURL("image/png", 1.0),
        "PNG",
        x,
        y,
        drawW,
        drawH,
        undefined,
        "FAST"
      );
    }

    pdf.save(filename);
  } catch (err) {
    console.error("Error generando PDF:", err);
  } finally {
    setIsGenerating(false);
  }
};

interface Props {
  data?: Partial<AvisoObraRecord>;
}

const AvisosObraPdfGenerator: React.FC<Props> = ({ data: incomingData = {} }) => {

  const data = useMemo(
    () => getDefaultAvisoObra(incomingData),
    [incomingData]
  );

  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const provinciaDesc = useMemo(
    () => Provincias.find((r) => r.Codigo === data.direccionPciaCodigo)?.Descripcion ?? "",
    [data.direccionPciaCodigo]
  );

  const obraTipoDesc = useMemo(
    () => AvisosObraTipos.find((r) => r.Codigo === data.obraTipo)?.Descripcion ?? "",
    [data.obraTipo]
  );

  const check = (v: any) => v === "S";

  const handleGenerate = useCallback(() => {
    generatePdfFromHtml(pdfRef, "AvisoDeObra.pdf", setIsGenerating);
  }, []);

  return (
    <div className={styles.screenContainer}>
      <div className={styles.buttonContainer}>
        <CustomButton onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "GENERANDO PDF..." : "DESCARGAR PDF"}
        </CustomButton>
      </div>

      <div ref={pdfRef} className={styles.pdfRoot}>

        {/* ------------------------------------------------ PAGE 1 ------------------------------------------------ */}
        <div className={styles.page}>
          <div className={styles.title}>AVISO DE OBRA</div>
          <div className={styles.line} />

          <SectionTitle title="Datos del Empleador" />
          <div className={styles.grid2}>
            <Field label="CUIT del Empleador" value={Formato.CUIP(data.empleadorCUIT)} />
            <Field label="Razón Social" value={data.empleadorRazonSocial} />
          </div>

          <SectionTitle title="Ubicación de la Obra" />
          <div className={styles.grid2}>
            <Field label="Calle / Ruta" value={data.direccionCalleRuta} />
            <Field label="Número / KM" value={data.direccionNumero} />
            <Field label="Localidad" value={data.direccionLocalidad} />
            <Field label="Depto. / Partido" value={data.direccionDeptoPartido} />
            <Field label="Provincia" value={provinciaDesc} />
            <Field label="Código Postal Argentino (CPA)" value={data.direccionCPA} />
          </div>

          <SectionTitle title="Tipo de Aviso y Actividad General" />
          <div className={styles.grid4}>
            <Field label="Tipo de Aviso" value={obraTipoDesc} />

            <div className={styles.resolContainer}>
              <div className={styles.fieldLabel}>Resolución Aplicable</div>
              <div className={styles.resolChecks}>
                <CheckboxItem label="51/97" checked={data.obraResolucion === "51/97"} />
                <CheckboxItem label="35/98" checked={data.obraResolucion === "35/98"} />
              </div>
            </div>

            <div className={styles.grid2}>
              <Field label="Superficie Cubierta (m²)" value={data.superficie} />
              <Field label="Número de Plantas" value={data.plantas} />
            </div>

            <Field
              label="Fecha Declaración de Inicio de Actividad de Obra"
              value={Formato.Fecha(data.actividadInicioFecha)}
            />
          </div>

          <SectionTitle title="Descripción de la Obra" />

          <div className={styles.block}>
            <div className={styles.blockTitle}>INGENIERÍA CIVIL</div>
            <div className={styles.grid3}>
              <CheckboxItem label="Caminos" checked={check(data.ingCivCaminos)} />
              <CheckboxItem label="Calles" checked={check(data.ingCivCalles)} />
              <CheckboxItem label="Autopistas" checked={check(data.ingCivAutopistas)} />
              <CheckboxItem label="Puentes" checked={check(data.ingCivPuentes)} />
              <CheckboxItem label="Túneles" checked={check(data.ingCivTuneles)} />
              <CheckboxItem label="Obras Ferroviarias" checked={check(data.ingCivObrFerroviarias)} />
              <CheckboxItem label="Obras Hidráulicas" checked={check(data.ingCivObrHidraulicas)} />
              <CheckboxItem label="Alcantarillas" checked={check(data.ingCivAlcantarillas)} />
              <CheckboxItem label="Puertos" checked={check(data.ingCivPuertos)} />
              <CheckboxItem label="Aeropuertos" checked={check(data.ingCivAeropuertos)} />
              <CheckboxItem label="Otros de Ingeniería Civil" checked={check(data.ingCivOtros)} />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.block}>
              <div className={styles.blockTitle}>ARQUITECTURA</div>
              <div className={styles.grid2}>
                <CheckboxItem label="Viviendas" checked={check(data.arqViviendas)} />
                <CheckboxItem label="Edif. Pisos Múltiples" checked={check(data.arqEdifPisosMultiples)} />
                <CheckboxItem label="Urbanización" checked={check(data.arqUrbanizacion)} />
                <CheckboxItem label="Edif. Comerciales" checked={check(data.arqEdifComerciales)} />
                <CheckboxItem label="Edif. Oficinas" checked={check(data.arqEdifOficinas)} />
                <CheckboxItem label="Escuelas" checked={check(data.arqEscuelas)} />
                <CheckboxItem label="Hospitales" checked={check(data.arqHospitales)} />
                <CheckboxItem label="Otros de Arquitectura" checked={check(data.arqOtros)} />
              </div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>MONTAJES INDUSTRIALES</div>
              <div className={styles.grid2}>
                <CheckboxItem label="Destilería" checked={check(data.monIndDestileria)} />
                <CheckboxItem label="Generación Eléctrica" checked={check(data.monIndGenElectrica)} />
                <CheckboxItem label="Minería" checked={check(data.monIndMineria)} />
                <CheckboxItem label="Manuf. Urbana" checked={check(data.monIndManufUrbana)} />
                <CheckboxItem label="Otros Montajes" checked={check(data.monIndOtros)} />
              </div>
            </div>
          </div>

          <div className={styles.grid3}>
            <div className={styles.block}>
              <div className={styles.blockTitle}>DUCTOS Y TUBERÍAS</div>
                <div className={styles.grid2}>

                    <CheckboxItem label="Red de Tuberías" checked={check(data.ductosTuberias)} />
                    <CheckboxItem label="Estaciones" checked={check(data.ductosEstaciones)} />
                    <CheckboxItem label="Otros Ductos" checked={check(data.ductosOtros)} />
                </div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>REDES</div>
                <div className={styles.grid2}>
                        
                    <CheckboxItem label="Trans. Eléctrica A.V." checked={check(data.redesTransElectAV)} />
                    <CheckboxItem label="Trans. Eléctrica B.V." checked={check(data.redesTransElectBV)} />
                    <CheckboxItem label="Comunicaciones" checked={check(data.redesComunicaciones)} />
                    <CheckboxItem label="Otras Redes" checked={check(data.redesOtros)} />
                </div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>OTRAS CONSTRUCCIONES</div>
              <div className={styles.grid2}>

                <CheckboxItem label="Excavaciones" checked={check(data.otrasConstExcavaciones)} />
                <CheckboxItem label="Inst. Hidráulicas/Gas" checked={check(data.otrasConstInstHidrGas)} />
                <CheckboxItem label="Inst. Eléctricas" checked={check(data.otrasConstInstElectro)} />
                <CheckboxItem label="Reparaciones" checked={check(data.otrasConstReparaciones)} />
                <CheckboxItem label="Otros Varios" checked={check(data.otrasConstOtros)} />
              </div>
            </div>
          </div>

          <div className={styles.pageNumber}>Página 1 de 2</div>
        </div>

        {/* ------------------------------------------------ PAGE 2 ------------------------------------------------ */}
        <div className={styles.page}>
          <div className={styles.line} />

          <SectionTitle title="Tareas y Actividades a Realizar" />

          <div className={styles.grid4}>
           
              <CheckboxItem label="Excavación" checked={check(data.actExcavacion)} />
              <CheckboxItem label="Hormigón Armado (H.A.)" checked={check(data.actHA)} />
              <CheckboxItem label="Estructuras Metálicas" checked={check(data.actEstructMetalicas)} />
              <CheckboxItem label="Pintura" checked={check(data.actPintura)} />
 
              <CheckboxItem label="Silletas" checked={check(data.actSilletas)} />
              <CheckboxItem label="Alta y Media Tensión" checked={check(data.actAltaMediaTension)} />
              <CheckboxItem label="Demolición" checked={check(data.actDemolicion)} />
              <CheckboxItem label="Montajes Eléctricos" checked={check(data.actMontajesElectro)} />
           
              <CheckboxItem label="Electricidad" checked={check(data.actElectricidad)} />
              <CheckboxItem label="Mayor a 1000m² Sup. Cub." checked={check(data.actMayorMilSupCubierta)} />
              <CheckboxItem label="Medios de Izaje" checked={check(data.actMediosIzaje)} />
              <CheckboxItem label="Albañilería" checked={check(data.actAlbanileria)} />
  
              <CheckboxItem label="Instalaciones" checked={check(data.actInstalaciones)} />
              <CheckboxItem label="Ascensores" checked={check(data.actAscensores)} />
              <CheckboxItem label="Otros (detallar abajo)" checked={(data.actOtros ?? "") !== ""} />
         
          </div>

          <div className={styles.otherActivitiesBox}>
            <div className={styles.otherActTitle}>Otras Actividades:</div>
            <div className={styles.otherActText}>
              {data.actOtros && data.actOtros.trim() !== "" ? data.actOtros : "--"}
            </div>
          </div>

          <SectionTitle title="Fechas de Ejecución" />

          <div className={styles.grid2}>
            <Field label="Fecha Inicio Excavación" value={Formato.Fecha(data.excavacionInicioFecha)} />
            <Field label="Fecha Fin Excavación" value={Formato.Fecha(data.excavacionFinFecha)} />
            <Field label="Fecha Inicio Demolición" value={Formato.Fecha(data.demolicionInicioFecha)} />
            <Field label="Fecha Fin Demolición" value={Formato.Fecha(data.demolicionFinFecha)} />
            <Field label="Fecha Estimada Fin Obra" value={Formato.Fecha(data.actividadFinFecha)} />
            <Field label="Fecha Suspensión (si aplica)" value={Formato.Fecha(data.suspensionFecha)} />
            <Field label="Fecha Reinicio (si aplica)" value={Formato.Fecha(data.reinicioFecha)} />
          </div>

          <div className={styles.pageNumber}>Página 2 de 2</div>
        </div>

      </div>
    </div>
  );
};

export default AvisosObraPdfGenerator;
