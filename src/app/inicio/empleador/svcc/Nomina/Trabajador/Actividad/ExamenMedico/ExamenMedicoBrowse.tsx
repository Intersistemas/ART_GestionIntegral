import { ExamenMedicoDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { ExamenMedico_Map } from "@/data/SVCC/constants";

const ExamenMedicoBrowse = Browse<ExamenMedicoDTO>(
  (props) => [
    { accessorKey: "idExamen", header: "Exámen", cell({ getValue }) { return ExamenMedico_Map[getValue<number>()]; } },
    ...defaultActionsColumns<ExamenMedicoDTO>(props),
  ]
);

export default ExamenMedicoBrowse;
