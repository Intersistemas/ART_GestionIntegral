import { ReactNode, useState } from "react";
import { ContratistaDTO, EstablecimientoDeclaradoDTO, PuestoDTO, ResponsableDTO, SectorDTO } from "@/data/gestionEmpleadorAPI";
import { Card, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import Formato from "@/utils/Formato";
import { Form } from "@/utils/ui/form/Form";
import PuestoBrowse from "./Puesto/PuestoBrowse";
import SectorBrowse from "./Sector/SectorBrowse";
import ContratistaBrowse from "./Contratista/ContratistaBrowse";
import ResponsableBrowse from "./Responsable/ResponsableBrowse";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import { PuestoForm } from "./Puesto/PuestoForm";
import { SectorForm } from "./Sector/SectorForm";
import { ContratistaForm } from "./Contratista/ContratistaForm";
import { ResponsableForm } from "./Responsable/ResponsableForm";

type EditAction = "create" | "read" | "update" | "delete";
type EditState<T extends object> = {
  action?: EditAction,
  index?: number,
  data?: Partial<T>,
  disabled?: Partial<Record<keyof T, boolean>>,
  errors?: Partial<Record<keyof T, boolean>>,
  helpers?: Partial<Record<keyof T, ReactNode>>,
  message?: string;
};

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const EstablecimientoDeclaradoForm: Form<EstablecimientoDeclaradoDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { }
}) => {
  const [editPuesto, setEditPuesto] = useState<EditState<PuestoDTO>>({});
  const [editSector, setEditSector] = useState<EditState<SectorDTO>>({});
  const [editContratista, setEditContratista] = useState<EditState<ContratistaDTO>>({});
  const [editResponsable, setEditResponsable] = useState<EditState<ResponsableDTO>>({});

  return (
    <Grid container size={12} spacing={2} maxHeight="fit-content">
      <Grid size={3}>
        <TextField
          name="idEstablecimientoEmpresa"
          type="number"
          label="Establ. Empresa"
          value={data.idEstablecimientoEmpresa}
          disabled={disabled.idEstablecimientoEmpresa}
          onChange={({ target: { value } }) => onChange({ idEstablecimientoEmpresa: Number(value) })}
          error={errors.idEstablecimientoEmpresa}
          helperText={helpers.idEstablecimientoEmpresa}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip
                    title="Buscar Establ. Empresa"
                    arrow
                    slotProps={tooltip_SlotProps}
                  >
                    <div>
                      <IconButton
                        color="primary"
                        size="large"
                        disabled={disabled.idEstablecimientoEmpresa}
                      // onClick={() => onLookup()}
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
      </Grid>
      <Grid size={9}>
        <TextField
          name="Placeholder"
          label="Establ. Empresa - Descripcion"
          disabled
          fullWidth
        />
      </Grid>
      <Grid size={12}>
        <TextField
          name="descripcionActividad"
          label="Actividad"
          value={data.descripcionActividad}
          disabled={disabled.descripcionActividad}
          onChange={({ target: { value } }) => onChange({ descripcionActividad: value })}
          error={errors.descripcionActividad}
          helperText={helpers.descripcionActividad}
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          name="cantTrabEventualesProd"
          type="number"
          label="Cant. Trab. eventuales Prod."
          value={data.cantTrabEventualesProd}
          disabled={disabled.cantTrabEventualesProd}
          onChange={({ target: { value } }) => onChange({ cantTrabEventualesProd: value ? Number(value) : undefined })}
          error={errors.cantTrabEventualesProd}
          helperText={helpers.cantTrabEventualesProd}
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          name="cantTrabEventualesAdmin"
          type="number"
          label="Cant. Trab. eventuales Admin."
          value={data.cantTrabEventualesAdmin}
          disabled={disabled.cantTrabEventualesAdmin}
          onChange={({ target: { value } }) => onChange({ cantTrabEventualesAdmin: value ? Number(value) : undefined })}
          error={errors.cantTrabEventualesAdmin}
          helperText={helpers.cantTrabEventualesAdmin}
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          name="cantTrabPropiosProd"
          type="number"
          label="Cant. Trab. propios Prod."
          value={data.cantTrabPropiosProd}
          disabled={disabled.cantTrabPropiosProd}
          onChange={({ target: { value } }) => onChange({ cantTrabPropiosProd: value ? Number(value) : undefined })}
          error={errors.cantTrabPropiosProd}
          helperText={helpers.cantTrabPropiosProd}
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          name="cantTrabPropiosAdmin"
          type="number"
          label="Cant. Trab. propios Admin."
          value={data.cantTrabPropiosAdmin}
          disabled={disabled.cantTrabPropiosAdmin}
          onChange={({ target: { value } }) => onChange({ cantTrabPropiosAdmin: value ? Number(value) : undefined })}
          error={errors.cantTrabPropiosAdmin}
          helperText={helpers.cantTrabPropiosAdmin}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          name="mail"
          label="Correo"
          value={data.mail}
          disabled={disabled.mail}
          onChange={({ target: { value } }) => onChange({ mail: value })}
          error={errors.mail}
          helperText={helpers.mail}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          name="telefono"
          label="Teléfonos"
          value={data.telefono}
          disabled={disabled.telefono}
          onChange={({ target: { value } }) => onChange({ telefono: value })}
          error={errors.telefono}
          helperText={helpers.telefono}
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          name="cuilContacto"
          label="CUIL contacto"
          value={Formato.CUIP(data.cuilContacto)}
          disabled={disabled.cuilContacto}
          onChange={({ target: { value } }) => onChange({ cuilContacto: value ? Number((value || '').replace(/[^0-9]/g, '')) : undefined })}
          error={errors.cuilContacto}
          helperText={helpers.cuilContacto}
          fullWidth
        />
      </Grid>
      <Grid size={3} alignContent="center">
        <FormControlLabel
          name="permitidoFumar"
          label={<Typography fontWeight={700} color={disabled.permitidoFumar ? "textDisabled" : "#45661f"} fontSize="smaller">Permitido fumar</Typography>}
          disabled={disabled.permitidoFumar}
          control={
            <Checkbox
              checked={data.permitidoFumar === 1}
              indeterminate={data.permitidoFumar === undefined}
              onChange={({ target: { checked } }) => onChange({ permitidoFumar: checked ? 1 : 0 })}
            />
          }
        />
      </Grid>
      <Grid size={6} alignContent="center">
        <FormControlLabel
          name="lugaresCerradosParaFumar"
          label={<Typography fontWeight={700} color={disabled.lugaresCerradosParaFumar ? "textDisabled" : "#45661f"} fontSize="smaller">Lugares cerrados para fumar</Typography>}
          disabled={disabled.lugaresCerradosParaFumar}
          control={
            <Checkbox
              checked={data.lugaresCerradosParaFumar === 1}
              indeterminate={data.lugaresCerradosParaFumar === undefined}
              onChange={({ target: { checked } }) => onChange({ lugaresCerradosParaFumar: checked ? 1 : 0 })}
            />
          }
        />
      </Grid>
      <Grid size={12}>
        <Card variant="outlined">
          <Grid container spacing={2} padding={1.5}>
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Puestos</Typography></Grid>
            <Grid size={12}>
              <PuestoBrowse
                data={{ data: data.puestos ?? [] }}
                onCreate={disabled.puestos ? undefined : () => onPuestoAction("create")}
                onRead={(data, index) => () => onPuestoAction("read", data, index)}
                onUpdate={disabled.puestos ? undefined : (data, index) => () => onPuestoAction("update", data, index)}
                onDelete={disabled.puestos ? undefined : (data, index) => () => onPuestoAction("delete", data, index)}
              />
              <CustomModal
                open={!!editPuesto.action}
                onClose={handleEditPuestoOnClose}
                title={editPuestoTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editPuesto.action !== "read" &&
                      <CustomButton
                        onClick={handleEditPuestoOnConfirm}
                      >
                        {editPuesto.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditPuestoOnClose}
                      color="secondary"
                    >
                      {editPuesto.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editPuesto.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editPuesto.message}</Typography>}
                  <PuestoForm
                    data={editPuesto?.data ?? {}}
                    disabled={editPuesto?.disabled}
                    errors={editPuesto?.errors}
                    helpers={editPuesto?.helpers}
                    onChange={handlePuestoOnChange}
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
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Sectores</Typography></Grid>
            <Grid size={12}>
              <SectorBrowse
                data={{ data: data.sectores ?? [] }}
                onCreate={disabled.puestos ? undefined : () => onSectorAction("create")}
                onRead={(data, index) => () => onSectorAction("read", data, index)}
                onUpdate={disabled.puestos ? undefined : (data, index) => () => onSectorAction("update", data, index)}
                onDelete={disabled.puestos ? undefined : (data, index) => () => onSectorAction("delete", data, index)}
              />
              <CustomModal
                open={!!editSector.action}
                onClose={handleEditSectorOnClose}
                title={editSectorTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editSector.action !== "read" &&
                      <CustomButton
                        onClick={handleEditSectorOnConfirm}
                      >
                        {editSector.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditSectorOnClose}
                      color="secondary"
                    >
                      {editSector.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editSector.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editSector.message}</Typography>}
                  <SectorForm
                    data={editSector?.data ?? {}}
                    disabled={editSector?.disabled}
                    errors={editSector?.errors}
                    helpers={editSector?.helpers}
                    onChange={handleSectorOnChange}
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
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Contratistas</Typography></Grid>
            <Grid size={12}>
              <ContratistaBrowse
                data={{ data: data.contratistas ?? [] }}
                onCreate={disabled.puestos ? undefined : () => onContratistaAction("create")}
                onRead={(data, index) => () => onContratistaAction("read", data, index)}
                onUpdate={disabled.puestos ? undefined : (data, index) => () => onContratistaAction("update", data, index)}
                onDelete={disabled.puestos ? undefined : (data, index) => () => onContratistaAction("delete", data, index)}
              />
              <CustomModal
                open={!!editContratista.action}
                onClose={handleEditContratistaOnClose}
                title={editContratistaTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editContratista.action !== "read" &&
                      <CustomButton
                        onClick={handleEditContratistaOnConfirm}
                      >
                        {editContratista.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditContratistaOnClose}
                      color="secondary"
                    >
                      {editContratista.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editContratista.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editContratista.message}</Typography>}
                  <ContratistaForm
                    data={editContratista?.data ?? {}}
                    disabled={editContratista?.disabled}
                    errors={editContratista?.errors}
                    helpers={editContratista?.helpers}
                    onChange={handleContratistaOnChange}
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
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Responsables</Typography></Grid>
            <Grid size={12}>
              <ResponsableBrowse
                data={{ data: data.responsables ?? [] }}
                onCreate={disabled.puestos ? undefined : () => onResponsableAction("create")}
                onRead={(data, index) => () => onResponsableAction("read", data, index)}
                onUpdate={disabled.puestos ? undefined : (data, index) => () => onResponsableAction("update", data, index)}
                onDelete={disabled.puestos ? undefined : (data, index) => () => onResponsableAction("delete", data, index)}
              />
              <CustomModal
                open={!!editResponsable.action}
                onClose={handleEditResponsableOnClose}
                title={editResponsableTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editResponsable.action !== "read" &&
                      <CustomButton
                        onClick={handleEditResponsableOnConfirm}
                      >
                        {editResponsable.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditResponsableOnClose}
                      color="secondary"
                    >
                      {editResponsable.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editResponsable.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editResponsable.message}</Typography>}
                  <ResponsableForm
                    data={editResponsable?.data ?? {}}
                    disabled={editResponsable?.disabled}
                    errors={editResponsable?.errors}
                    helpers={editResponsable?.helpers}
                    onChange={handleResponsableOnChange}
                  />
                </Grid>
              </CustomModal>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
  //#region funciones Puesto
  function editPuestoTitle() {
    const value = "Puesto";
    switch (editPuesto.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handlePuestoOnChange(changes: Partial<PuestoDTO>) {
    setEditPuesto((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditPuestoOnClose() { setEditPuesto({}); }
  function handleEditPuestoOnConfirm() {
    const puestos = [...data.puestos ?? []];
    switch (editPuesto.action) {
      case "create": {
        puestos.push(editPuesto.data as PuestoDTO);
        onChange({ puestos });
        handleEditPuestoOnClose();
        break;
      }
      case "update": {
        puestos[editPuesto.index!] = editPuesto.data as PuestoDTO
        onChange({ puestos });
        handleEditPuestoOnClose();
        break;
      }
      case "delete": {
        puestos.splice(editPuesto.index!, 1);
        onChange({ puestos });
        handleEditPuestoOnClose();
        break;
      }
      case "read": {
        handleEditPuestoOnClose();
        break;
      }
    }
  }
  function onPuestoAction(action: EditAction, data?: PuestoDTO, index?: number) {
    setEditPuesto({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          nombre: true,
          ciuo: true,
        }
        : {},
    });
  }
  //#endregion funciones Puesto
  //#region funciones Sector
  function editSectorTitle() {
    const value = "Sector";
    switch (editSector.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleSectorOnChange(changes: Partial<SectorDTO>) {
    setEditSector((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditSectorOnClose() { setEditSector({}); }
  function handleEditSectorOnConfirm() {
    const sectores = [...data.sectores ?? []];
    switch (editSector.action) {
      case "create": {
        sectores.push(editSector.data as SectorDTO);
        onChange({ sectores });
        handleEditSectorOnClose();
        break;
      }
      case "update": {
        sectores[editSector.index!] = editSector.data as SectorDTO
        onChange({ sectores });
        handleEditSectorOnClose();
        break;
      }
      case "delete": {
        sectores.splice(editSector.index!, 1);
        onChange({ sectores });
        handleEditSectorOnClose();
        break;
      }
      case "read": {
        handleEditSectorOnClose();
        break;
      }
    }
  }
  function onSectorAction(action: EditAction, data?: SectorDTO, index?: number) {
    setEditSector({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          nombre: true,
          ciiu: true,
        }
        : {},
    });
  }
  //#endregion funciones Sector
  //#region funciones Contratista
  function editContratistaTitle() {
    const value = "Contratista";
    switch (editContratista.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleContratistaOnChange(changes: Partial<ContratistaDTO>) {
    setEditContratista((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditContratistaOnClose() { setEditContratista({}); }
  function handleEditContratistaOnConfirm() {
    const contratistas = [...data.contratistas ?? []];
    switch (editContratista.action) {
      case "create": {
        contratistas.push(editContratista.data as ContratistaDTO);
        onChange({ contratistas });
        handleEditContratistaOnClose();
        break;
      }
      case "update": {
        contratistas[editContratista.index!] = editContratista.data as ContratistaDTO
        onChange({ contratistas });
        handleEditContratistaOnClose();
        break;
      }
      case "delete": {
        contratistas.splice(editContratista.index!, 1);
        onChange({ contratistas });
        handleEditContratistaOnClose();
        break;
      }
      case "read": {
        handleEditContratistaOnClose();
        break;
      }
    }
  }
  function onContratistaAction(action: EditAction, data?: ContratistaDTO, index?: number) {
    setEditContratista({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cuit: true,
          ciiu: true,
          cantidadTrabajadores: true,
        }
        : {},
    });
  }
  //#endregion funciones Contratista
  //#region funciones Responsable
  function editResponsableTitle() {
    const value = "Responsable";
    switch (editResponsable.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleResponsableOnChange(changes: Partial<ResponsableDTO>) {
    setEditResponsable((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditResponsableOnClose() { setEditResponsable({}); }
  function handleEditResponsableOnConfirm() {
    const responsables = [...data.responsables ?? []];
    switch (editResponsable.action) {
      case "create": {
        responsables.push(editResponsable.data as ResponsableDTO);
        onChange({ responsables });
        handleEditResponsableOnClose();
        break;
      }
      case "update": {
        responsables[editResponsable.index!] = editResponsable.data as ResponsableDTO
        onChange({ responsables });
        handleEditResponsableOnClose();
        break;
      }
      case "delete": {
        responsables.splice(editResponsable.index!, 1);
        onChange({ responsables });
        handleEditResponsableOnClose();
        break;
      }
      case "read": {
        handleEditResponsableOnClose();
        break;
      }
    }
  }
  function onResponsableAction(action: EditAction, data?: ResponsableDTO, index?: number) {
    setEditResponsable({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cuilCuit: true,
          idContratacion: true,
          idRepresentacion: true,
          idTipoProfesionalResponsable: true,
          matricula: true,
          cantHorasAsignadas: true,
        }
        : {},
    });
  }
  //#endregion funciones Responsable
}

export default EstablecimientoDeclaradoForm;
