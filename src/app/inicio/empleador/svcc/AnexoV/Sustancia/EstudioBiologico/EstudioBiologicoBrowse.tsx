import { EstudioBiologicoDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TFrecuencia_Map } from "@/data/SVCC/constants";

export const EstudioBiologicoBrowse = Browse<EstudioBiologicoDTO>(
  (props) => [
    { accessorKey: "analisisEstudiosComplementacion", header: "Analisis estudios complementacion" },
    {
      accessorKey: "idUnidadFrecuencia",
      header: "Frecuencia",
      cell({ getValue, row: { original: { cantidadFrecuencia } } }) {
        return [cantidadFrecuencia, TFrecuencia_Map[getValue<number>()]].filter(e => e !== undefined).join(" ");
      }
    },
    ...defaultActionsColumns<EstudioBiologicoDTO>(props),
  ]
);

export default EstudioBiologicoBrowse;
