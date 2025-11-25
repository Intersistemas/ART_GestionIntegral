import { ReactNode, useState } from "react";
import EmpresaTercerizadaBrowse from "./EmpresaTercerizadaBrowse";
import { useSVCCPresentacionContext } from "../../context";
import gestionEmpleadorAPI, {
  Pagination, EmpresaTercerizadaDTO, SVCCEmpresaTercerizadaUpdateParams, SVCCEmpresaTercerizadaDeleteParams
} from "@/data/gestionEmpleadorAPI";

import EmpresaTercerizadaModalForm, { OnConfirmCallbackInfo } from "./EmpresaTercerizadaForm";

const {
  useSVCCEmpresaTercerizadaList,
  useSVCCEmpresaTercerizadaCreate,
  useSVCCEmpresaTercerizadaUpdate,
  useSVCCEmpresaTercerizadaDelete,
} = gestionEmpleadorAPI;

type State = {
  modal?: ReactNode
}
export default function EmpresaTercerizadaHandler() {
  const [state, setState] = useState<State>({});
  const { ultima: { data: presentacion } } = useSVCCPresentacionContext();
  const [{ index, size }, setPage] = useState({ index: 0, size: 100 });
  const [data, setData] = useState<Pagination<EmpresaTercerizadaDTO>>({ index: index + 1, size, count: 0, pages: 0, data: [] });
  const { isLoading, mutate } = useSVCCEmpresaTercerizadaList(
    { page: `${index + 1},${size}` },
    {
      revalidateOnFocus: false,
      onSuccess(data) { setData({ ...data, index: data.index - 1 }) },
    }
  );
  const { trigger: triggerCreate } = useSVCCEmpresaTercerizadaCreate({ onSuccess() { mutate(); }});

  const [updateParams, setUpdateParams] = useState<SVCCEmpresaTercerizadaUpdateParams | undefined>();
  const { trigger: triggerUpdate } = useSVCCEmpresaTercerizadaUpdate(updateParams, { onSuccess() { mutate(); }});

  const [deleteParams, setDeleteParams] = useState<SVCCEmpresaTercerizadaDeleteParams | undefined>();
  const { trigger: triggerDelete } = useSVCCEmpresaTercerizadaDelete(deleteParams, { onSuccess() { mutate(); }});
  const readonly = presentacion?.presentacionFecha != null;
  return (
    <>
      <EmpresaTercerizadaBrowse
        isLoading={isLoading}
        data={data}
        onPageIndexChange={(index: number) => setPage((o) => ({ ...o, index }))}
        onPageSizeChange={(size: number) => setPage((o) => ({ ...o, size }))}
        onCreate={readonly ? undefined : () => onAction("create")}
        onRead={(data) => onAction("read", data)}
        onUpdate={readonly ? undefined : (data) => onAction("update", data)}
        onDelete={readonly ? undefined : (data) => onAction("delete", data)}
      />
      {state.modal}
    </>
  );
  function onAction(action: "create" | "read" | "update" | "delete", data?: EmpresaTercerizadaDTO) {
    switch (action) {
      case "create": {
        break;
      }
      case "read": {
        break;
      }
      case "update": {
        if (data?.interno == null) {
          action = "read"
        } else {
          setUpdateParams({ id: data?.interno });
        }
        break;
      }
      case "delete": {
        if (data?.interno == null) {
          action = "read"
        } else {
          setDeleteParams({ id: data?.interno });
        }
        break;
      }
    }
    setState((o) => ({
      ...o,
      modal: (
        <EmpresaTercerizadaModalForm
          action={action}
          init={data}
          title={getTitle()}
          onCancel={handleOnClose}
          onConfirm={handleOnConfirm}
        />
      )
    }));
    function getTitle() {
      const registro = "Empresa Tercerizada";
      switch (action){
        case "create": return `Agregando ${registro}`;
        case "update": return `Actualizando ${registro}`;
        case "delete": return `Borrando ${registro}`;
        case "read": return `Consultando ${registro}`;
      }
    }
    function handleOnClose() {
      setState((o) => ({ ...o, modal: undefined }));
    }
    function handleOnConfirm(info: OnConfirmCallbackInfo) {
      switch (action){
        case "create": {
          info.working.setState({ isWorking: true, message: "Creando.." });
          triggerCreate(info.data.state)
            .then((data) => {
              console.info(data);
              handleOnClose();
            }, (error) => {
              console.error(error);
              info.working.setState({ isWorking: false });
              info.errors.setState((o) => ({ ...o, message: "Ocurrió un error creando empresa tercerizada" }));
            });
          break;
        }
        case "update": {
          info.working.setState({ isWorking: true, message: "Actualizando.." });
          triggerUpdate(info.data.state)
            .then((data) => {
              console.info(data);
              handleOnClose();
            }, (error) => {
              console.error(error);
              info.working.setState({ isWorking: false });
              info.errors.setState((o) => ({ ...o, message: "Ocurrió un error actualizando empresa tercerizada" }));
            });
          break;
        }
        case "delete": {
          info.working.setState({ isWorking: true, message: "Borrando.." });
          triggerDelete(info.data.state)
            .then((data) => {
              console.info(data);
              handleOnClose();
            }, (error) => {
              console.error(error);
              info.working.setState({ isWorking: false });
              info.errors.setState((o) => ({ ...o, message: "Ocurrió un error borrando empresa tercerizada" }));
            });
          break;
        }
        case "read": {
          handleOnClose();
          break;
        }
      }
    }
  }
}