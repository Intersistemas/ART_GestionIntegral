import { EmpresaTercerizadaDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { useSVCCPresentacionContext } from "../../context";

export const EmpresaTercerizadaBrowse = Browse<EmpresaTercerizadaDTO>(
  (props) => {
    const { establecimientos: { map: establecimientos } } = useSVCCPresentacionContext();
    return [
      { accessorKey: "idEstablecimientoEmpresa", header: "Establ. Empresa", cell({ getValue }) { return establecimientos[getValue<number>()] } },
      { accessorKey: "cuit", header: "CUIT", cell: ({ getValue }) => Formato.CUIP(getValue()) },
      { accessorKey: "ciiu", header: "CIIU" },
      { accessorKey: "cantidadTrabajadores", header: "Cant. Trab." },
      ...defaultActionsColumns<EmpresaTercerizadaDTO>(props),
    ]
  }
);

export default EmpresaTercerizadaBrowse;
