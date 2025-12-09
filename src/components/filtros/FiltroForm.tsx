"use client"
import React, { ReactNode, useEffect, useState } from "react";
import QueriesAPI, { FiltroVm } from "@/data/queryAPI";
import useSWRMutation from "swr/mutation";
import CustomModal from "@/utils/ui/form/CustomModal";
import { Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import styles from "./FiltroForm.module.css";
import CustomButton from "@/utils/ui/button/CustomButton";
import useSWR from "swr";

type DataError = Partial<Record<keyof FiltroVm, string>>;
type Error = {
  message?: string;
  data: DataError;
};
type State = {
  data: FiltroVm;
  error: Error;
  getDisponibilidad?: boolean;
  disponible?: boolean;
  workingText?: string;
}

const { swrGetDisponibilidad, swrSaveFilter, swrDeleteFilter } = QueriesAPI;

function Row({ children }: { children?: ReactNode }) {
  return (<Grid className={styles.formRow} container size={12} spacing={2} >{children}</Grid>);
}
function Section({ title, children }: { title?: ReactNode, children?: ReactNode }) {
  return (
    <div className={styles.formSection}>
      {typeof title === "string"
        ? (<Typography variant="h6" className={styles.sectionTitle}>{title}</Typography>)
        : (title)
      }
      {children}
    </div>
  );
}
const ambitosOptions = {
  "Todos": "todos",
  // "Rol": "rol",  // ToDo
  "Usuario": "usuario",
};

export default function FiltroForm({
  action,
  title,
  size,
  init = {},
  disabled = {},
  readonly = {},
  onClose = () => { },
}: {
  action?: "Create" | "Read" | "Update" | "Delete";
  title?: string;
  size?: "small" | "large" | "mid";
  init?: FiltroVm;
  disabled?: Partial<Record<keyof FiltroVm, boolean>>;
  readonly?: Partial<Record<keyof FiltroVm, boolean>>;
  onClose?: (completed: boolean, data?: FiltroVm) => void;
}) {
  const [state, setState] = useState<State>(getInitialState());
  const {
    data,
    error: { message, data: errors },
    getDisponibilidad,
    disponible,
    workingText
  } = state;

  const { isLoading: isLoadingDisponibilidad } = useSWR(
    (!getDisponibilidad || !data.nombre || !data.modulo) ? null
      : swrGetDisponibilidad.key({ nombre: data.nombre, modulo: data.modulo }),
    swrGetDisponibilidad.fetcher,
    {
      onSuccess({ disponible }) { setState((o) => ({ ...o, getDisponibilidad: false, disponible })); },
      onError() { setState((o) => ({ ...o, getDisponibilidad: false, disponible: undefined })); },
    }
  );
  const { trigger: triggerSave, isMutating: isMutatingSave } = useSWRMutation(swrSaveFilter.key, swrSaveFilter.fetcher);
  const { trigger: triggerDelete, isMutating: isMutatingDelete } = useSWRMutation(swrDeleteFilter.key, swrDeleteFilter.fetcher);

  const isWorking = isMutatingSave || isMutatingDelete || isLoadingDisponibilidad;

  useEffect(() => {
    if (!action) return;
    setState(getInitialState());
  }, [action]);

  return (
    <CustomModal
      open={!!action}
      onClose={handleOnClose}
      title={title}
      size={size}
    >
      <Box className={styles.formContainer}>
        {message && <Typography variant="h5" className={styles.errorMessage}>{message}</Typography>}
        <div className={styles.formLayout}>
          <div className={styles.formContent}>
            <Section title="Datos del filtro">
              <Row>
                <Grid size="grow">
                  <TextField
                    name="nombre"
                    label="Nombre"
                    placeholder="Ingrese nombre"
                    required
                    value={data.nombre ?? ''}
                    onChange={textFieldOnChange}
                    onBlur={handleCheckDisponibilidad}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    disabled={!!disabled.nombre}
                    fullWidth
                  />
                </Grid>
                {isLoadingDisponibilidad
                  ? <Typography variant="h5" color="info">Consultando disponibilidad..</Typography>
                  : disponible === undefined
                    ? <Typography />
                    : disponible
                      ? <Typography variant="h5" color="success">Disponible</Typography>
                      : <Typography variant="h5" color="warning">Existente</Typography>
                }
              </Row>
              <Row>
                <FormControl
                  error={!!errors.ambito}
                  disabled={!!disabled.ambito}
                  fullWidth
                >
                  <InputLabel id="ambito-label">Ámbito</InputLabel>
                  <Select
                    name="ambito"
                    labelId="ambito-label"
                    required
                    value={data.ambito}
                    onChange={selectOnChange}
                  >
                    {Object.entries(ambitosOptions).map(([key, value]) => (
                      <MenuItem key={key} value={value}>{key}</MenuItem>
                    ))}
                  </Select>
                  {errors.ambito && (<FormHelperText>{errors.ambito}</FormHelperText>)}
                </FormControl>
                {/* ToDo selección de rol cuando ámbito es "rol" */}
              </Row>
              {!["Read", "Delete"].includes(action!) ? null :
                <TextField
                  name="deletedObs"
                  label="Observaciones"
                  placeholder="Observaciones de borrado"
                  value={data.deletedObs ?? ''}
                  onChange={textFieldOnChange}
                  error={!!errors.deletedObs}
                  helperText={errors.deletedObs}
                  disabled={!!disabled.deletedObs}
                  fullWidth
                />
              }
            </Section>
            <div className={styles.formActions}>
              {action !== "Read" &&
                <CustomButton
                  onClick={handleOnSubmit}
                  disabled={isWorking}
                >
                  {workingText || action === "Delete" ? "Borrar" : "Guardar"}
                </CustomButton>
              }
              <CustomButton
                onClick={handleOnClose}
                color="secondary"
                disabled={isWorking}
              >
                {action === "Read" ? "Cerrar" : "Cancelar"}
              </CustomButton>
            </div>
          </div>
        </div>
      </Box>
    </CustomModal>
  );
  function isReadonly(field: string) {
    if (action === "Read") return true;
    if (!(field in readonly)) return false;
    return readonly[field as keyof FiltroVm] ?? false;
  }
  function onChange(changes: Partial<FiltroVm>) {
    setState((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function textFieldOnChange({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) {
    if (isReadonly(name)) return;
    onChange({ [name]: value });
  };
  function selectOnChange<Value = string>({ target: { name, value } }: SelectChangeEvent<Value>) {
    if (isReadonly(name)) return;
    onChange({ [name]: value });
  };
  function handleOnSubmit() {
    if (!isValid()) return;
    switch (action) {
      case "Read": {
        handleOnClose();
        break;
      }
      case "Create":
      case "Update": {
        setState((o) => ({ ...o, workingText: "Guardando..." }));
        triggerSave(
          {
            nombre: state.data.nombre!,
            modulo: state.data.modulo!,
            ambito: state.data.ambito!,
            proposition: state.data.proposition!,
          }
        ).then(
          (data) => {
            onClose(true, data);
          },
          (_error) => {
            setState((o) => ({
              ...o,
              error: { ...o.error, message: "Error guardando filtro" },
              workingText: undefined,
            }));
          }
        );
        break;
      }
      case "Delete": {
        setState((o) => ({ ...o, workingText: "Borrando..." }));
        triggerDelete(
          {
            id: state.data.id,
            nombre: state.data.nombre,
            modulo: state.data.modulo,
            observaciones: state.data.deletedObs,
          }
        ).then(
          (data) => {
            onClose(true, data);
          },
          (_error) => {
            setState((o) => ({
              ...o,
              error: { ...o.error, message: "Error borrando filtro" },
              workingText: undefined,
            }));
          }
        );
        break;
      }
    }
  }
  function isValid(): boolean {
    if (["Read", "Delete"].includes(action!)) return true;
    const error: Error = { data: {} };
    let faltantes: string[] = [];
    if (!data.nombre) {
      faltantes.push("Nombre");
      error.data.nombre = "Dato requerido";
    }
    if (!data.ambito) {
      faltantes.push("Ámbito");
      error.data.ambito = "Dato requerido";
    }
    if (!data.modulo) {
      faltantes.push("Módulo");
      error.data.modulo = "Dato requerido";
    }
    if (!data.proposition) {
      faltantes.push("Proposición");
      error.data.proposition = "Dato requerido";
    }
    if (faltantes.length > 0) {
      error.message = `Datos requeridos faltantes: ${faltantes.join(", ")}`;
      setState((o) => ({ ...o, error }));
      return false;
    }
    return true;
  }
  function handleOnClose() { onClose(false, data); }
  function handleCheckDisponibilidad() {
    setState((o) => ({ ...o, getDisponibilidad: true }));
  }
  function getInitialState(): State {
    const data: FiltroVm = { ...init };
    data.ambito ??= "todos";
    // Asegurar que los campos de texto siempre sean strings, no undefined
    data.nombre ??= '';
    data.deletedObs ??= '';
    return { data, error: { data: {} }, getDisponibilidad: !!data.nombre && !!data.modulo };
  }
}
