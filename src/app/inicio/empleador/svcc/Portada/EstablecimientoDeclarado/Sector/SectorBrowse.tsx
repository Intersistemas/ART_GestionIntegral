import { SectorDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const SectorBrowse = Browse<SectorDTO>(
  (props) => [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "ciiu", header: "CIIU" },
    ...defaultActionsColumns<SectorDTO>(props),
  ]
);

export default SectorBrowse;