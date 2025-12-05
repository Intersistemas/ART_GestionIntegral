import { createContext, ReactNode, useContext } from "react";
import { EstablecimientoDeclaradoDTO } from "@/data/gestionEmpleadorAPI";
import { useAnexoVContext } from "../context";

type SustanciaContextType = {
  establecimientoDeclarado?: EstablecimientoDeclaradoDTO;
}

const SustanciaContext = createContext<SustanciaContextType | undefined>(undefined);

export function useSustanciaContext() {
  const context = useContext(SustanciaContext);
  if (context === undefined) throw new Error('useSustanciaContext must be used within a SustanciaContextProvider');
  return context;
}

export function SustanciaContextProvider({
  idEstablecimientoEmpresa,
  children,
}: {
  idEstablecimientoEmpresa?: number;
  children: ReactNode;
}) {
  const { establecimientosDeclarados } = useAnexoVContext();
  return (
    <SustanciaContext.Provider
      value={{
        establecimientoDeclarado: establecimientosDeclarados.data.find(e => e.idEstablecimientoEmpresa === idEstablecimientoEmpresa),
      }}
    >
      {children}
    </SustanciaContext.Provider>
  );
}