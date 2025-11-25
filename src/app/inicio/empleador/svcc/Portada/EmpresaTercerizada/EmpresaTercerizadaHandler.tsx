import { ReactNode, useState } from "react";
import EmpresaTercerizadaBrowse from "./EmpresaTercerizadaBrowse";
import { SVCCEmpresasTercerizadasContextProvider, useSVCCEmpresasTercerizadasContext } from "./context";
import { useSVCCPresentacionContext } from "../../context";
import { EmpresaTercerizadaDTO } from "@/data/gestionEmpleadorAPI";
import EmpresaTercerizadaModalForm, { OnConfirmCallbackInfo } from "./EmpresaTercerizadaForm";

export default function EmpresaTercerizadaHandler() {
  return (
    <SVCCEmpresasTercerizadasContextProvider>
      <Contextualized />
    </SVCCEmpresasTercerizadasContextProvider>
  );
}

type State = {
  modal?: ReactNode
}
function Contextualized() {
  const [state, setState] = useState<State>({});
  const { ultima: { data: presentacion } } = useSVCCPresentacionContext();
  const {
    list: { isLoading, data, onPageIndexChange, onPageSizeChange },
    create: { trigger: triggerCreate },
    update: { trigger: triggerUpdate, configure: configureUpdate },
    delete: { trigger: triggerDelete, configure: configureDelete },
  } = useSVCCEmpresasTercerizadasContext()
  const readonly = presentacion?.presentacionFecha != null;
  return (
    <>
      <EmpresaTercerizadaBrowse
        isLoading={isLoading}
        data={data}
        onPageIndexChange={onPageIndexChange}
        onPageSizeChange={onPageSizeChange}
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
          configureUpdate({ id: data?.interno });
        }
        break;
      }
      case "delete": {
        if (data?.interno == null) {
          action = "read"
        } else {
          configureDelete({ id: data?.interno });
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
  }}