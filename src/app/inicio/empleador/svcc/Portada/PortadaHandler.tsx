import { useState } from "react";
import CustomTab from "@/utils/ui/tab/CustomTab";
import EmpresaTercerizadaHandler from "./EmpresaTercerizada/EmpresaTercerizadaHandler";
import EstablecimientoDeclaradoHandler from "./EstablecimientoDeclarado/EstablecimientoDeclaradoHandler";

export default function PortadaHandler() {
  const [currentTab, setCurrentTab] = useState(0);// Queremos que inicie en la primera pestaña (0)
  return (
    <CustomTab
      currentTab={currentTab}
      onTabChange={(_event, tab) => setCurrentTab(tab)}
      tabs={[
        {
          label: "Empresas tercerizadas",
          value: 0,
          content: (
            <EmpresaTercerizadaHandler />
          ),
        },
        {
          label: "Establecimientos declarados",
          value: 1,
          content: (
            <EstablecimientoDeclaradoHandler />
          ),
        }
      ]}
    />
  )
}
