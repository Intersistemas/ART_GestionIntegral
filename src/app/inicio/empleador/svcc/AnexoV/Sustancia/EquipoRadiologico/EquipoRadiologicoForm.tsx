import { useState } from "react";
import { Card, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { EquipoRadiologicoDTO, ResponsableUsoDTO, ResponsableInstalacionDTO, EncargadoProteccionDTO } from "@/data/gestionEmpleadorAPI";
import { Form, FormProps } from "@/utils/ui/form/Form";
import { MetodosDosimetria_Array, TCaracteristicasEquipos_Array, TiposDosimetria_Array, TMetodosProcesadosImagenes_Array, TTiposEquipos_Array, TTiposFuentesEquipos_Array, TTiposRadiaciones_Array } from "@/data/SVCC/constants";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import Formato from "@/utils/Formato";
import ResponsableUsoBrowse from "./ResponsableUso/ResponsableUsoBrowse";
import ResponsableUsoForm from "./ResponsableUso/ResponsableUsoForm";
import ResponsableInstalacionBrowse from "./ResponsableInstalacion/ResponsableInstalacionBrowse";
import ResponsableInstalacionForm from "./ResponsableInstalacion/ResponsableInstalacionForm";
import EncargadoProteccionBrowse from "./EncargadoProteccion/EncargadoProteccionBrowse";
import EncargadoProteccionForm from "./EncargadoProteccion/EncargadoProteccionForm";
import { DeepPartial } from "@/utils/utils";

type EditAction = "create" | "read" | "update" | "delete";
type EditState<T extends object> = Omit<FormProps<T>, "onChange"> & {
  action?: EditAction,
  index?: number,
  message?: string;
};

export const EquipoRadiologicoForm: Form<EquipoRadiologicoDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { }
}) => {
  const [editResponsableUso, setEditResponsableUso] = useState<EditState<ResponsableUsoDTO>>({ data: {} });
  const [editResponsableInstalacion, setEditResponsableInstalacion] = useState<EditState<ResponsableInstalacionDTO>>({ data: {} });
  const [editEncargadoProteccion, setEditEncargadoProteccion] = useState<EditState<EncargadoProteccionDTO>>({ data: {} });

  return (
    <Grid container size={12} spacing={2} maxHeight="fit-content">
      <Grid size={4}>
        <FormControl
          fullWidth
          error={errors.idTipoEquipo}
          disabled={disabled.idTipoEquipo}
        >
          <InputLabel>Tipo equipo</InputLabel>
          <Select
            name="idTipoEquipo"
            value={data.idTipoEquipo}
            label="Tipo equipo"
            onChange={({ target: { value } }) => onChange({ idTipoEquipo: value === undefined ? undefined : Number(value) })}
            displayEmpty
          >
            {TTiposEquipos_Array.map((e, i) => (<MenuItem key={i} value={e.interno}>{e.descripcion}</MenuItem>))}
          </Select>
          {helpers.idTipoEquipo && (
            <Typography
              variant="caption"
              color={errors.idTipoEquipo ? "error" : "info"}
              sx={{ ml: 2, mt: 0.5 }}
            >
              {helpers.idTipoEquipo}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl
          fullWidth
          error={errors.idCaracteristicaEquipo}
          disabled={disabled.idCaracteristicaEquipo}
        >
          <InputLabel>Caracteristica equipo</InputLabel>
          <Select
            name="idCaracteristicaEquipo"
            value={data.idCaracteristicaEquipo}
            label="Caracteristica equipo"
            onChange={({ target: { value } }) => onChange({ idCaracteristicaEquipo: value === undefined ? undefined : Number(value) })}
            displayEmpty
          >
            {TCaracteristicasEquipos_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
          </Select>
          {helpers.idCaracteristicaEquipo && (
            <Typography
              variant="caption"
              color={errors.idCaracteristicaEquipo ? "error" : "info"}
              sx={{ ml: 2, mt: 0.5 }}
            >
              {helpers.idCaracteristicaEquipo}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl
          fullWidth
          error={errors.idTipoRadiacion}
          disabled={disabled.idTipoRadiacion}
        >
          <InputLabel>Tipo radiacion</InputLabel>
          <Select
            name="idTipoRadiacion"
            value={data.idTipoRadiacion}
            label="Tipo radiacion"
            onChange={({ target: { value } }) => onChange({ idTipoRadiacion: value === undefined ? undefined : Number(value) })}
            displayEmpty
          >
            {TTiposRadiaciones_Array.map((e, i) => (<MenuItem key={i} value={e.interno}>{e.descripcion}</MenuItem>))}
          </Select>
          {helpers.idTipoRadiacion && (
            <Typography
              variant="caption"
              color={errors.idTipoRadiacion ? "error" : "info"}
              sx={{ ml: 2, mt: 0.5 }}
            >
              {helpers.idTipoRadiacion}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          name="marca"
          label="Marca"
          value={data.marca}
          disabled={disabled.marca}
          onChange={({ target: { value } }) => onChange({ marca: value })}
          error={errors.marca}
          helperText={helpers.marca}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          name="modelo"
          label="Modelo"
          value={data.modelo}
          disabled={disabled.modelo}
          onChange={({ target: { value } }) => onChange({ modelo: value })}
          error={errors.modelo}
          helperText={helpers.modelo}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          name="actividad"
          label="Actividad"
          value={data.actividad}
          disabled={disabled.actividad}
          onChange={({ target: { value } }) => onChange({ actividad: value })}
          error={errors.actividad}
          helperText={helpers.actividad}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          name="radioisotopoFuente"
          label="Radioisotopo fuente"
          value={data.radioisotopoFuente}
          disabled={disabled.radioisotopoFuente}
          onChange={({ target: { value } }) => onChange({ radioisotopoFuente: value })}
          error={errors.radioisotopoFuente}
          helperText={helpers.radioisotopoFuente}
          fullWidth
        />
      </Grid>
      <Grid size={4}>
        <FormControl
          fullWidth
          error={errors.idTipoFuente}
          disabled={disabled.idTipoFuente}
        >
          <InputLabel>Tipo fuente</InputLabel>
          <Select
            name="idTipoFuente"
            value={data.idTipoFuente}
            label="Tipo fuente"
            onChange={({ target: { value } }) => onChange({ idTipoFuente: value === undefined ? undefined : Number(value) })}
            displayEmpty
          >
            {TTiposFuentesEquipos_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
          </Select>
          {helpers.idTipoFuente && (
            <Typography
              variant="caption"
              color={errors.idTipoFuente ? "error" : "info"}
              sx={{ ml: 2, mt: 0.5 }}
            >
              {helpers.idTipoFuente}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={4}>
        <TextField
          name="potenciaEquipoKVP"
          type="number"
          label="Potencia equipo KVP"
          value={data.potenciaEquipoKVP}
          disabled={disabled.potenciaEquipoKVP}
          onChange={({ target: { value } }) => onChange({ potenciaEquipoKVP: Number(value) })}
          error={errors.potenciaEquipoKVP}
          helperText={helpers.potenciaEquipoKVP}
          fullWidth
        />
      </Grid>
      <Grid size={4}>
        <TextField
          name="potenciaEquipomAp"
          type="number"
          label="Potencia Equipo mAp"
          value={data.potenciaEquipomAp}
          disabled={disabled.potenciaEquipomAp}
          onChange={({ target: { value } }) => onChange({ potenciaEquipomAp: Number(value) })}
          error={errors.potenciaEquipomAp}
          helperText={helpers.potenciaEquipomAp}
          fullWidth
        />
      </Grid>
      <Grid size={4}>
        <TextField
          name="potenciaEquipoMeV"
          type="number"
          label="Potencia equipo MeV"
          value={data.potenciaEquipoMeV}
          disabled={disabled.potenciaEquipoMeV}
          onChange={({ target: { value } }) => onChange({ potenciaEquipoMeV: Number(value) })}
          error={errors.potenciaEquipoMeV}
          helperText={helpers.potenciaEquipoMeV}
          fullWidth
        />
      </Grid>
      <Grid size={4} alignContent="center">
        <FormControlLabel
          name="procesamientoImagenes"
          label={<Typography fontWeight={700} color={disabled.procesamientoImagenes ? "textDisabled" : "#45661f"} fontSize="smaller">Procesamiento imagenes</Typography>}
          disabled={disabled.procesamientoImagenes}
          control={
            <Checkbox
              checked={data.procesamientoImagenes}
              indeterminate={data.procesamientoImagenes === undefined}
              onChange={({ target: { checked } }) => onChange({ procesamientoImagenes: checked })}
            />
          }
        />
      </Grid>
      <Grid size={4}>
        <FormControl
          fullWidth
          error={errors.metodoProcesamiento}
          disabled={disabled.metodoProcesamiento}
        >
          <InputLabel>Metodo procesamiento imágenes</InputLabel>
          <Select
            name="metodoProcesamiento"
            value={data.metodoProcesamiento}
            label="Metodo procesamiento imágenes"
            onChange={({ target: { value } }) => onChange({ metodoProcesamiento: value === undefined ? undefined : Number(value) })}
            displayEmpty
          >
            {TMetodosProcesadosImagenes_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
          </Select>
          {helpers.metodoProcesamiento && (
            <Typography
              variant="caption"
              color={errors.metodoProcesamiento ? "error" : "info"}
              sx={{ ml: 2, mt: 0.5 }}
            >
              {helpers.metodoProcesamiento}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          name="observaciones"
          label="Observaciones"
          value={data.observaciones}
          disabled={disabled.observaciones}
          onChange={({ target: { value } }) => onChange({ observaciones: value })}
          error={errors.observaciones}
          helperText={helpers.observaciones}
          multiline
          rows={3}
          fullWidth
        />
      </Grid>
      <Grid size={12}>
        <Card variant="outlined">
          <Grid container spacing={2} padding={1.5}>
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Dosimetria</Typography></Grid>
            <Grid container size={12} spacing={2}>
              <Grid size={3}>
                <TextField
                  name="cantidadDePersonal"
                  type="number"
                  label="Cantidad de personal"
                  value={data.dosimetria?.cantidadDePersonal}
                  disabled={disabled.dosimetria?.cantidadDePersonal}
                  onChange={({ target: { value } }) => onChange({ dosimetria: { cantidadDePersonal: Number(value) } })}
                  error={errors.dosimetria?.cantidadDePersonal}
                  helperText={helpers.dosimetria?.cantidadDePersonal}
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  name="cuitResponsable"
                  label="CUIT responsable"
                  value={Formato.CUIP(data.dosimetria?.cuitResponsable)}
                  disabled={disabled.dosimetria?.cuitResponsable}
                  onChange={({ target: { value } }) => onChange({ dosimetria: { cuitResponsable: value ? Number((value || '').replace(/[^0-9]/g, '')) : undefined } })}
                  error={errors.dosimetria?.cuitResponsable}
                  helperText={helpers.dosimetria?.cuitResponsable}
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <FormControl
                  fullWidth
                  error={errors.dosimetria?.idTipoDosimetria}
                  disabled={disabled.dosimetria?.idTipoDosimetria}
                >
                  <InputLabel>Tipo dosimetria</InputLabel>
                  <Select
                    name="idTipoDosimetria"
                    value={data.dosimetria?.idTipoDosimetria}
                    label="Tipo dosimetria"
                    onChange={({ target: { value } }) => onChange({ dosimetria: { idTipoDosimetria: value === undefined ? undefined : Number(value) } })}
                    displayEmpty
                  >
                    {TiposDosimetria_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
                  </Select>
                  {helpers.dosimetria?.idTipoDosimetria && (
                    <Typography
                      variant="caption"
                      color={errors.dosimetria?.idTipoDosimetria ? "error" : "info"}
                      sx={{ ml: 2, mt: 0.5 }}
                    >
                      {helpers.dosimetria?.idTipoDosimetria}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid size={3}>
                <FormControl
                  fullWidth
                  error={errors.dosimetria?.idMetodoDosimetria}
                  disabled={disabled.dosimetria?.idMetodoDosimetria}
                >
                  <InputLabel>Metodo dosimetria</InputLabel>
                  <Select
                    name="idMetodoDosimetria"
                    value={data.dosimetria?.idMetodoDosimetria}
                    label="Metodo dosimetria"
                    onChange={({ target: { value } }) => onChange({ dosimetria: { idMetodoDosimetria: value === undefined ? undefined : Number(value) } })}
                    displayEmpty
                  >
                    {MetodosDosimetria_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
                  </Select>
                  {helpers.dosimetria?.idMetodoDosimetria && (
                    <Typography
                      variant="caption"
                      color={errors.dosimetria?.idMetodoDosimetria ? "error" : "info"}
                      sx={{ ml: 2, mt: 0.5 }}
                    >
                      {helpers.dosimetria?.idMetodoDosimetria}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card variant="outlined">
          <Grid container spacing={2} padding={1.5}>
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Responsables de Uso</Typography></Grid>
            <Grid size={12}>
              <ResponsableUsoBrowse
                data={{ data: data.responsablesDeUso as ResponsableUsoDTO[] ?? [] }}
                onCreate={disabled.responsablesDeUso ? undefined : () => onResponsableUsoAction("create")}
                onRead={(data, index) => () => onResponsableUsoAction("read", data, index)}
                onUpdate={disabled.responsablesDeUso ? undefined : (data, index) => () => onResponsableUsoAction("update", data, index)}
                onDelete={disabled.responsablesDeUso ? undefined : (data, index) => () => onResponsableUsoAction("delete", data, index)}
              />
              <CustomModal
                open={!!editResponsableUso.action}
                onClose={handleEditResponsableUsoOnClose}
                title={editResponsableUsoTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editResponsableUso.action !== "read" &&
                      <CustomButton
                        onClick={handleEditResponsableUsoOnConfirm}
                      >
                        {editResponsableUso.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditResponsableUsoOnClose}
                      color="secondary"
                    >
                      {editResponsableUso.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editResponsableUso.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editResponsableUso.message}</Typography>}
                  <ResponsableUsoForm
                    data={editResponsableUso.data}
                    disabled={editResponsableUso.disabled}
                    errors={editResponsableUso.errors}
                    helpers={editResponsableUso.helpers}
                    onChange={handleResponsableUsoOnChange}
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
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Responsables de Instalacion</Typography></Grid>
            <Grid size={12}>
              <ResponsableInstalacionBrowse
                data={{ data: data.responsablesDeInstalacion as ResponsableInstalacionDTO[] ?? [] }}
                onCreate={disabled.responsablesDeInstalacion ? undefined : () => onResponsableInstalacionAction("create")}
                onRead={(data, index) => () => onResponsableInstalacionAction("read", data, index)}
                onUpdate={disabled.responsablesDeInstalacion ? undefined : (data, index) => () => onResponsableInstalacionAction("update", data, index)}
                onDelete={disabled.responsablesDeInstalacion ? undefined : (data, index) => () => onResponsableInstalacionAction("delete", data, index)}
              />
              <CustomModal
                open={!!editResponsableInstalacion.action}
                onClose={handleEditResponsableInstalacionOnClose}
                title={editResponsableInstalacionTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editResponsableInstalacion.action !== "read" &&
                      <CustomButton
                        onClick={handleEditResponsableInstalacionOnConfirm}
                      >
                        {editResponsableInstalacion.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditResponsableInstalacionOnClose}
                      color="secondary"
                    >
                      {editResponsableInstalacion.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editResponsableInstalacion.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editResponsableInstalacion.message}</Typography>}
                  <ResponsableInstalacionForm
                    data={editResponsableInstalacion.data}
                    disabled={editResponsableInstalacion.disabled}
                    errors={editResponsableInstalacion.errors}
                    helpers={editResponsableInstalacion.helpers}
                    onChange={handleResponsableInstalacionOnChange}
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
            <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Encargados de Proteccion Radiologica</Typography></Grid>
            <Grid size={12}>
              <EncargadoProteccionBrowse
                data={{ data: data.encargadosDeProteccionRadiologica as EncargadoProteccionDTO[] ?? [] }}
                onCreate={disabled.encargadosDeProteccionRadiologica ? undefined : () => onEncargadoProteccionAction("create")}
                onRead={(data, index) => () => onEncargadoProteccionAction("read", data, index)}
                onUpdate={disabled.encargadosDeProteccionRadiologica ? undefined : (data, index) => () => onEncargadoProteccionAction("update", data, index)}
                onDelete={disabled.encargadosDeProteccionRadiologica ? undefined : (data, index) => () => onEncargadoProteccionAction("delete", data, index)}
              />
              <CustomModal
                open={!!editEncargadoProteccion.action}
                onClose={handleEditEncargadoProteccionOnClose}
                title={editEncargadoProteccionTitle()}
                size="large"
                actions={(
                  <Grid container spacing={2}>
                    {editEncargadoProteccion.action !== "read" &&
                      <CustomButton
                        onClick={handleEditEncargadoProteccionOnConfirm}
                      >
                        {editEncargadoProteccion.action === "delete" ? "Borrar" : "Guardar"}
                      </CustomButton>
                    }
                    <CustomButton
                      onClick={handleEditEncargadoProteccionOnClose}
                      color="secondary"
                    >
                      {editEncargadoProteccion.action === "read" ? "Cerrar" : "Cancelar"}
                    </CustomButton>
                  </Grid>
                )}
              >
                <Grid container spacing={2} justifyContent="center" minHeight="500px">
                  {editEncargadoProteccion.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editEncargadoProteccion.message}</Typography>}
                  <EncargadoProteccionForm
                    data={editEncargadoProteccion.data}
                    disabled={editEncargadoProteccion.disabled}
                    errors={editEncargadoProteccion.errors}
                    helpers={editEncargadoProteccion.helpers}
                    onChange={handleEncargadoProteccionOnChange}
                  />
                </Grid>
              </CustomModal>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
  //#region funciones Responsable Uso
  function editResponsableUsoTitle() {
    const value = "Responsable de uso";
    switch (editResponsableUso.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleResponsableUsoOnChange(changes: DeepPartial<ResponsableUsoDTO>) {
    setEditResponsableUso((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditResponsableUsoOnClose() { setEditResponsableUso({ data: {} }); }
  function handleEditResponsableUsoOnConfirm() {
    const responsablesDeUso = [...data.responsablesDeUso ?? []];
    switch (editResponsableUso.action) {
      case "create": {
        responsablesDeUso.push(editResponsableUso.data as ResponsableUsoDTO);
        onChange({ responsablesDeUso });
        handleEditResponsableUsoOnClose();
        break;
      }
      case "update": {
        responsablesDeUso[editResponsableUso.index!] = editResponsableUso.data as ResponsableUsoDTO
        onChange({ responsablesDeUso });
        handleEditResponsableUsoOnClose();
        break;
      }
      case "delete": {
        responsablesDeUso.splice(editResponsableUso.index!, 1);
        onChange({ responsablesDeUso });
        handleEditResponsableUsoOnClose();
        break;
      }
      case "read": {
        handleEditResponsableUsoOnClose();
        break;
      }
    }
  }
  function onResponsableUsoAction(action: EditAction, data?: ResponsableUsoDTO, index?: number) {
    setEditResponsableUso({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cuil: true,
          autorizacionIndividual: true,
          nroPermisoHabilitante: true,
          matriculaProfesional: true,
          fechaExpedicion: true,
          fechaVencimiento: true,
        }
        : {},
    });
  }
  //#endregion funciones Responsable Uso
  //#region funciones Responsable Instalacion
  function editResponsableInstalacionTitle() {
    const value = "Responsable de Instalacion";
    switch (editResponsableInstalacion.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleResponsableInstalacionOnChange(changes: DeepPartial<ResponsableInstalacionDTO>) {
    setEditResponsableInstalacion((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditResponsableInstalacionOnClose() { setEditResponsableInstalacion({ data: {} }); }
  function handleEditResponsableInstalacionOnConfirm() {
    const responsablesDeInstalacion = [...data.responsablesDeInstalacion ?? []];
    switch (editResponsableInstalacion.action) {
      case "create": {
        responsablesDeInstalacion.push(editResponsableInstalacion.data as ResponsableInstalacionDTO);
        onChange({ responsablesDeInstalacion });
        handleEditResponsableInstalacionOnClose();
        break;
      }
      case "update": {
        responsablesDeInstalacion[editResponsableInstalacion.index!] = editResponsableInstalacion.data as ResponsableInstalacionDTO
        onChange({ responsablesDeInstalacion });
        handleEditResponsableInstalacionOnClose();
        break;
      }
      case "delete": {
        responsablesDeInstalacion.splice(editResponsableInstalacion.index!, 1);
        onChange({ responsablesDeInstalacion });
        handleEditResponsableInstalacionOnClose();
        break;
      }
      case "read": {
        handleEditResponsableInstalacionOnClose();
        break;
      }
    }
  }
  function onResponsableInstalacionAction(action: EditAction, data?: ResponsableInstalacionDTO, index?: number) {
    setEditResponsableInstalacion({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cuil: true,
          nroLicenciaHabilitante: true,
          domicilioHabilitacion: true,
          fechaExpedicion: true,
          fechaVencimiento: true,
        }
        : {},
    });
  }
  //#endregion funciones Elemento Proteccion
  //#region funciones Encargado Proteccion
  function editEncargadoProteccionTitle() {
    const value = "Encargado de Proteccion Radiológica";
    switch (editEncargadoProteccion.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleEncargadoProteccionOnChange(changes: DeepPartial<EncargadoProteccionDTO>) {
    setEditEncargadoProteccion((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditEncargadoProteccionOnClose() { setEditEncargadoProteccion({ data: {} }); }
  function handleEditEncargadoProteccionOnConfirm() {
    const encargadosDeProteccionRadiologica = [...data.encargadosDeProteccionRadiologica ?? []];
    switch (editEncargadoProteccion.action) {
      case "create": {
        encargadosDeProteccionRadiologica.push(editEncargadoProteccion.data as EncargadoProteccionDTO);
        onChange({ encargadosDeProteccionRadiologica });
        handleEditEncargadoProteccionOnClose();
        break;
      }
      case "update": {
        encargadosDeProteccionRadiologica[editEncargadoProteccion.index!] = editEncargadoProteccion.data as EncargadoProteccionDTO
        onChange({ encargadosDeProteccionRadiologica });
        handleEditEncargadoProteccionOnClose();
        break;
      }
      case "delete": {
        encargadosDeProteccionRadiologica.splice(editEncargadoProteccion.index!, 1);
        onChange({ encargadosDeProteccionRadiologica });
        handleEditEncargadoProteccionOnClose();
        break;
      }
      case "read": {
        handleEditEncargadoProteccionOnClose();
        break;
      }
    }
  }
  function onEncargadoProteccionAction(action: EditAction, data?: EncargadoProteccionDTO, index?: number) {
    setEditEncargadoProteccion({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cuil: true,
          tituloProfesional: true,
          matriculaProfesional: true,
          nroHabilitacion: true,
        }
        : {},
    });
  }
  //#endregion funciones Elemento Proteccion
}

export default EquipoRadiologicoForm;
