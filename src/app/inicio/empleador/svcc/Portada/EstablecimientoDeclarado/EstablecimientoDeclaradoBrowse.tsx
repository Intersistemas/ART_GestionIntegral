import ArtAPI, { EstablecimientoVmDescripcion } from "@/data/artAPI";
import { EstablecimientoDeclaradoDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { BrowseProps, CRUDSActions, defaultActionsColumns } from "@/utils/ui/table/Browse";
import { arrayToRecord } from "@/utils/utils";
import { useMemo } from "react";

type Actions = CRUDSActions<EstablecimientoDeclaradoDTO>;
type Props = BrowseProps<EstablecimientoDeclaradoDTO, Actions> & { cuit: number; };

const { useEstablecimientoList } = ArtAPI;

export const EstablecimientoDeclaradoBrowse = Browse<EstablecimientoDeclaradoDTO, Actions, Props>(
  (props) => {
    const { data } = useEstablecimientoList({ cuit: props.cuit }, { revalidateOnFocus: false });
    const { options } = useMemo(() => (
      { options: arrayToRecord(data ?? [], (e) => [e.codEstabEmpresa, EstablecimientoVmDescripcion(e)]) }
    ), [data]);
    return [
      { accessorKey: "idEstablecimientoEmpresa", header: "Establ. Empresa", cell({ getValue }) { return options[getValue<number>()] } },
      { accessorKey: "descripcionActividad", header: "Actividad" },
      { accessorKey: "mail", header: "Correo" },
      ...defaultActionsColumns<EstablecimientoDeclaradoDTO, Actions>(props),
    ]
  }
);

export default EstablecimientoDeclaradoBrowse;
