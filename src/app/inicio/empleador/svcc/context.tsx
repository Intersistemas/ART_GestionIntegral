import { createContext, ReactNode, useContext, useMemo } from "react";
import { useAuth } from "@/data/AuthContext";
import gestionEmpleadorAPI, { PresentacionDTO, RefCIIU, SRTSiniestralidadCIUO88 } from '@/data/gestionEmpleadorAPI';
import ArtAPI, { EstablecimientoVm, EstablecimientoVmDescripcion } from "@/data/artAPI";
import { arrayToRecord } from "@/utils/utils";
import { AxiosError } from "axios";

export type SVCCPresentacionContextType = {
  ultima: {
    isLoading: boolean;
    isValidating: boolean;
    data?: PresentacionDTO;
    error?: AxiosError
  };
  isMutating: boolean;
  nueva: {
    isMutating: boolean;
    data?: PresentacionDTO;
    error?: AxiosError;
    trigger: (data: PresentacionDTO) => void;
  };
  finaliza: {
    isMutating: boolean;
    data?: PresentacionDTO;
    error?: AxiosError;
    trigger: (data: PresentacionDTO) => void;
  };
  constancia: {
    isLoading: boolean;
    isValidating: boolean;
    data?: File;
    error?: AxiosError
  };
  establecimientos: {
    isLoading: boolean;
    isValidating: boolean;
    data?: EstablecimientoVm[],
    error?: AxiosError,
    map: Record<number, string>,
  };
  refCIIU: {
    isLoading: boolean;
    isValidating: boolean;
    data?: RefCIIU[],
    error?: AxiosError,
    map: Record<number, string>,
  };
  ciuo88: {
    isLoading: boolean;
    isValidating: boolean;
    data?: SRTSiniestralidadCIUO88[],
    error?: AxiosError,
    map: Record<number, string>,
  };
}

const SVCCPresentacionContext = createContext<SVCCPresentacionContextType | undefined>(undefined);

const {
  useSVCCPresentacionUltima,
  useSVCCPresentacionNueva,
  useSVCCPresentacionFinaliza,
  useSVCCPresentacionConstancia,

  useSRTSiniestralidadCIUO88List,
  useRefCIIUList,
} = gestionEmpleadorAPI;

const { useEstablecimientoList } = ArtAPI;

export function SVCCPresentacionContextProvider({ 
  children,
  empresaCUIT 
}: { 
  children: ReactNode;
  empresaCUIT?: number;
}) {
  const { user } = useAuth();
  
  const ultima = useSVCCPresentacionUltima({ revalidateOnFocus: false });

  const constancia = useSVCCPresentacionConstancia(
    ultima.data?.interno != null && ultima.data.presentacionFecha != null
      ? { id: ultima.data?.interno }
      : undefined
    , { revalidateOnFocus: false }
  );

  const nueva = useSVCCPresentacionNueva({ onSuccess() {
    ultima.mutate();
    constancia.mutate();
  }});

  const finaliza = useSVCCPresentacionFinaliza({ onSuccess() {
    ultima.mutate();
    constancia.mutate();
  }});

  const cuitParaUsar = empresaCUIT ?? user?.cuit ?? 0;
  const establecimientoList = useEstablecimientoList(
    cuitParaUsar ? { cuit: cuitParaUsar } : undefined,
    { revalidateOnFocus: false }
  );

  const establecimientoMap = useMemo(() => (
    arrayToRecord(establecimientoList.data ?? [], (e) => [e.codEstabEmpresa, EstablecimientoVmDescripcion(e)])
  ), [establecimientoList.data]);

  const refCIIUList = useRefCIIUList({ revalidateOnFocus: false });

  const refCIIUMap = useMemo(() => (
    arrayToRecord(refCIIUList.data ?? [], (e) => [e.ciiuRev4 ?? 0, e.descripcionRev4 ?? ""])
  ), [refCIIUList.data]);

  const ciuo88List = useSRTSiniestralidadCIUO88List({ revalidateOnFocus: false });

  const ciuo88Map = useMemo(() => (
    arrayToRecord(ciuo88List.data ?? [], (e) => [e.ciuO88, e.descripcion ?? ""])
  ), [ciuo88List.data]);

  return (
    <SVCCPresentacionContext.Provider
      value={{
        ultima: { isLoading: ultima.isLoading, isValidating: ultima.isValidating, data: ultima.data, error: ultima.error },
        isMutating: nueva.isMutating || finaliza.isMutating,
        nueva: { isMutating: nueva.isMutating, data: nueva.data, error: nueva.error, trigger: nueva.trigger },
        finaliza: { isMutating: finaliza.isMutating, data: finaliza.data, error: finaliza.error, trigger: finaliza.trigger },
        constancia: { isLoading: constancia.isLoading, isValidating: constancia.isValidating, data: constancia.data, error: constancia.error },
        establecimientos: {
          isLoading: establecimientoList.isLoading,
          isValidating: establecimientoList.isValidating,
          data: establecimientoList.data,
          error: establecimientoList.error,
          map: establecimientoMap,
        },
        refCIIU: {
          isLoading: refCIIUList.isLoading,
          isValidating: refCIIUList.isValidating,
          data: refCIIUList.data,
          error: refCIIUList.error,
          map: refCIIUMap,
        },
        ciuo88: {
          isLoading: ciuo88List.isLoading,
          isValidating: ciuo88List.isValidating,
          data: ciuo88List.data,
          error: ciuo88List.error,
          map: ciuo88Map,
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
