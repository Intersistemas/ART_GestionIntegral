import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ResponsableDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import Formato from "@/utils/Formato";
import { TContratacion_Array, TRepresentacion_Array, TTipoProfesionalResponsable_Array } from "@/data/SVCC/constants";

export const ResponsableForm: Form<ResponsableDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={2}>
      <TextField
        name="cuilCuit"
        label="CUIT/CUIL"
        value={Formato.CUIP(data.cuilCuit)}
        disabled={disabled.cuilCuit}
        onChange={({ target: { value } }) => onChange({ cuilCuit: value ? Number((value || '').replace(/[^0-9]/g, '')) : undefined })}
        error={errors.cuilCuit}
        helperText={helpers.cuilCuit}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="matricula"
        label="Matricula"
        value={data.matricula ?? ""}
        disabled={disabled.matricula}
        onChange={({ target: { value } }) => onChange({ matricula: value })}
        error={errors.matricula}
        helperText={helpers.matricula}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="cantHorasAsignadas"
        type="number"
        label="Cant. Hr. asignadas"
        value={data.cantHorasAsignadas ?? ""}
        disabled={disabled.cantHorasAsignadas}
        onChange={({ target: { value } }) => onChange({ cantHorasAsignadas: Number(value) })}
        error={errors.cantHorasAsignadas}
        helperText={helpers.cantHorasAsignadas}
        slotProps={{ inputLabel: { shrink: data.cantHorasAsignadas != null }}}
        fullWidth
      />
    </Grid>
    <Grid size={2}>
      <FormControl
        fullWidth
        error={errors.idContratacion}
        disabled={disabled.idContratacion}
      >
        <InputLabel>Contratacion</InputLabel>
        <Select
          name="idContratacion"
          value={data.idContratacion ?? ""}
          label="Contratacion"
          onChange={({ target: { value } }) => onChange({ idContratacion: value === undefined ? undefined : Number(value) })}
          displayEmpty
        >
          {TContratacion_Array.map((e, i) => (<MenuItem key={i} value={e.interno}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.idContratacion && (
          <Typography
            variant="caption"
            color={errors.idContratacion ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.idContratacion}
          </Typography>
        )}
      </FormControl>
    </Grid>
    <Grid size={6}>
      <FormControl
        fullWidth
        error={errors.idRepresentacion}
        disabled={disabled.idRepresentacion}
      >
        <InputLabel>Representacion</InputLabel>
        <Select
          name="idRepresentacion"
          value={data.idRepresentacion ?? ""}
          label="Representacion"
          onChange={({ target: { value } }) => onChange({ idRepresentacion: value === undefined ? undefined : Number(value) })}
          displayEmpty
        >
          {TRepresentacion_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.idRepresentacion && (
          <Typography
            variant="caption"
            color={errors.idRepresentacion ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.idRepresentacion}
          </Typography>
        )}
      </FormControl>
    </Grid>
    <Grid size={6}>
      <FormControl
        fullWidth
        error={errors.idTipoProfesionalResponsable}
        disabled={disabled.idTipoProfesionalResponsable}
      >
        <InputLabel>Tipo Prof. responsable</InputLabel>
        <Select
          name="idTipoProfesionalResponsable"
          value={data.idTipoProfesionalResponsable ?? ""}
          label="Tipo Prof. responsable"
          onChange={({ target: { value } }) => onChange({ idTipoProfesionalResponsable: value === undefined ? undefined : Number(value) })}
          displayEmpty
        >
          {TTipoProfesionalResponsable_Array.map((e, i) => (<MenuItem key={i} value={e.interno}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.idTipoProfesionalResponsable && (
          <Typography
            variant="caption"
            color={errors.idTipoProfesionalResponsable ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.idTipoProfesionalResponsable}
          </Typography>
        )}
      </FormControl>
    </Grid>
  </Grid>
);

export default ResponsableForm;