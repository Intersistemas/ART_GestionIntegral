import { TrabajadorDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import Formato from "@/utils/Formato";
import { useSVCCPresentacionContext } from "../../context";
import { useAnexoVContext } from "../../AnexoV/context";

const TrabajadorBrowse = Browse<TrabajadorDTO>(
  (props) => {
    const { establecimientos: { map: establecimientos } } = useSVCCPresentacionContext();
    const { establecimientosDeclarados } = useAnexoVContext();

    return [
      { accessorKey: "cuil", header: "CUIL", cell({ getValue }) { return Formato.CUIP(getValue<number>()) } },
      {
        accessorKey: "idEstablecimientoEmpresa",
        header: "Establ. Empresa - Actividad",
        cell({ getValue }) {
          const value = getValue<number | undefined>();
          const establecimiento = establecimientosDeclarados.data?.find(e => e.idEstablecimientoEmpresa === value);
          const empresa = value ? establecimientos[value] : undefined;
          return [empresa, establecimiento?.descripcionActividad].filter(r => r).join(" - ");
        },
      },
      ...defaultActionsColumns<TrabajadorDTO>(props),
    ]
  }
);

export default TrabajadorBrowse;
