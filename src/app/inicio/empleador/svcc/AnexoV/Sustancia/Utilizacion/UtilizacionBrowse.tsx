import { UtilizacionDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TModoEmpleo_Map, TUsoOrigen_Map } from "@/data/SVCC/constants";

const UtilizacionBrowse = Browse<UtilizacionDTO>(
  (props) => [
    { accessorKey: "usoOrigen", header: "Uso Origen", cell({ getValue }) { return TUsoOrigen_Map[getValue<number>()] } },
    { accessorKey: "modoDeEmpleo", header: "Modo de Empleo", cell({ getValue }) { return TModoEmpleo_Map[getValue<number>()] } },
    ...defaultActionsColumns<UtilizacionDTO>(props),
  ]
);

export default UtilizacionBrowse;