import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import gestionEmpleadorAPI, {
  Pagination, EmpresaTercerizadaDTO, SVCCEmpresaTercerizadaUpdateParams, SVCCEmpresaTercerizadaDeleteParams
} from "@/data/gestionEmpleadorAPI";

export type SVCCEmpresasTercerizadasContextType = {
  list: {
    isLoading: boolean;
    isValidating: boolean;
    data: Pagination<EmpresaTercerizadaDTO>;
    error?: any;
    onPageIndexChange: (index: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  isMutating: boolean;
  create: {
    isMutating: boolean;
    data?: EmpresaTercerizadaDTO;
    error?: any;
    trigger: (data: EmpresaTercerizadaDTO) => Promise<EmpresaTercerizadaDTO>;
  };
  update: {
    isMutating: boolean;
    data?: EmpresaTercerizadaDTO;
    error?: any;
    configure: (params?: SVCCEmpresaTercerizadaUpdateParams) => void;
    trigger: (data: EmpresaTercerizadaDTO) => Promise<EmpresaTercerizadaDTO>;
  };
  delete: {
    isMutating: boolean;
    data?: EmpresaTercerizadaDTO;
    error?: any;
    configure: (params?: SVCCEmpresaTercerizadaUpdateParams) => void;
    trigger: (data: EmpresaTercerizadaDTO) => Promise<EmpresaTercerizadaDTO>;
  };
}

const SVCCEmpresasTercerizadasContext = createContext<SVCCEmpresasTercerizadasContextType | undefined>(undefined);

const {
  useSVCCEmpresaTercerizadaList,
  useSVCCEmpresaTercerizadaCreate,
  useSVCCEmpresaTercerizadaUpdate,
  useSVCCEmpresaTercerizadaDelete,
} = gestionEmpleadorAPI;

export function SVCCEmpresasTercerizadasContextProvider({ children }: { children: ReactNode }) {
  const [{ index, size }, setPage] = useState({ index: 1, size: 100 });
  const [data, setData] = useState<Pagination<EmpresaTercerizadaDTO>>({ index, size, count: 0, pages: 0, data: [] });
  const { isLoading, isValidating, error, mutate } = useSVCCEmpresaTercerizadaList(
    { page: `${index},${size}` },
    {
      revalidateOnFocus: false,
      onSuccess(data) { setData(data) },
    }
  );
  const onPageIndexChange = useCallback((index: number) => setPage((o) => ({...o, index: index + 1})), []);
  const onPageSizeChange = useCallback((size: number) => setPage((o) => ({...o, size})), []);

  const {
    isMutating: isCreating, data: createData, error: createError, trigger: triggerCreate
  } = useSVCCEmpresaTercerizadaCreate({ onSuccess() { mutate(); }});
  const createTrigger = useCallback((data: EmpresaTercerizadaDTO) => triggerCreate(data), []);

  const [updateParams, setUpdateParams] = useState<SVCCEmpresaTercerizadaUpdateParams | undefined>();
  const {
    isMutating: isUpdating, data: updateData, error: updateError, trigger: triggerUpdate
  } = useSVCCEmpresaTercerizadaUpdate(updateParams, { onSuccess() { mutate(); }});
  const updateTrigger = useCallback((data: EmpresaTercerizadaDTO) => triggerUpdate(data), []);
  const updateConfigure = useCallback((params?: SVCCEmpresaTercerizadaUpdateParams) => setUpdateParams(params), []);

  const [deleteParams, setDeleteParams] = useState<SVCCEmpresaTercerizadaDeleteParams | undefined>();
  const {
    isMutating: isDeleting, data: deleteData, error: deleteError, trigger: triggerDelete
  } = useSVCCEmpresaTercerizadaDelete(deleteParams, { onSuccess() { mutate(); }});
  const deleteTrigger = useCallback((data: EmpresaTercerizadaDTO) => triggerDelete(data), []);
  const deleteConfigure = useCallback((params?: SVCCEmpresaTercerizadaDeleteParams) => setDeleteParams(params), []);

  return (
    <SVCCEmpresasTercerizadasContext.Provider
      value={{
        list: { isLoading, isValidating, data: { ...data, index: data.index - 1 }, error, onPageIndexChange, onPageSizeChange },
        isMutating: isCreating || isUpdating || isDeleting,
        create: { isMutating: isCreating, data: createData, error: createError, trigger: createTrigger },
        update: { isMutating: isUpdating, data: updateData, error: updateError, trigger: updateTrigger, configure: updateConfigure },
        delete: { isMutating: isDeleting, data: deleteData, error: deleteError, trigger: deleteTrigger, configure: deleteConfigure },
      }}
    >
      {children}
    </SVCCEmpresasTercerizadasContext.Provider>
  );
}

export function useSVCCEmpresasTercerizadasContext() {
  const context = useContext(SVCCEmpresasTercerizadasContext)
  if (context === undefined) throw new Error('useSVCCEmpresasTercerizadasContext must be used within a SVCCEmpresasTercerizadasContextProvider');
  return context
}
