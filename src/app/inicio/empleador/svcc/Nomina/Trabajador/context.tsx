import { createContext, ReactNode, useContext } from "react";
import { useSVCCPresentacionContext } from "../../context";
import { EstablecimientoVm } from "@/data/artAPI";
import { EstablecimientoDeclaradoDTO } from "@/data/gestionEmpleadorAPI";
import { useAnexoVContext } from "../../AnexoV/context";

type TrabajadorContextType = {
  establecimientoDeclarado: {
    isLoading: boolean;
    isValidating: boolean;
    data?: EstablecimientoDeclaradoDTO;
    error?: any;
  },
  establecimiento: {
    isLoading: boolean;
    isValidating: boolean;
    data?: EstablecimientoVm;
    error?: any;
  },
}

const TrabajadorContext = createContext<TrabajadorContextType | undefined>(undefined);

export function useTrabajadorContext() {
  const context = useContext(TrabajadorContext);
  if (context === undefined) throw new Error('useTrabajadorContext must be used within a TrabajadorContextProvider');
  return context;
}

export function TrabajadorContextProvider({
  idEstablecimientoEmpresa,
  children,
}: {
  idEstablecimientoEmpresa?: number;
  children: ReactNode;
}) {
  const { establecimientos } = useSVCCPresentacionContext();
  const { establecimientosDeclarados } = useAnexoVContext();
  const establecimiento = establecimientos.data?.find(e => e.codEstabEmpresa === idEstablecimientoEmpresa);
  const establecimientoDeclarado = establecimientosDeclarados.data?.find(e => e.idEstablecimientoEmpresa === idEstablecimientoEmpresa);

  return (
    <TrabajadorContext.Provider
      value={{
        establecimientoDeclarado: {
          isLoading: establecimientosDeclarados.isLoading,
          isValidating: establecimientosDeclarados.isValidating,
          data: establecimientoDeclarado,
          error: establecimientosDeclarados.error,
        },
        establecimiento: {
          isLoading: establecimientos.isLoading,
          isValidating: establecimientos.isValidating,
          data: establecimiento,
          error: establecimientos.error,
        },
      }}
    >
      {children}
    </TrabajadorContext.Provider>
  );
}