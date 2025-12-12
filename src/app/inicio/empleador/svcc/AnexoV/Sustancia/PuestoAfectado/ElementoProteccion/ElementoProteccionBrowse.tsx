import { ElementoProteccionDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TElementosProteccionPersonal_Map } from "@/data/SVCC/constants";

export const ElementoProteccionBrowse = Browse<ElementoProteccionDTO>(
  (props) => [
    { accessorKey: "idElementoDeProteccionDeclarado", header: "Elemento de proteccion", cell({ getValue }) { return TElementosProteccionPersonal_Map[getValue<number>()] } },
    ...defaultActionsColumns<ElementoProteccionDTO>(props),
  ]
);

export default ElementoProteccionBrowse;
