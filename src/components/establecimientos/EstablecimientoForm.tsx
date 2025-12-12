import { Grid, TextField } from "@mui/material";
import { EstablecimientoVm } from "@/data/artAPI";
import { Form } from "@/utils/ui/form/Form";
import Formato from "@/utils/Formato";

const date_SlotProps = { inputLabel: { shrink: true } };
export const EstablecimientoForm: Form<EstablecimientoVm> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={3}>
      <TextField
        name="codEstabEmpresa"
        type="number"
        label="Cod. Establ. Empresa"
        value={data.codEstabEmpresa}
        disabled={disabled.codEstabEmpresa}
        onChange={({ target: { value } }) => onChange({ codEstabEmpresa: Number(value) })}
        error={errors.codEstabEmpresa}
        helperText={helpers.codEstabEmpresa}
        fullWidth
      />
    </Grid>
    <Grid size={3}>
      <TextField
        name="cuit"
        label="CUIT"
        value={Formato.CUIP(data.cuit)}
        disabled={disabled.cuit}
        onChange={({ target: { value } }) => onChange({ cuit: value ? Number((value || '').replace(/[^0-9]/g, '')) : undefined })}
        error={errors.cuit}
        helperText={helpers.cuit}
        fullWidth
      />
    </Grid>
    <Grid size={3}>
      <TextField
        name="ciiu"
        type="number"
        label="CIIU"
        value={data.ciiu}
        disabled={disabled.ciiu}
        onChange={({ target: { value } }) => onChange({ ciiu: Number(value) })}
        error={errors.ciiu}
        helperText={helpers.ciiu}
        fullWidth
      />
    </Grid>
    <Grid size={3}>
      <TextField
        name="cantTrabajadores"
        type="number"
        label="Cant. trabajadores"
        value={data.cantTrabajadores}
        disabled={disabled.cantTrabajadores}
        onChange={({ target: { value } }) => onChange({ cantTrabajadores: Number(value) })}
        error={errors.cantTrabajadores}
        helperText={helpers.cantTrabajadores}
        fullWidth
      />
    </Grid>
    <Grid size={12}>
      <TextField
        name="nombre"
        label="Nombre"
        value={data.nombre}
        disabled={disabled.nombre}
        onChange={({ target: { value } }) => onChange({ nombre: value })}
        error={errors.nombre}
        helperText={helpers.nombre}
        fullWidth
      />
    </Grid>
    <Grid size={9}>
      <TextField
        name="domicilioCalle"
        label="Calle"
        value={data.domicilioCalle}
        disabled={disabled.domicilioCalle}
        onChange={({ target: { value } }) => onChange({ domicilioCalle: value })}
        error={errors.domicilioCalle}
        helperText={helpers.domicilioCalle}
        fullWidth
      />
    </Grid>
    <Grid size={3}>
      <TextField
        name="domicilioNro"
        label="Nro"
        value={data.domicilioNro}
        disabled={disabled.domicilioNro}
        onChange={({ target: { value } }) => onChange({ domicilioNro: value })}
        error={errors.domicilioNro}
        helperText={helpers.domicilioNro}
        fullWidth
      />
    </Grid>
    <Grid size={6}>
      <TextField
        name="localidad"
        label="Localidad"
        value={data.localidad}
        disabled={disabled.localidad}
        onChange={({ target: { value } }) => onChange({ localidad: value })}
        error={errors.localidad}
        helperText={helpers.localidad}
        fullWidth
      />
    </Grid>
    <Grid size={6}>
      <TextField
        name="provincia"
        label="Provincia"
        value={data.provincia}
        disabled={disabled.provincia}
        onChange={({ target: { value } }) => onChange({ provincia: value })}
        error={errors.provincia}
        helperText={helpers.provincia}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default EstablecimientoForm;
