import { PuestoDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const PuestoBrowse = Browse<PuestoDTO>(
  (props) => [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "ciuo", header: "CIUO" },
    ...defaultActionsColumns<PuestoDTO>(props),
  ]
);

export default PuestoBrowse;
