import { useState } from "react";
import { Card, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { CompradorDTO, EquipoRadiologicoDTO, EstudioAmbientalDTO, EstudioBiologicoDTO, ProveedorDTO, PuestoAfectadoDTO, SustanciaDTO, UtilizacionDTO } from "@/data/gestionEmpleadorAPI";
import { DeepPartial } from "@/utils/utils";
import { Form, FormProps } from "@/utils/ui/form/Form";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import { TSustancias_Array, TUnidadesMedidas_Array } from "@/data/SVCC/constants";
import PuestoAfectadoBrowse from "./PuestoAfectado/PuestoAfectadoBrowse";
import { SustanciaContextProvider } from "./context";
import UtilizacionForm from "./Utilizacion/UtilizacionForm";
import UtilizacionBrowse from "./Utilizacion/UtilizacionBrowse";
import PuestoAfectadoForm from "./PuestoAfectado/PuestoAfectadoForm";
import EquipoRadiologicoBrowse from "./EquipoRadiologico/EquipoRadiologicoBrowse";
import EquipoRadiologicoForm from "./EquipoRadiologico/EquipoRadiologicoForm";
import ProveedorBrowse from "./Proveedor/ProveedorBrowse";
import ProveedorForm from "./Proveedor/ProveedorForm";
import CompradorBrowse from "./Comprador/CompradorBrowse";
import CompradorForm from "./Comprador/CompradorForm";
import EstudioAmbientalBrowse from "./EstudioAmbiental/EstudioAmbientalBrowse";
import EstudioAmbientalForm from "./EstudioAmbiental/EstudioAmbientalForm";
import EstudioBiologicoBrowse from "./EstudioBiologico/EstudioBiologicoBrowse";
import EstudioBiologicoForm from "./EstudioBiologico/EstudioBiologicoForm";
import { useSVCCPresentacionContext } from "../../context";

type EditAction = "create" | "read" | "update" | "delete";
type EditState<T extends object> = Omit<FormProps<T>, "onChange"> & {
  action?: EditAction,
  index?: number,
  message?: string;
};

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const SustanciaForm: Form<SustanciaDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { }
}) => {
  const [editUtilizacion, setEditUtilizacion] = useState<EditState<UtilizacionDTO>>({ data: {} });
  const [editPuestoAfectado, setEditPuestoAfectado] = useState<EditState<PuestoAfectadoDTO>>({ data: {} });
  const [editEquipoRadiologico, setEditEquipoRadiologico] = useState<EditState<EquipoRadiologicoDTO>>({ data: {} });
  const [editProveedor, setEditProveedor] = useState<EditState<ProveedorDTO>>({ data: {} });
  const [editComprador, setEditComprador] = useState<EditState<CompradorDTO>>({ data: {} });
  const [editEstudioAmbiental, setEditEstudioAmbiental] = useState<EditState<EstudioAmbientalDTO>>({ data: {} });
  const [editEstudioBiologico, setEditEstudioBiologico] = useState<EditState<EstudioBiologicoDTO>>({ data: {} });

  const { establecimientos: { map: establecimientos } } = useSVCCPresentacionContext();

  return (
    <SustanciaContextProvider idEstablecimientoEmpresa={data.idEstablecimientoEmpresa}>
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
            value={establecimientos[data.idEstablecimientoEmpresa ?? 0]}
            disabled
            fullWidth
          />
        </Grid>
        <Grid size={12}>
          <FormControl
            fullWidth
            error={errors.idSustancia}
            disabled={disabled.idSustancia}
          >
            <InputLabel>Sustancia</InputLabel>
            <Select
              name="idSustancia"
              value={data.idSustancia || ""}
              label="Sustancia"
              onChange={({ target: { value } }) => onChange({ idSustancia: value ? Number(value) : undefined })}
              displayEmpty
            >
              {TSustancias_Array.map((e) => (<MenuItem key={e.codigo} value={e.codigo}>{e.descripcion}</MenuItem>))}
            </Select>
            {helpers.idSustancia && (
              <Typography
                variant="caption"
                color={errors.idSustancia ? "error" : "info"}
                sx={{ ml: 2, mt: 0.5 }}
              >
                {helpers.idSustancia}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid size={8}>
          <TextField
            name="nombreComercial"
            label="Nombre comercial"
            value={data.nombreComercial}
            disabled={disabled.nombreComercial}
            onChange={({ target: { value } }) => onChange({ nombreComercial: value })}
            error={errors.nombreComercial}
            helperText={helpers.nombreComercial}
            fullWidth
          />
        </Grid>
        <Grid size={2}>
          <TextField
            name="cantidadAnual"
            type="number"
            label="Cantidad anual"
            value={data.cantidadAnual}
            disabled={disabled.cantidadAnual}
            onChange={({ target: { value } }) => onChange({ cantidadAnual: value ? Number(value) : undefined })}
            error={errors.cantidadAnual}
            helperText={helpers.cantidadAnual}
            fullWidth
          />
        </Grid>
        <Grid size={2}>
          <FormControl
            fullWidth
            error={errors.idUnidadDeMedida}
            disabled={disabled.idUnidadDeMedida}
          >
            <InputLabel>Unidad de medida</InputLabel>
            <Select
              name="idUnidadDeMedida"
              value={data.idUnidadDeMedida || ""}
              label="Unidad de medida"
              onChange={({ target: { value } }) => onChange({ idUnidadDeMedida: value ? Number(value) : undefined })}
              displayEmpty
            >
              {TUnidadesMedidas_Array.map((e) => (<MenuItem key={e.interno} value={e.interno}>{e.descripcion}</MenuItem>))}
            </Select>
            {helpers.idUnidadDeMedida && (
              <Typography
                variant="caption"
                color={errors.idUnidadDeMedida ? "error" : "info"}
                sx={{ ml: 2, mt: 0.5 }}
              >
                {helpers.idUnidadDeMedida}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid size={12}>
          <Card variant="outlined">
            <Grid container spacing={2} padding={1.5}>
              <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Utilizaciones</Typography></Grid>
              <Grid size={12}>
                <UtilizacionBrowse
                  data={{ data: data.utilizaciones as UtilizacionDTO[] ?? [] }}
                  onCreate={disabled.utilizaciones ? undefined : () => onUtilizacionAction("create")}
                  onRead={(data, index) => () => onUtilizacionAction("read", data, index)}
                  onUpdate={disabled.utilizaciones ? undefined : (data, index) => () => onUtilizacionAction("update", data, index)}
                  onDelete={disabled.utilizaciones ? undefined : (data, index) => () => onUtilizacionAction("delete", data, index)}
                />
                <CustomModal
                  open={!!editUtilizacion.action}
                  onClose={handleEditUtilizacionOnClose}
                  title={editUtilizacionTitle()}
                  size="large"
                  actions={(
                    <Grid container spacing={2}>
                      {editUtilizacion.action !== "read" &&
                        <CustomButton
                          onClick={handleEditUtilizacionOnConfirm}
                        >
                          {editUtilizacion.action === "delete" ? "Borrar" : "Guardar"}
                        </CustomButton>
                      }
                      <CustomButton
                        onClick={handleEditUtilizacionOnClose}
                        color="secondary"
                      >
                        {editUtilizacion.action === "read" ? "Cerrar" : "Cancelar"}
                      </CustomButton>
                    </Grid>
                  )}
                >
                  <Grid container spacing={2} justifyContent="center" minHeight="500px">
                    {editUtilizacion.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editUtilizacion.message}</Typography>}
                    <UtilizacionForm
                      data={editUtilizacion.data}
                      disabled={editUtilizacion.disabled}
                      errors={editUtilizacion.errors}
                      helpers={editUtilizacion.helpers}
                      onChange={handleUtilizacionOnChange}
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
              <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Puestos afectados</Typography></Grid>
              <Grid size={12}>
                <PuestoAfectadoBrowse
                  data={{ data: data.puestosAfectados as PuestoAfectadoDTO[] ?? [] }}
                  onCreate={disabled.puestosAfectados ? undefined : () => onPuestoAfectadoAction("create")}
                  onRead={(data, index) => () => onPuestoAfectadoAction("read", data, index)}
                  onUpdate={disabled.puestosAfectados ? undefined : (data, index) => () => onPuestoAfectadoAction("update", data, index)}
                  onDelete={disabled.puestosAfectados ? undefined : (data, index) => () => onPuestoAfectadoAction("delete", data, index)}
                />
                <CustomModal
                  open={!!editPuestoAfectado.action}
                  onClose={handleEditPuestoAfectadoOnClose}
                  title={editPuestoAfectadoTitle()}
                  size="large"
                  actions={(
                    <Grid container spacing={2}>
                      {editPuestoAfectado.action !== "read" &&
                        <CustomButton
                          onClick={handleEditPuestoAfectadoOnConfirm}
                        >
                          {editPuestoAfectado.action === "delete" ? "Borrar" : "Guardar"}
                        </CustomButton>
                      }
                      <CustomButton
                        onClick={handleEditPuestoAfectadoOnClose}
                        color="secondary"
                      >
                        {editPuestoAfectado.action === "read" ? "Cerrar" : "Cancelar"}
                      </CustomButton>
                    </Grid>
                  )}
                >
                  <Grid container spacing={2} justifyContent="center" minHeight="500px">
                    {editPuestoAfectado.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editPuestoAfectado.message}</Typography>}
                    <PuestoAfectadoForm
                      data={editPuestoAfectado.data}
                      disabled={editPuestoAfectado.disabled}
                      errors={editPuestoAfectado.errors}
                      helpers={editPuestoAfectado.helpers}
                      onChange={handlePuestoAfectadoOnChange}
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
              <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Equipos radiológicos</Typography></Grid>
              <Grid size={12}>
                <EquipoRadiologicoBrowse
                  data={{ data: data.equiposRadiologicos as EquipoRadiologicoDTO[] ?? [] }}
                  onCreate={disabled.equiposRadiologicos ? undefined : () => onEquipoRadiologicoAction("create")}
                  onRead={(data, index) => () => onEquipoRadiologicoAction("read", data, index)}
                  onUpdate={disabled.equiposRadiologicos ? undefined : (data, index) => () => onEquipoRadiologicoAction("update", data, index)}
                  onDelete={disabled.equiposRadiologicos ? undefined : (data, index) => () => onEquipoRadiologicoAction("delete", data, index)}
                />
                <CustomModal
                  open={!!editEquipoRadiologico.action}
                  onClose={handleEditEquipoRadiologicoOnClose}
                  title={editEquipoRadiologicoTitle()}
                  size="large"
                  actions={(
                    <Grid container spacing={2}>
                      {editEquipoRadiologico.action !== "read" &&
                        <CustomButton
                          onClick={handleEditEquipoRadiologicoOnConfirm}
                        >
                          {editEquipoRadiologico.action === "delete" ? "Borrar" : "Guardar"}
                        </CustomButton>
                      }
                      <CustomButton
                        onClick={handleEditEquipoRadiologicoOnClose}
                        color="secondary"
                      >
                        {editEquipoRadiologico.action === "read" ? "Cerrar" : "Cancelar"}
                      </CustomButton>
                    </Grid>
                  )}
                >
                  <Grid container spacing={2} justifyContent="center" minHeight="500px">
                    {editEquipoRadiologico.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editEquipoRadiologico.message}</Typography>}
                    <EquipoRadiologicoForm
                      data={editEquipoRadiologico.data}
                      disabled={editEquipoRadiologico.disabled}
                      errors={editEquipoRadiologico.errors}
                      helpers={editEquipoRadiologico.helpers}
                      onChange={handleEquipoRadiologicoOnChange}
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
              <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Proveedores</Typography></Grid>
              <Grid size={12}>
                <ProveedorBrowse
                  data={{ data: data.proveedores as ProveedorDTO[] ?? [] }}
                  onCreate={disabled.proveedores ? undefined : () => onProveedorAction("create")}
                  onRead={(data, index) => () => onProveedorAction("read", data, index)}
                  onUpdate={disabled.proveedores ? undefined : (data, index) => () => onProveedorAction("update", data, index)}
                  onDelete={disabled.proveedores ? undefined : (data, index) => () => onProveedorAction("delete", data, index)}
                />
                <CustomModal
                  open={!!editProveedor.action}
                  onClose={handleEditProveedorOnClose}
                  title={editProveedorTitle()}
                  size="large"
                  actions={(
                    <Grid container spacing={2}>
                      {editProveedor.action !== "read" &&
                        <CustomButton
                          onClick={handleEditProveedorOnConfirm}
                        >
                          {editProveedor.action === "delete" ? "Borrar" : "Guardar"}
                        </CustomButton>
                      }
                      <CustomButton
                        onClick={handleEditProveedorOnClose}
                        color="secondary"
                      >
                        {editProveedor.action === "read" ? "Cerrar" : "Cancelar"}
                      </CustomButton>
                    </Grid>
                  )}
                >
                  <Grid container spacing={2} justifyContent="center" minHeight="500px">
                    {editProveedor.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editProveedor.message}</Typography>}
                    <ProveedorForm
                      data={editProveedor.data}
                      disabled={editProveedor.disabled}
                      errors={editProveedor.errors}
                      helpers={editProveedor.helpers}
                      onChange={handleProveedorOnChange}
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
              <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Compradores</Typography></Grid>
              <Grid size={12}>
                <CompradorBrowse
                  data={{ data: data.compradores as CompradorDTO[] ?? [] }}
                  onCreate={disabled.compradores ? undefined : () => onCompradorAction("create")}
                  onRead={(data, index) => () => onCompradorAction("read", data, index)}
                  onUpdate={disabled.compradores ? undefined : (data, index) => () => onCompradorAction("update", data, index)}
                  onDelete={disabled.compradores ? undefined : (data, index) => () => onCompradorAction("delete", data, index)}
                />
                <CustomModal
                  open={!!editComprador.action}
                  onClose={handleEditCompradorOnClose}
                  title={editCompradorTitle()}
                  size="large"
                  actions={(
                    <Grid container spacing={2}>
                      {editComprador.action !== "read" &&
                        <CustomButton
                          onClick={handleEditCompradorOnConfirm}
                        >
                          {editComprador.action === "delete" ? "Borrar" : "Guardar"}
                        </CustomButton>
                      }
                      <CustomButton
                        onClick={handleEditCompradorOnClose}
                        color="secondary"
                      >
                        {editComprador.action === "read" ? "Cerrar" : "Cancelar"}
                      </CustomButton>
                    </Grid>
                  )}
                >
                  <Grid container spacing={2} justifyContent="center" minHeight="500px">
                    {editComprador.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editComprador.message}</Typography>}
                    <CompradorForm
                      data={editComprador.data}
                      disabled={editComprador.disabled}
                      errors={editComprador.errors}
                      helpers={editComprador.helpers}
                      onChange={handleCompradorOnChange}
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
              <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Estudios ambientales específicos</Typography></Grid>
              <Grid size={12}>
                <EstudioAmbientalBrowse
                  data={{ data: data.estudiosAmbientalesEspecificos as EstudioAmbientalDTO[] ?? [] }}
                  onCreate={disabled.estudiosAmbientalesEspecificos ? undefined : () => onEstudioAmbientalAction("create")}
                  onRead={(data, index) => () => onEstudioAmbientalAction("read", data, index)}
                  onUpdate={disabled.estudiosAmbientalesEspecificos ? undefined : (data, index) => () => onEstudioAmbientalAction("update", data, index)}
                  onDelete={disabled.estudiosAmbientalesEspecificos ? undefined : (data, index) => () => onEstudioAmbientalAction("delete", data, index)}
                />
                <CustomModal
                  open={!!editEstudioAmbiental.action}
                  onClose={handleEditEstudioAmbientalOnClose}
                  title={editEstudioAmbientalTitle()}
                  size="large"
                  actions={(
                    <Grid container spacing={2}>
                      {editEstudioAmbiental.action !== "read" &&
                        <CustomButton
                          onClick={handleEditEstudioAmbientalOnConfirm}
                        >
                          {editEstudioAmbiental.action === "delete" ? "Borrar" : "Guardar"}
                        </CustomButton>
                      }
                      <CustomButton
                        onClick={handleEditEstudioAmbientalOnClose}
                        color="secondary"
                      >
                        {editEstudioAmbiental.action === "read" ? "Cerrar" : "Cancelar"}
                      </CustomButton>
                    </Grid>
                  )}
                >
                  <Grid container spacing={2} justifyContent="center" minHeight="500px">
                    {editEstudioAmbiental.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editEstudioAmbiental.message}</Typography>}
                    <EstudioAmbientalForm
                      data={editEstudioAmbiental.data}
                      disabled={editEstudioAmbiental.disabled}
                      errors={editEstudioAmbiental.errors}
                      helpers={editEstudioAmbiental.helpers}
                      onChange={handleEstudioAmbientalOnChange}
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
              <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Estudios biológicos específicos</Typography></Grid>
              <Grid size={12}>
                <EstudioBiologicoBrowse
                  data={{ data: data.estudiosBiologicosEspecificos as EstudioBiologicoDTO[] ?? [] }}
                  onCreate={disabled.estudiosBiologicosEspecificos ? undefined : () => onEstudioBiologicoAction("create")}
                  onRead={(data, index) => () => onEstudioBiologicoAction("read", data, index)}
                  onUpdate={disabled.estudiosBiologicosEspecificos ? undefined : (data, index) => () => onEstudioBiologicoAction("update", data, index)}
                  onDelete={disabled.estudiosBiologicosEspecificos ? undefined : (data, index) => () => onEstudioBiologicoAction("delete", data, index)}
                />
                <CustomModal
                  open={!!editEstudioBiologico.action}
                  onClose={handleEditEstudioBiologicoOnClose}
                  title={editEstudioBiologicoTitle()}
                  size="large"
                  actions={(
                    <Grid container spacing={2}>
                      {editEstudioBiologico.action !== "read" &&
                        <CustomButton
                          onClick={handleEditEstudioBiologicoOnConfirm}
                        >
                          {editEstudioBiologico.action === "delete" ? "Borrar" : "Guardar"}
                        </CustomButton>
                      }
                      <CustomButton
                        onClick={handleEditEstudioBiologicoOnClose}
                        color="secondary"
                      >
                        {editEstudioBiologico.action === "read" ? "Cerrar" : "Cancelar"}
                      </CustomButton>
                    </Grid>
                  )}
                >
                  <Grid container spacing={2} justifyContent="center" minHeight="500px">
                    {editEstudioBiologico.message && <Typography variant="h5" color="var(--naranja)" textAlign="center">{editEstudioBiologico.message}</Typography>}
                    <EstudioBiologicoForm
                      data={editEstudioBiologico.data}
                      disabled={editEstudioBiologico.disabled}
                      errors={editEstudioBiologico.errors}
                      helpers={editEstudioBiologico.helpers}
                      onChange={handleEstudioBiologicoOnChange}
                    />
                  </Grid>
                </CustomModal>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </SustanciaContextProvider>
  );
  //#region funciones Utilizacion
  function editUtilizacionTitle() {
    const value = "Utilizacion";
    switch (editUtilizacion.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleUtilizacionOnChange(changes: DeepPartial<UtilizacionDTO>) {
    setEditUtilizacion((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditUtilizacionOnClose() { setEditUtilizacion({ data: {} }); }
  function handleEditUtilizacionOnConfirm() {
    const utilizaciones = [...data.utilizaciones ?? []];
    switch (editUtilizacion.action) {
      case "create": {
        utilizaciones.push(editUtilizacion.data as UtilizacionDTO);
        onChange({ utilizaciones });
        handleEditUtilizacionOnClose();
        break;
      }
      case "update": {
        utilizaciones[editUtilizacion.index!] = editUtilizacion.data as UtilizacionDTO
        onChange({ utilizaciones });
        handleEditUtilizacionOnClose();
        break;
      }
      case "delete": {
        utilizaciones.splice(editUtilizacion.index!, 1);
        onChange({ utilizaciones });
        handleEditUtilizacionOnClose();
        break;
      }
      case "read": {
        handleEditUtilizacionOnClose();
        break;
      }
    }
  }
  function onUtilizacionAction(action: EditAction, data?: UtilizacionDTO, index?: number) {
    setEditUtilizacion({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          usoOrigen: true,
          modoDeEmpleo: true,
          fechaInsert: true,
        }
        : {},
    });
  }
  //#endregion funciones Utilizacion
  //#region funciones Puesto Afectado
  function editPuestoAfectadoTitle() {
    const value = "Puesto Afectado";
    switch (editPuestoAfectado.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handlePuestoAfectadoOnChange(changes: DeepPartial<PuestoAfectadoDTO>) {
    setEditPuestoAfectado((o) => ({ ...o, data: { ...o.data, ...changes } }));
  }
  function handleEditPuestoAfectadoOnClose() { setEditPuestoAfectado({ data: {} }); }
  function handleEditPuestoAfectadoOnConfirm() {
    const puestosAfectados = [...data.puestosAfectados ?? []];
    switch (editPuestoAfectado.action) {
      case "create": {
        puestosAfectados.push(editPuestoAfectado.data as PuestoAfectadoDTO);
        onChange({ puestosAfectados });
        handleEditPuestoAfectadoOnClose();
        break;
      }
      case "update": {
        puestosAfectados[editPuestoAfectado.index!] = editPuestoAfectado.data as PuestoAfectadoDTO
        onChange({ puestosAfectados });
        handleEditPuestoAfectadoOnClose();
        break;
      }
      case "delete": {
        puestosAfectados.splice(editPuestoAfectado.index!, 1);
        onChange({ puestosAfectados });
        handleEditPuestoAfectadoOnClose();
        break;
      }
      case "read": {
        handleEditPuestoAfectadoOnClose();
        break;
      }
    }
  }
  function onPuestoAfectadoAction(action: EditAction, data?: PuestoAfectadoDTO, index?: number) {
    setEditPuestoAfectado({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          puestoInterno: true,
          descripcionActividad: true,
          informaSobreRiesgos: true,
          capacitacionSobreRiesgos: true,
          entregaElementosDeProteccion: true,
          descripcionEstudios: true,
          licenciaEspecial: true,
          medidasPreventivasDelPuesto: {},
          elementosProteccionPersonal: {},
        }
        : {},
    });
  }
  //#endregion funciones Puesto Afectado
  //#region funciones Equipo Radiologico
  function editEquipoRadiologicoTitle() {
    const value = "Equipo Radiologico";
    switch (editEquipoRadiologico.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleEquipoRadiologicoOnChange(changes: DeepPartial<EquipoRadiologicoDTO>) {
    setEditEquipoRadiologico((o) => ({
      ...o,
      data: {
        ...o.data,
        ...changes,
        dosimetria: { ...o.data?.dosimetria, ...changes.dosimetria }
      }
    }));
  }
  function handleEditEquipoRadiologicoOnClose() { setEditEquipoRadiologico({ data: {} }); }
  function handleEditEquipoRadiologicoOnConfirm() {
    const equiposRadiologicos = [...data.equiposRadiologicos ?? []];
    switch (editEquipoRadiologico.action) {
      case "create": {
        equiposRadiologicos.push(editEquipoRadiologico.data as EquipoRadiologicoDTO);
        onChange({ equiposRadiologicos });
        handleEditEquipoRadiologicoOnClose();
        break;
      }
      case "update": {
        equiposRadiologicos[editEquipoRadiologico.index!] = editEquipoRadiologico.data as EquipoRadiologicoDTO
        onChange({ equiposRadiologicos });
        handleEditEquipoRadiologicoOnClose();
        break;
      }
      case "delete": {
        equiposRadiologicos.splice(editEquipoRadiologico.index!, 1);
        onChange({ equiposRadiologicos });
        handleEditEquipoRadiologicoOnClose();
        break;
      }
      case "read": {
        handleEditEquipoRadiologicoOnClose();
        break;
      }
    }
  }
  function onEquipoRadiologicoAction(action: EditAction, data?: EquipoRadiologicoDTO, index?: number) {
    setEditEquipoRadiologico({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          marca: true,
          modelo: true,
          idTipoEquipo: true,
          idCaracteristicaEquipo: true,
          idTipoRadiacion: true,
          actividad: true,
          radioisotopoFuente: true,
          idTipoFuente: true,
          potenciaEquipoKVP: true,
          potenciaEquipomAp: true,
          potenciaEquipoMeV: true,
          procesamientoImagenes: true,
          metodoProcesamiento: true,
          observaciones: true,
          dosimetria: {
            interno: true,
            cantidadDePersonal: true,
            idTipoDosimetria: true,
            idMetodoDosimetria: true,
            cuitResponsable: true,
          },
          responsablesDeUso: {},
          responsablesDeInstalacion: {},
          encargadosDeProteccionRadiologica: {},
        }
        : {},
    });
  }
  //#endregion funciones Puesto Afectado
  //#region funciones Proveedor
  function editProveedorTitle() {
    const value = "Proveedor";
    switch (editProveedor.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleProveedorOnChange(changes: DeepPartial<ProveedorDTO>) {
    setEditProveedor((o) => ({
      ...o,
      data: { ...o.data, ...changes }
    }));
  }
  function handleEditProveedorOnClose() { setEditProveedor({ data: {} }); }
  function handleEditProveedorOnConfirm() {
    const proveedores = [...data.proveedores ?? []];
    switch (editProveedor.action) {
      case "create": {
        proveedores.push(editProveedor.data as ProveedorDTO);
        onChange({ proveedores });
        handleEditProveedorOnClose();
        break;
      }
      case "update": {
        proveedores[editProveedor.index!] = editProveedor.data as ProveedorDTO
        onChange({ proveedores });
        handleEditProveedorOnClose();
        break;
      }
      case "delete": {
        proveedores.splice(editProveedor.index!, 1);
        onChange({ proveedores });
        handleEditProveedorOnClose();
        break;
      }
      case "read": {
        handleEditProveedorOnClose();
        break;
      }
    }
  }
  function onProveedorAction(action: EditAction, data?: ProveedorDTO, index?: number) {
    setEditProveedor({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cuit: true,
          nombreComercial: true,
        }
        : {},
    });
  }
  //#endregion funciones Proveedor
  //#region funciones Comprador
  function editCompradorTitle() {
    const value = "Comprador";
    switch (editComprador.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleCompradorOnChange(changes: DeepPartial<CompradorDTO>) {
    setEditComprador((o) => ({
      ...o,
      data: { ...o.data, ...changes }
    }));
  }
  function handleEditCompradorOnClose() { setEditComprador({ data: {} }); }
  function handleEditCompradorOnConfirm() {
    const compradores = [...data.compradores ?? []];
    switch (editComprador.action) {
      case "create": {
        compradores.push(editComprador.data as CompradorDTO);
        onChange({ compradores });
        handleEditCompradorOnClose();
        break;
      }
      case "update": {
        compradores[editComprador.index!] = editComprador.data as CompradorDTO
        onChange({ compradores });
        handleEditCompradorOnClose();
        break;
      }
      case "delete": {
        compradores.splice(editComprador.index!, 1);
        onChange({ compradores });
        handleEditCompradorOnClose();
        break;
      }
      case "read": {
        handleEditCompradorOnClose();
        break;
      }
    }
  }
  function onCompradorAction(action: EditAction, data?: CompradorDTO, index?: number) {
    setEditComprador({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cuit: true,
          nombreComercial: true,
        }
        : {},
    });
  }
  //#endregion funciones Comprador
  //#region funciones Estudio Ambiental
  function editEstudioAmbientalTitle() {
    const value = "Estudio ambiental específico";
    switch (editEstudioAmbiental.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleEstudioAmbientalOnChange(changes: DeepPartial<EstudioAmbientalDTO>) {
    setEditEstudioAmbiental((o) => ({
      ...o,
      data: { ...o.data, ...changes }
    }));
  }
  function handleEditEstudioAmbientalOnClose() { setEditEstudioAmbiental({ data: {} }); }
  function handleEditEstudioAmbientalOnConfirm() {
    const estudiosAmbientalesEspecificos = [...data.estudiosAmbientalesEspecificos ?? []];
    switch (editEstudioAmbiental.action) {
      case "create": {
        estudiosAmbientalesEspecificos.push(editEstudioAmbiental.data as EstudioAmbientalDTO);
        onChange({ estudiosAmbientalesEspecificos });
        handleEditEstudioAmbientalOnClose();
        break;
      }
      case "update": {
        estudiosAmbientalesEspecificos[editEstudioAmbiental.index!] = editEstudioAmbiental.data as EstudioAmbientalDTO
        onChange({ estudiosAmbientalesEspecificos });
        handleEditEstudioAmbientalOnClose();
        break;
      }
      case "delete": {
        estudiosAmbientalesEspecificos.splice(editEstudioAmbiental.index!, 1);
        onChange({ estudiosAmbientalesEspecificos });
        handleEditEstudioAmbientalOnClose();
        break;
      }
      case "read": {
        handleEditEstudioAmbientalOnClose();
        break;
      }
    }
  }
  function onEstudioAmbientalAction(action: EditAction, data?: EstudioAmbientalDTO, index?: number) {
    setEditEstudioAmbiental({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cantidadFrecuencia: true,
          idUnidadFrecuencia: true,
          metodologiaEmpleada: true,
        }
        : {},
    });
  }
  //#endregion funciones Estudio Ambiental
  //#region funciones Estudio Biologico
  function editEstudioBiologicoTitle() {
    const value = "Estudio biológico específico";
    switch (editEstudioBiologico.action) {
      case "create": return `Agregando ${value}`;
      case "read": return `Consultando ${value}`;
      case "update": return `Modificando ${value}`;
      case "delete": return `Borrando ${value}`;
    }
  }
  function handleEstudioBiologicoOnChange(changes: DeepPartial<EstudioBiologicoDTO>) {
    setEditEstudioBiologico((o) => ({
      ...o,
      data: { ...o.data, ...changes }
    }));
  }
  function handleEditEstudioBiologicoOnClose() { setEditEstudioBiologico({ data: {} }); }
  function handleEditEstudioBiologicoOnConfirm() {
    const estudiosBiologicosEspecificos = [...data.estudiosBiologicosEspecificos ?? []];
    switch (editEstudioBiologico.action) {
      case "create": {
        estudiosBiologicosEspecificos.push(editEstudioBiologico.data as EstudioBiologicoDTO);
        onChange({ estudiosBiologicosEspecificos });
        handleEditEstudioBiologicoOnClose();
        break;
      }
      case "update": {
        estudiosBiologicosEspecificos[editEstudioBiologico.index!] = editEstudioBiologico.data as EstudioBiologicoDTO
        onChange({ estudiosBiologicosEspecificos });
        handleEditEstudioBiologicoOnClose();
        break;
      }
      case "delete": {
        estudiosBiologicosEspecificos.splice(editEstudioBiologico.index!, 1);
        onChange({ estudiosBiologicosEspecificos });
        handleEditEstudioBiologicoOnClose();
        break;
      }
      case "read": {
        handleEditEstudioBiologicoOnClose();
        break;
      }
    }
  }
  function onEstudioBiologicoAction(action: EditAction, data?: EstudioBiologicoDTO, index?: number) {
    setEditEstudioBiologico({
      action,
      index,
      data: data ? JSON.parse(JSON.stringify(data)) : {},
      disabled: ["read", "delete"].includes(action)
        ? {
          interno: true,
          cantidadFrecuencia: true,
          idUnidadFrecuencia: true,
          analisisEstudiosComplementacion: true,
        }
        : {},
    });
  }
  //#endregion funciones Estudio Ambiental
}
export default SustanciaForm;
