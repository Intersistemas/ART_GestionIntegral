import { EstudioAmbientalDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TFrecuencia_Map } from "@/data/SVCC/constants";

export const EstudioAmbientalBrowse = Browse<EstudioAmbientalDTO>(
  (props) => [
    { accessorKey: "metodologiaEmpleada", header: "Metodologia empleada" },
    {
      accessorKey: "idUnidadFrecuencia",
      header: "Frecuencia",
      cell({ getValue, row: { original: { cantidadFrecuencia } } }) {
        return [cantidadFrecuencia, TFrecuencia_Map[getValue<number>()]].filter(e => e !== undefined).join(" ");
      }
    },
    ...defaultActionsColumns<EstudioAmbientalDTO>(props),
  ]
);

export default EstudioAmbientalBrowse;
