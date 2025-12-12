import { ResponsableInstalacionDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import Browse, { defaultActionsColumns } from "@/utils/ui/table/Browse";

export const ResponsableInstalacionBrowse = Browse<ResponsableInstalacionDTO>(
  (props) => [
    { accessorKey: "cuil", header: "CUIL", cell({ getValue }) { return Formato.CUIP(getValue<number>())} },
    { accessorKey: "nroLicenciaHabilitante", header: "Nro. licencia habilitante" },
    { accessorKey: "fechaExpedicion", header: "Fecha expedicion", cell({ getValue }) { return Formato.Fecha(getValue<number>())} },
    { accessorKey: "fechaVencimiento", header: "Fecha vencimiento", cell({ getValue }) { return Formato.Fecha(getValue<number>())} },
    ...defaultActionsColumns<ResponsableInstalacionDTO>(props),
  ]
);

export default ResponsableInstalacionBrowse;
