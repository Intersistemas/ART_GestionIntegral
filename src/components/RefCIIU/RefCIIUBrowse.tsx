import { RefCIIU } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const RefCIIUBrowse = Browse<RefCIIU>(
  (props) => [
    { accessorKey: "ciiuRev4", header: "CIIUv4" },
    { accessorKey: "descripcionRev4", header: "Descripción" },
    ...defaultActionsColumns<RefCIIU>(props),
  ]
);

export default RefCIIUBrowse;
