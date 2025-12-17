import { EstablecimientoVm, EstablecimientoVmUbicacion } from "@/data/artAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const EstablecimientoBrowse = Browse<EstablecimientoVm>(
  (props) => [
    { accessorKey: "codEstabEmpresa", header: "Código" },
    { accessorKey: "numero", header: "Nro Estab." },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
    { id: "ubicacion", header: "Ubicacion", cell({ row: { original } }) { return EstablecimientoVmUbicacion(original) } },
    ...defaultActionsColumns<EstablecimientoVm>(props),
  ]
);

export default EstablecimientoBrowse;
