import { ContratistaDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const ContratistaBrowse = Browse<ContratistaDTO>(
  (props) => [
    { accessorKey: "cuit", header: "CUIT", cell: ({ getValue }) => Formato.CUIP(getValue()) },
    { accessorKey: "ciiu", header: "CIIU" },
    { accessorKey: "cantidadTrabajadores", header: "Cant. trabajadores" },
    ...defaultActionsColumns<ContratistaDTO>(props),
  ]
);

export default ContratistaBrowse;