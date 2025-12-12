import { EstablecimientoDeclaradoDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { useSVCCPresentacionContext } from "../../context";

export const EstablecimientoDeclaradoBrowse = Browse<EstablecimientoDeclaradoDTO>(
  (props) => {
    const { establecimientos: { map: establecimientos } } = useSVCCPresentacionContext();
    return [
      { accessorKey: "idEstablecimientoEmpresa", header: "Establ. Empresa", cell({ getValue }) { return establecimientos[getValue<number>()] } },
      { accessorKey: "descripcionActividad", header: "Actividad" },
      { accessorKey: "mail", header: "Correo" },
      ...defaultActionsColumns<EstablecimientoDeclaradoDTO>(props),
    ]
  }
);

export default EstablecimientoDeclaradoBrowse;
