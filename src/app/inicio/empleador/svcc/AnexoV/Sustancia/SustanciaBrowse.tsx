import { SustanciaDTO } from "@/data/gestionEmpleadorAPI";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";
import { TUnidadesMedidas_Map } from "@/data/SVCC/constants";
import { useSVCCPresentacionContext } from "../../context";

const SustanciaBrowse = Browse<SustanciaDTO>(
  (props) => {
    const { establecimientos: { map: establecimientos } } = useSVCCPresentacionContext();
    return [
      { accessorKey: "nombreComercial", header: "Nombre comercial" },
      { accessorKey: "idEstablecimientoEmpresa", header: "Establ. Empresa", cell({ getValue }) { return establecimientos[getValue<number>()] } },
      { accessorKey: "cantidadAnual", header: "Cantidad anual", cell({ getValue, row: { original } }) { return [getValue<number>(), TUnidadesMedidas_Map[original.idUnidadDeMedida ?? 0]].filter(e => e).join(" ") } },
      ...defaultActionsColumns<SustanciaDTO>(props),
    ]
  }
);

export default SustanciaBrowse;
