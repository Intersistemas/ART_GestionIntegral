import { EstablecimientoVm, EstablecimientoVmDescripcion } from "@/data/artAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const EstablecimientoBrowse = Browse<EstablecimientoVm>(
  (props) => [
    { accessorKey: "codEstabEmpresa", header: "Código" },
    { accessorKey: "interno", header: "Establecimiento", cell({ row: { original } }) { return EstablecimientoVmDescripcion(original) } },
    ...defaultActionsColumns<EstablecimientoVm>(props),
  ]
);

export default EstablecimientoBrowse;
