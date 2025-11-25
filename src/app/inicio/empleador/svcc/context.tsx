import { createContext, ReactNode, useCallback, useContext } from "react";
import gestionEmpleadorAPI, { PresentacionDTO } from '@/data/gestionEmpleadorAPI';

export type SVCCContextType = {
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
}

const SVCCPresentacionContext = createContext<SVCCContextType | undefined>(undefined);

const {
  useSVCCPresentacionUltima,
  useSVCCPresentacionNueva,
  useSVCCPresentacionFinaliza,
} = gestionEmpleadorAPI;

export function SVCCPresentacionContextProvider({ children }: { children: ReactNode }) {
  const { isLoading, isValidating, data, error, mutate } = useSVCCPresentacionUltima({ revalidateOnFocus: false });

  const {
    isMutating: nuevaIsMutating, data: nuevaData, error: nuevaError, trigger: triggerNueva
  } = useSVCCPresentacionNueva({ onSuccess() { mutate() }});
  const nuevaTrigger = useCallback((data: PresentacionDTO) => triggerNueva(data), []);

  const {
    isMutating: finalizaIsMutating, data: finalizaData, error: finalizaError, trigger: triggerFinaliza
  } = useSVCCPresentacionFinaliza({ onSuccess() { mutate() }});
  const finalizaTrigger = useCallback((data: PresentacionDTO) => triggerFinaliza(data), []);

  return (
    <SVCCPresentacionContext.Provider
      value={{
        ultima: { isLoading, isValidating, data, error },
        isMutating: nuevaIsMutating || finalizaIsMutating,
        nueva: { isMutating: nuevaIsMutating, data: nuevaData, error: nuevaError, trigger: nuevaTrigger },
        finaliza: { isMutating: finalizaIsMutating, data: finalizaData, error: finalizaError, trigger: finalizaTrigger },
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
