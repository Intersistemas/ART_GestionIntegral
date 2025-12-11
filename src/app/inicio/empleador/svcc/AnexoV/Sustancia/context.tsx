import { createContext, ReactNode, useContext } from "react";
import { EstablecimientoDeclaradoDTO } from "@/data/gestionEmpleadorAPI";
import { useAnexoVContext } from "../context";

type SustanciaContextType = {
  establecimientoDeclarado: {
    isLoading: boolean;
    isValidating: boolean;
    data?: EstablecimientoDeclaradoDTO;
    error?: any;
  },
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
        establecimientoDeclarado: {
          isLoading: establecimientosDeclarados.isLoading,
          isValidating: establecimientosDeclarados.isValidating,
          data: establecimientosDeclarados.data.find(e => e.idEstablecimientoEmpresa === idEstablecimientoEmpresa),
          error: establecimientosDeclarados.error,
        },
      }}
    >
      {children}
    </SustanciaContext.Provider>
  );
}