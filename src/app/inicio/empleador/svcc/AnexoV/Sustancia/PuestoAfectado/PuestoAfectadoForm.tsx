import { useState } from "react";
import { Card, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { ElementoProteccionDTO, MedidaPreventivaDTO, PuestoAfectadoDTO } from "@/data/gestionEmpleadorAPI";
import { Form, FormProps } from "@/utils/ui/form/Form";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import { DeepPartial } from "@/utils/utils";
import MedidaPreventivaForm from "./MedidaPreventiva/MedidaPreventivaForm";
import MedidaPreventivaBrowse from "./MedidaPreventiva/MedidaPreventivaBrowse";
import ElementoProteccionBrowse from "./ElementoProteccion/ElementoProteccionBrowse";
import ElementoProteccionForm from "./ElementoProteccion/ElementoProteccionForm";
import { useSustanciaContext } from "../context";
import PuestoBrowse from "../../../Portada/EstablecimientoDeclarado/Puesto/PuestoBrowse";

type EditAction = "create" | "read" | "update" | "delete";
type EditState<T extends object> = Omit<FormProps<T>, "onChange"> & {
  action?: EditAction,
  index?: number,
  message?: string;
};
const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const PuestoAfectadoForm: Form<PuestoAfectadoDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { }
}) => {
  const [editMedidaPreventiva, setEditMedidaPreventiva] = useState<EditState<MedidaPreventivaDTO>>({ data: {} });
  const [editElementoProteccion, setEditElementoProteccion] = useState<EditState<ElementoProteccionDTO>>({ data: {} });

  const { establecimientoDeclarado } = useSustanciaContext();
  const puestos = establecimientoDeclarado.data?.puestos ?? [];
  const puesto = puestos.find((p) => p.interno === data.puestoInterno);

  const [lookupPuesto, setLookupPuesto] = useState<boolean>(false);

  return (
    <Grid container size={12} spacing={2} maxHeight="fit-content">
      <Grid size={3}>
        <TextField
          name="puestoInterno"
          type="number"
          label="Puesto"
          value={data.puestoInterno ?? ""}
          disabled={disabled.puestoInterno}
          onChange={({ target: { value } }) => onChange({ puestoInterno: Number(value) })}
          error={errors.puestoInterno}
          helperText={helpers.puestoInterno}
          slotProps={{
            inputLabel: { shrink: data.puestoInterno != null },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip
                    title="Buscar Puesto"
                    arrow
                    slotProps={tooltip_SlotProps}
                  >
                    <div>
                      <IconButton
                        color="primary"
                        size="large"
                        disabled={disabled.puestoInterno}
                        onClick={() => setLookupPuesto(true)}
                      >
                        <MoreHoriz />
                      </IconButton>
                    </div>
                  </Tooltip>
                </InputAdornment>
              ),
            }
          }}
          fullWidth
        />
        <CustomModal
          open={lookupPuesto}
          onClose={() => setLookupPuesto(false)}
          title="Selección de puesto"
          size="large"
          actions={(
            <Grid container spacing={2}>
              <CustomButton
                onClick={() => setLookupPuesto(false)}
                color="secondary"
              >
                Cancelar
              </CustomButton>
            </Grid>
          )}
        >
          <Grid container spacing={2} justifyContent="center" minHeight="500px">
            <Grid size={12}>
              <PuestoBrowse
                isLoading={establecimientoDeclarado.isLoading || establecimientoDeclarado.isValidating}
                data={{ data: puestos }}
                onSelect={(select) => () => {
                  onChange({ puestoInterno: select.interno });
                  setLookupPuesto(false);
                }}
              />
            </Grid>
          </Grid>
        </CustomModal>
      </Grid>
      <Grid size={9}>
        <TextField
          label="Puesto - Descripcion"
          value={[puesto?.ciuo, puesto?.nombre].filter(e => e !== undefined).join(" - ")}
          disabled
          fullWidth
        />
      </Grid>
      <Grid size={12}>
        <TextField
          name="descripcionActividad"
          label="Actividad"
          value={data.descripcionActividad ?? ""}
          disabled={disabled.descripcionActividad}
          onChange={({ target: { value } }) => onChange({ descripcionActividad: value })}
          error={errors.descripcionActividad}
          helperText={helpers.descripcionActividad}
          fullWidth
        />
      </Grid>
      <Grid size={3} alignContent="center">
        <FormControlLabel
          name="informaSobreRiesgos"
          label={<Typography fontWeight={700} color={disabled.informaSobreRiesgos ? "textDisabled" : "#45661f"} fontSize="smaller">Informa sobre riesgos</Typography>}
          disabled={disabled.informaSobreRiesgos}
          control={
            <Checkbox
              checked={data.informaSobreRiesgos}
              indeterminate={data.informaSobreRiesgos === undefined}
              onChange={({ target: { checked } }) => onChange({ informaSobreRiesgos: checked })}
            />
          }
        />
      </Grid>
      <Grid size={3} alignContent="center">
        <FormControlLabel
          name="capacitacionSobreRiesgos"
          label={<Typography fontWeight={700} color={disabled.capacitacionSobreRiesgos ? "textDisabled" : "#45661f"} fontSize="smaller">Capacitacion sobre riesgos</Typography>}
          disabled={disabled.capacitacionSobreRiesgos}
          control={
            <Checkbox
              checked={data.capacitacionSobreRiesgos}
              indeterminate={data.capacitacionSobreRiesgos === undefined}
              onChange={({ target: { checked } }) => onChange({ capacitacionSobreRiesgos: checked })}
            />
          }
        />
      </Grid>
      <Grid size={3} alignContent="center">
        <FormControlLabel
          name="entregaElementosDeProteccion"
          label={<Typography fontWeight={700} color={disabled.entregaElementosDeProteccion ? "textDisabled" : "#45661f"} fontSize="smaller">Entrega elementos de proteccion</Typography>}
          disabled={disabled.entregaElementosDeProteccion}
          control={
            <Checkbox
              checked={data.entregaElementosDeProteccion}
              indeterminate={data.entregaElementosDeProteccion === undefined}
              onChange={({ target: { checked } }) => onChange({ entregaElementosDeProteccion: checked })}
            />
          }
        />
      </Grid>
      <Grid size={3} alignContent="center">
        <FormControlLabel
          name="licenciaEspecial"
          label={<Typography fontWeight={700} color={disabled.licenciaEspecial ? "textDisabled" : "#45661f"} fontSize="smaller">Licencia especial</Typography>}
          disabled={disabled.licenciaEspecial}
          control={
            <Checkbox
              checked={data.licenciaEspecial}
              indeterminate={data.licenciaEspecial === undefined}
              onChange={({ target: { checked } }) => onChange({ licenciaEspecial: checked })}
            />
          }
        />
      </Grid>
      <Grid size={12}>
        <TextField
          name="descripcionEstudios"
          label="Descripcion estudios"
          value={data.descripcionEstudios ?? ""}
          disabled={disabled.descripcionEstudios}
          onChange={({ target: { value } }) => onChange({ descripcionEstudios: value })}
          error={errors.descripcionEstudios}
          helperText={helpers.descripcionEstudios}
          fullWidth
        />
      </Grid>

      <Grid size={12}>
        <Card variant="outlined">
          <Grid container spacing={2} padding={1.5}>
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Medidas Preventivas del Puesto</Typography></Grid>
            <Grid size={12}>
              <MedidaPreventivaBrowse
                data={{ data: data.medidasPreventivasDelPuesto as MedidaPreventivaDTO[] ?? [] }}
                onCreate={disabled.medidasPreventivasDelPuesto ? undefined : () => onMedidaPreventivaAction("create")}
                onRead={(data, index) => () => onMedidaPreventivaAction("read", data, index)}
                onUpdate={disabled.medidasPreventivasDelPuesto ? undefined : (data, index) => () => onMedidaPreventivaAction("update", data, index)}
                onDelete={disabled.medidasPreventivasDelPuesto ? undefined : (data, index) => () => onMedidaPreventivaAction("delete", data, index)}
              />
              <CustomModal
                open={!!editMedidaPreventiva.action}
                onClose={handleEditMedidaPreventivaOnClose}
                title={editMedidaPreventivaTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editMedidaPreventiva.action !== "read" &&
                      <CustomButton
                        onClick={handleEditMedidaPreventivaOnConfirm}
                      >
                        {editMedidaPreventiva.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditMedidaPreventivaOnClose}
                      color="secondary"
                    >
                      {editMedidaPreventiva.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editMedidaPreventiva.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editMedidaPreventiva.message}</Typography>}
                  <MedidaPreventivaForm
                    data={editMedidaPreventiva.data}
                    disabled={editMedidaPreventiva.disabled}
                    errors={editMedidaPreventiva.errors}
                    helpers={editMedidaPreventiva.helpers}
                    onChange={handleMedidaPreventivaOnChange}
                  />
                </Grid>
              </CustomModal>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card variant="outlined">
          <Grid container spacing={2} padding={1.5}>
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Elementos Proteccion Personal</Typography></Grid>
            <Grid size={12}>
              <ElementoProteccionBrowse
                data={{ data: data.elementosProteccionPersonal as ElementoProteccionDTO[] ?? [] }}
                onCreate={disabled.elementosProteccionPersonal ? undefined : () => onElementoProteccionAction("create")}
                onRead={(data, index) => () => onElementoProteccionAction("read", data, index)}
                onUpdate={disabled.elementosProteccionPersonal ? undefined : (data, index) => () => onElementoProteccionAction("update", data, index)}
                onDelete={disabled.elementosProteccionPersonal ? undefined : (data, index) => () => onElementoProteccionAction("delete", data, index)}
              />
              <CustomModal
                open={!!editElementoProteccion.action}
                onClose={handleEditElementoProteccionOnClose}
                title={editElementoProteccionTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editElementoProteccion.action !== "read" &&
                      <CustomButton
                        onClick={handleEditElementoProteccionOnConfirm}
                      >
                        {editElementoProteccion.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditElementoProteccionOnClose}
                      color="secondary"
                    >
                      {editElementoProteccion.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editElementoProteccion.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editElementoProteccion.message}</Typography>}
                  <ElementoProteccionForm
                    data={editElementoProteccion.data}
                    disabled={editElementoProteccion.disabled}
                    errors={editElementoProteccion.errors}
                    helpers={editElementoProteccion.helpers}
                    onChange={handleElementoProteccionOnChange}
                  />
                </Grid>
              </CustomModal>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
  //#region funciones Medida Preventiva
  function editMedidaPreventivaTitle() {
    const value = "Medida Preventiva";
    switch (editMedidaPreventiva.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleMedidaPreventivaOnChange(changes: DeepPartial<MedidaPreventivaDTO>) {
    setEditMedidaPreventiva((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditMedidaPreventivaOnClose() { setEditMedidaPreventiva({ data: {} }); }
  function handleEditMedidaPreventivaOnConfirm() {
    const medidasPreventivasDelPuesto = [...data.medidasPreventivasDelPuesto ?? []];
    switch (editMedidaPreventiva.action) {
      case "create": {
        medidasPreventivasDelPuesto.push(editMedidaPreventiva.data as MedidaPreventivaDTO);
        onChange({ medidasPreventivasDelPuesto });
        handleEditMedidaPreventivaOnClose();
        break;
      }
      case "update": {
        medidasPreventivasDelPuesto[editMedidaPreventiva.index!] = editMedidaPreventiva.data as MedidaPreventivaDTO
        onChange({ medidasPreventivasDelPuesto });
        handleEditMedidaPreventivaOnClose();
        break;
      }
      case "delete": {
        medidasPreventivasDelPuesto.splice(editMedidaPreventiva.index!, 1);
        onChange({ medidasPreventivasDelPuesto });
        handleEditMedidaPreventivaOnClose();
        break;
      }
      case "read": {
        handleEditMedidaPreventivaOnClose();
        break;
      }
    }
  }
  function onMedidaPreventivaAction(action: EditAction, data?: MedidaPreventivaDTO, index?: number) {
    setEditMedidaPreventiva({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          idMedidaPreventivaDeclarado: true,
        }
        : {},
    });
  }
  //#endregion funciones Medida Preventiva
  //#region funciones Elemento Proteccion
  function editElementoProteccionTitle() {
    const value = "Elemento Proteccion";
    switch (editElementoProteccion.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleElementoProteccionOnChange(changes: DeepPartial<ElementoProteccionDTO>) {
    setEditElementoProteccion((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditElementoProteccionOnClose() { setEditElementoProteccion({ data: {} }); }
  function handleEditElementoProteccionOnConfirm() {
    const elementosProteccionPersonal = [...data.elementosProteccionPersonal ?? []];
    switch (editElementoProteccion.action) {
      case "create": {
        elementosProteccionPersonal.push(editElementoProteccion.data as ElementoProteccionDTO);
        onChange({ elementosProteccionPersonal });
        handleEditElementoProteccionOnClose();
        break;
      }
      case "update": {
        elementosProteccionPersonal[editElementoProteccion.index!] = editElementoProteccion.data as ElementoProteccionDTO
        onChange({ elementosProteccionPersonal });
        handleEditElementoProteccionOnClose();
        break;
      }
      case "delete": {
        elementosProteccionPersonal.splice(editElementoProteccion.index!, 1);
        onChange({ elementosProteccionPersonal });
        handleEditElementoProteccionOnClose();
        break;
      }
      case "read": {
        handleEditElementoProteccionOnClose();
        break;
      }
    }
  }
  function onElementoProteccionAction(action: EditAction, data?: ElementoProteccionDTO, index?: number) {
    setEditElementoProteccion({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          idElementoDeProteccionDeclarado: true,
        }
        : {},
    });
  }
  //#endregion funciones Elemento Proteccion
}

export default PuestoAfectadoForm;
