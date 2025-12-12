import { createContext, ReactNode, useContext } from "react";
import gestionEmpleadorAPI, { EstablecimientoDeclaradoDTO } from "@/data/gestionEmpleadorAPI";
import { useAnexoVContext } from "../../AnexoV/context";

type TrabajadorContextType = {
  establecimientoDeclarado: {
    isLoading: boolean;
    isValidating: boolean;
    data?: EstablecimientoDeclaradoDTO;
    error?: any;
  },
}

const TrabajadorContext = createContext<TrabajadorContextType | undefined>(undefined);

const {
  useSVCCEstablecimientoDeclaradoList,
} = gestionEmpleadorAPI;

export function useTrabajadorContext() {
  const context = useContext(TrabajadorContext);
  if (context === undefined) throw new Error('useTrabajadorContext must be used within a TrabajadorContextProvider');
  return context;
}

export function TrabajadorContextProvider({
  establecimientoDeclaradoInterno,
  children,
}: {
  establecimientoDeclaradoInterno?: number;
  children: ReactNode;
}) {
  const { establecimientosDeclarados } = useAnexoVContext();
  const establecimientoDeclarado = establecimientosDeclarados.data?.find(e => e.interno === establecimientoDeclaradoInterno);

  return (
    <TrabajadorContext.Provider
      value={{
        establecimientoDeclarado: {
          isLoading: establecimientosDeclarados.isLoading,
          isValidating: establecimientosDeclarados.isValidating,
          data: establecimientoDeclarado,
          error: establecimientosDeclarados.error,
        },
      }}
    >
      {children}
    </TrabajadorContext.Provider>
  );
}