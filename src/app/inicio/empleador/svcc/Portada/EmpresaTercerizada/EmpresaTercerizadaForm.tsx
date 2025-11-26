import { EmpresaTercerizadaDTO } from "@/data/gestionEmpleadorAPI";
import CustomModal from "@/utils/ui/form/CustomModal";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import CustomButton from "@/utils/ui/button/CustomButton";
import { MoreHoriz } from "@mui/icons-material";
import Formato from "@/utils/Formato";

export type EmpresaTercerizadaDataErrors = Partial<Record<keyof EmpresaTercerizadaDTO, string>>;
export type EmpresaTercerizadaCommonFormErrors = {
  message?: string;
  data: EmpresaTercerizadaDataErrors;
};
export type EmpresaTercerizadaCommonFormProps = {
  disabled?: Partial<Record<keyof EmpresaTercerizadaDTO, boolean>>;
}
export type EmpresaTercerizadaFormProps = EmpresaTercerizadaCommonFormProps & {
  data: Partial<EmpresaTercerizadaDTO>;
  errors?: EmpresaTercerizadaDataErrors;
  onChange?: (changes: Partial<EmpresaTercerizadaDTO>) => void;
};
export type EmpresaTercerizadaModalFormWorkingState = {
  isWorking: boolean;
  message?: string;
}
export type OnConfirmCallbackInfo = {
  data: {
    state: Partial<EmpresaTercerizadaDTO>,
    setState: Dispatch<SetStateAction<Partial<EmpresaTercerizadaDTO>>>
  };
  working: {
    state: EmpresaTercerizadaModalFormWorkingState,
    setState: Dispatch<SetStateAction<EmpresaTercerizadaModalFormWorkingState>>
  };
  errors: {
    state: EmpresaTercerizadaCommonFormErrors,
    setState: Dispatch<SetStateAction<EmpresaTercerizadaCommonFormErrors>>
  };
}
export type EmpresaTercerizadaModalFormProps = EmpresaTercerizadaCommonFormProps & {
  action?: "create" | "read" | "update" | "delete";
  size?: "small" | "large" | "mid";
  title?: string;
  init?: Partial<EmpresaTercerizadaDTO>;
  errors?: EmpresaTercerizadaCommonFormErrors;
  onConfirm?: (info: OnConfirmCallbackInfo) => void;
  onCancel?: (data: Partial<EmpresaTercerizadaDTO>) => void;
};

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };

export function EmpresaTercerizadaForm({
  data, disabled, errors, onChange = () => {}
}: EmpresaTercerizadaFormProps) {
  return (
    <Grid container size={12} spacing={2}>
      <Grid size={3}>
        <TextField
          name="idEstablecimientoEmpresa"
          type="number"
          label="Establ. Empresa"
          value={data.idEstablecimientoEmpresa}
          disabled={disabled?.idEstablecimientoEmpresa}
          onChange={({ target: { value }}) => onChange({ idEstablecimientoEmpresa: Number(value) })}
          error={!!errors?.idEstablecimientoEmpresa}
          helperText={errors?.idEstablecimientoEmpresa}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip
                    title="Buscar Establ. Empresa"
                    arrow
                    slotProps={tooltip_SlotProps}
                  >
                    <IconButton
                      color="primary"
                      size="large"
                      disabled={disabled?.idEstablecimientoEmpresa}
                      // onClick={() => onLookup()}
                    >
                      <MoreHoriz />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }
          }}
          fullWidth
        />
      </Grid>
      <Grid size={9}>
        <TextField
          name="Placeholder"
          label="Establ. Empresa - Descripcion"
          disabled
          fullWidth
        />
      </Grid>
      <Grid size={4}>
        <TextField
          name="cuit"
          label="CUIT"
          placeholder="Ingrese CUIT (11 dígitos)"
          value={Formato.CUIP(data.cuit)}
          onChange={({ target: { value }}) => onChange({ cuit: Number((value || '').replace(/[^0-9]/g, ''))})}
          error={!!errors?.cuit}
          helperText={errors?.cuit}
          disabled={disabled?.cuit}
          fullWidth
        />
      </Grid>
      <Grid size={4}>
        <TextField
          name="ciiu"
          label="CIIU"
          value={data.ciiu}
          onChange={({ target: { value }}) => onChange({ ciiu: Number(value)})}
          error={!!errors?.ciiu}
          helperText={errors?.ciiu}
          fullWidth
          disabled={disabled?.ciiu}
          placeholder="CIIU"
        />
      </Grid>
      <Grid size={4}>
        <TextField
          name="cantidadTrabajadores"
          label="Cant. trabajadores"
          value={data.cantidadTrabajadores}
          onChange={({ target: { value }}) => onChange({ cantidadTrabajadores: Number(value)})}
          error={!!errors?.cantidadTrabajadores}
          helperText={errors?.cantidadTrabajadores}
          fullWidth
          disabled={disabled?.cantidadTrabajadores}
          placeholder="Cant. trabajadores"
        />
      </Grid>
    </Grid>
  );
}
const allDisabled: Partial<Record<keyof EmpresaTercerizadaDTO, boolean>> = {
  interno: true,
  idEstablecimientoEmpresa: true,
  cuit: true,
  ciiu: true,
  cantidadTrabajadores: true,
};
export default function EmpresaTercerizadaModalForm({
  action, title, size, init, disabled, errors: initErrors, onCancel = () => {}, onConfirm = () => {}
}: EmpresaTercerizadaModalFormProps) {
  const [data, setData] = useState<Partial<EmpresaTercerizadaDTO>>(JSON.parse(JSON.stringify({ ...init })));
  const [working, setWorking] = useState<EmpresaTercerizadaModalFormWorkingState>({ isWorking: false });
  const [errors, setErrors] = useState<EmpresaTercerizadaCommonFormErrors>({ ...initErrors, data: { ...initErrors?.data } });
  const onChange = useCallback((changes: Partial<EmpresaTercerizadaDTO>) => setData((o) => ({...o, ...changes})), []);

  return (
    <CustomModal
      open={!!action}
      onClose={handleOnClose}
      title={title}
      size={size}
    >
      <Grid container spacing={2} justifyContent="center">
        {errors.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{errors.message}</Typography>}
        <Grid container flexDirection="column" justifyContent="space-between" minHeight="500px">
          <EmpresaTercerizadaForm
            data={data}
            disabled={{ ...(action === "read" ? allDisabled : {}), ...disabled }}
            errors={errors.data}
            onChange={onChange}
          />
          <Grid container flexDirection="column" justifyContent="space-between">
            <Grid borderTop="1px solid #e9ecef" />
            <Grid container>
              {action !== "read" &&
                <CustomButton
                  onClick={handleOnConfirm}
                  disabled={working.isWorking}
                >
                  {working.message || (action === "delete" ? "Borrar" : "Guardar")}
                </CustomButton>
              }
              <CustomButton
                onClick={handleOnClose}
                color="secondary"
                disabled={working.isWorking}
              >
                {action === "read" ? "Cerrar" : "Cancelar"}
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
  function handleOnClose() { onCancel(data); }
  function handleOnConfirm() {
    onConfirm({
      data: { state: data, setState: setData },
      working: { state: working, setState: setWorking },
      errors: { state: errors, setState: setErrors },
    });
  }
}