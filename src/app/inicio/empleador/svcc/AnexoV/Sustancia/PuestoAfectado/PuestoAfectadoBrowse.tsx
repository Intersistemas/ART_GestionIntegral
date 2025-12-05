import { PuestoAfectadoDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { useSustanciaContext } from "../context";

export const PuestoAfectadoBrowse = Browse<PuestoAfectadoDTO>(
  (props) => {
    const { establecimientoDeclarado } = useSustanciaContext();
    return [
      { accessorKey: "descripcionActividad", header: "Actividad" },
      { accessorKey: "descripcionEstudios", header: "Estudios" },
      {
        accessorKey: "puestoInterno",
        header: "Puesto",
        cell({ getValue }) {
          const puesto = establecimientoDeclarado?.puestos?.find((p) => p.interno === getValue<number>() );
          return puesto === undefined ? undefined : [puesto.ciuo, puesto.nombre].filter(r => r !== undefined).join(" - ");
        }
      },
      ...defaultActionsColumns<PuestoAfectadoDTO>(props),
    ]
  }
);

export default PuestoAfectadoBrowse;