import { EquipoRadiologicoDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TTiposEquipos_Map } from "@/data/SVCC/constants";

export const EquipoRadiologicoBrowse = Browse<EquipoRadiologicoDTO>(
  (props) => [
    { accessorKey: "idTipoEquipo", header: "Tipo equipo", cell({ getValue }) { return TTiposEquipos_Map[getValue<number>()]} },
    { accessorKey: "marca", header: "Marca" },
    { accessorKey: "modelo", header: "Modelo" },
    ...defaultActionsColumns<EquipoRadiologicoDTO>(props),
  ]
);

export default EquipoRadiologicoBrowse;
