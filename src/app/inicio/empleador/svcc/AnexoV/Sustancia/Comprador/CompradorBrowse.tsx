import { CompradorDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const CompradorBrowse = Browse<CompradorDTO>(
  (props) => [
    { accessorKey: "cuit", header: "CUIT", cell({ getValue }) { return Formato.CUIP(getValue<number>())} },
    { accessorKey: "nombreComercial", header: "Nombre Comercial" },
    ...defaultActionsColumns<CompradorDTO>(props),
  ]
);

export default CompradorBrowse;
