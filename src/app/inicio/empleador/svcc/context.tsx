import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { useAuth } from "@/data/AuthContext";
import gestionEmpleadorAPI, { PresentacionDTO } from '@/data/gestionEmpleadorAPI';
import ArtAPI, { EstablecimientoVm, EstablecimientoVmDescripcion } from "@/data/artAPI";
import { arrayToRecord } from "@/utils/utils";

export type SVCCPresentacionContextType = {
  ultima: {
    isLoading: boolean;
    isValidating: boolean;
    data?: PresentacionDTO;
    error?: any
  };
  isMutating: boolean;
  nueva: {
    isMutating: boolean;
    data?: PresentacionDTO;
    error?: any;
    trigger: (data: PresentacionDTO) => void;
  };
  finaliza: {
    isMutating: boolean;
    data?: PresentacionDTO;
    error?: any;
    trigger: (data: PresentacionDTO) => void;
  };
  establecimientos: {
    isLoading: boolean;
    isValidating: boolean;
    data?: EstablecimientoVm[],
    error?: any,
    map: Record<number, string>,
  };
}

const SVCCPresentacionContext = createContext<SVCCPresentacionContextType | undefined>(undefined);

const {
  useSVCCPresentacionUltima,
  useSVCCPresentacionNueva,
  useSVCCPresentacionFinaliza,
} = gestionEmpleadorAPI;

const { useEstablecimientoList } = ArtAPI;

export function SVCCPresentacionContextProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const { isLoading, isValidating, data, error, mutate } = useSVCCPresentacionUltima({ revalidateOnFocus: false });

  const {
    isMutating: nuevaIsMutating, data: nuevaData, error: nuevaError, trigger: triggerNueva
  } = useSVCCPresentacionNueva({ onSuccess() { mutate() }});
  const nuevaTrigger = useCallback((data: PresentacionDTO) => triggerNueva(data), []);

  const {
    isMutating: finalizaIsMutating, data: finalizaData, error: finalizaError, trigger: triggerFinaliza
  } = useSVCCPresentacionFinaliza({ onSuccess() { mutate() }});
  const finalizaTrigger = useCallback((data: PresentacionDTO) => triggerFinaliza(data), []);

  const {
    isLoading: estabIsLoading,
    isValidating: estabIsValidating,
    data: estabData,
    error: estabError,
  } = useEstablecimientoList({ cuit: user?.cuit ?? 0 }, { revalidateOnFocus: false });

  const { estabMap } = useMemo(() => (
    { estabMap: arrayToRecord(estabData ?? [], (e) => [e.codEstabEmpresa, EstablecimientoVmDescripcion(e)]) }
  ), [estabData]);

  return (
    <SVCCPresentacionContext.Provider
      value={{
        ultima: { isLoading, isValidating, data, error },
        isMutating: nuevaIsMutating || finalizaIsMutating,
        nueva: { isMutating: nuevaIsMutating, data: nuevaData, error: nuevaError, trigger: nuevaTrigger },
        finaliza: { isMutating: finalizaIsMutating, data: finalizaData, error: finalizaError, trigger: finalizaTrigger },
        establecimientos: {
          isLoading: estabIsLoading,
          isValidating: estabIsValidating,
          data: estabData,
          error: estabError,
          map: estabMap,
        },
      }}
    >
      {children}
    </SVCCPresentacionContext.Provider>
  );
}

export function useSVCCPresentacionContext() {
  const context = useContext(SVCCPresentacionContext)
  if (context === undefined) throw new Error('useSVCCPresentacionContext must be used within a SVCCPresentacionContextProvider');
  return context
}
