import { ProveedorDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const ProveedorBrowse = Browse<ProveedorDTO>(
  (props) => [
    { accessorKey: "cuit", header: "CUIT", cell({ getValue }) { return Formato.CUIP(getValue<number>())} },
    { accessorKey: "nombreComercial", header: "Nombre Comercial" },
    ...defaultActionsColumns<ProveedorDTO>(props),
  ]
);

export default ProveedorBrowse;
