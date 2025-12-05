import { EncargadoProteccionDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const EncargadoProteccionBrowse = Browse<EncargadoProteccionDTO>(
  (props) => [
    { accessorKey: "cuil", header: "CUIL", cell({ getValue }) { return Formato.CUIP(getValue<number>())} },
    { accessorKey: "tituloProfesional", header: "Titulo profesional" },
    { accessorKey: "nroHabilitacion", header: "Nro. habilitacion" },
    { accessorKey: "matriculaProfesional", header: "Matricula profesional" },
    ...defaultActionsColumns<EncargadoProteccionDTO>(props),
  ]
);

export default EncargadoProteccionBrowse;
