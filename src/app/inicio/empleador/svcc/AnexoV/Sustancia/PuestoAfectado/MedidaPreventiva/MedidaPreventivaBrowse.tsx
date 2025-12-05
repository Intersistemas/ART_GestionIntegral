import { MedidaPreventivaDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TMedidasPreventivas_Map } from "@/data/SVCC/constants";

export const MedidaPreventivaBrowse = Browse<MedidaPreventivaDTO>(
  (props) => [
    { accessorKey: "idMedidaPreventivaDeclarado", header: "Medida preventiva", cell({ getValue }) { return TMedidasPreventivas_Map[getValue<number>()] } },
    ...defaultActionsColumns<MedidaPreventivaDTO>(props),
  ]
);

export default MedidaPreventivaBrowse;
