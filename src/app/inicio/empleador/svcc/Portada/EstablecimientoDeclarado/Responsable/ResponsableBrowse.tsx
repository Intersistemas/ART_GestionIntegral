import { ResponsableDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TTipoProfesionalResponsable_Map } from "../../../constants";

const ResponsableBrowse = Browse<ResponsableDTO>(
  (props) => [
    { accessorKey: "cuilCuit", header: "CUIL/CUIT", cell({ getValue }) { return Formato.CUIP(getValue<number>()) } },
    { accessorKey: "matricula", header: "Matricula" },
    { accessorKey: "idTipoProfesionalResponsable", header: "Tipo Prof. responsable", cell({ getValue }) { return TTipoProfesionalResponsable_Map[getValue<number>()] } },
    { accessorKey: "cantHorasAsignadas", header: "Cant. Hr. asignadas" },
    ...defaultActionsColumns<ResponsableDTO>(props),
  ]
);

export default ResponsableBrowse;