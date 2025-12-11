import { ActividadDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { useNominaContext } from "../../context";
import { useTrabajadorContext } from "../context";

const ActividadBrowse = Browse<ActividadDTO>(
  (props) => {
    const { sustancias } = useNominaContext();
    const { establecimientoDeclarado } = useTrabajadorContext();
    return [
      {
        accessorKey: "sustanciaInterno",
        header: "Sustancia declarada",
        cell({ getValue }) {
          const sustancia = sustancias.data.find(s => s.interno === getValue<number>());
          return sustancia?.nombreComercial;
        },
      },
      {
        accessorKey: "puestoInterno",
        header: "Puesto declarado",
        cell({ getValue }) {
          const puesto = establecimientoDeclarado.data?.puestos?.find(s => s.interno === getValue<number>());
          return [puesto?.ciuo, puesto?.nombre].filter(p => p).join(" - ");
        },
      },
      {
        accessorKey: "sectorInterno",
        header: "Sector declarado",
        cell({ getValue }) {
          const sector = establecimientoDeclarado.data?.sectores?.find(s => s.interno === getValue<number>());
          return [sector?.ciiu, sector?.nombre].filter(p => p).join(" - ");
        },
      },
      ...defaultActionsColumns<ActividadDTO>(props),
    ]
  }
);

export default ActividadBrowse;
