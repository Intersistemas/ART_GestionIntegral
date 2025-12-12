import { ResponsableUsoDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const ResponsableUsoBrowse = Browse<ResponsableUsoDTO>(
  (props) => [
    { accessorKey: "cuil", header: "CUIL", cell({ getValue}) { return Formato.CUIP(getValue<number>()) } },
    { accessorKey: "matriculaProfesional", header: "Matricula profesional" },
    { accessorKey: "fechaExpedicion", header: "Fecha expedicion", cell({ getValue}) { return Formato.Fecha(getValue<number>()) } },
    { accessorKey: "fechaVencimiento", header: "Fecha vencimiento", cell({ getValue}) { return Formato.Fecha(getValue<number>()) } },
    ...defaultActionsColumns<ResponsableUsoDTO>(props),
  ]
);

export default ResponsableUsoBrowse;
