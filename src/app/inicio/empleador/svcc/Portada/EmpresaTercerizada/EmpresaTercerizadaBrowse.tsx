import ArtAPI, { EstablecimientoVmDescripcion } from "@/data/artAPI";
import { EmpresaTercerizadaDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { BrowseProps, CRUDSActions, defaultActionsColumns } from "@/utils/ui/table/Browse";
import { arrayToRecord } from "@/utils/utils";
import { useMemo } from "react";

type Actions = CRUDSActions<EmpresaTercerizadaDTO>;
type Props = BrowseProps<EmpresaTercerizadaDTO, Actions> & { cuit: number; };

const { useEstablecimientoList } = ArtAPI;

export const EmpresaTercerizadaBrowse = Browse<EmpresaTercerizadaDTO, Actions, Props>(
  (props) => {
    const { data } = useEstablecimientoList({ cuit: props.cuit }, { revalidateOnFocus: false });
    const { options } = useMemo(() => (
      { options: arrayToRecord(data ?? [], (e) => [e.codEstabEmpresa, EstablecimientoVmDescripcion(e)]) }
    ), [data]);
    return [
      { accessorKey: "idEstablecimientoEmpresa", header: "Establ. Empresa", cell({ getValue }) { return options[getValue<number>()] } },
      { accessorKey: "cuit", header: "CUIT", cell: ({ getValue }) => Formato.CUIP(getValue()) },
      { accessorKey: "ciiu", header: "CIIU" },
      { accessorKey: "cantidadTrabajadores", header: "Cant. Trab." },
      ...defaultActionsColumns<EmpresaTercerizadaDTO, Actions>(props),
    ]
  }
);

export default EmpresaTercerizadaBrowse;
