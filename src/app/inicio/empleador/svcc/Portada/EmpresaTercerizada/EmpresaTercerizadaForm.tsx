import { EmpresaTercerizadaDTO } from "@/data/gestionEmpleadorAPI";
import { Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import Formato from "@/utils/Formato";
import { Form } from "@/utils/ui/form/Form";

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const EmpresaTercerizadaForm: Form<EmpresaTercerizadaDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { }
}) => (
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
    <Grid size={4}>
      <TextField
        name="cuit"
        label="CUIT"
        placeholder="Ingrese CUIT (11 dígitos)"
        value={Formato.CUIP(data.cuit)}
        disabled={disabled.cuit}
        onChange={({ target: { value } }) => onChange({ cuit: value ? Number((value || '').replace(/[^0-9]/g, '')) : undefined })}
        error={errors.cuit}
        helperText={helpers.cuit}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="ciiu"
        type="number"
        label="CIUO"
        value={data.ciiu}
        disabled={disabled.ciiu}
        onChange={({ target: { value } }) => onChange({ ciiu: Number(value) })}
        error={errors.ciiu}
        helperText={helpers.ciiu}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Buscar CIIU"
                  arrow
                  slotProps={tooltip_SlotProps}
                >
                  <div>
                    <IconButton
                      color="primary"
                      size="large"
                      disabled={disabled.ciiu}
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
    <Grid size={4}>
      <TextField
        name="cantidadTrabajadores"
        type="number"
        label="Cant. trabajadores"
        value={data.cantidadTrabajadores}
        disabled={disabled.cantidadTrabajadores}
        onChange={({ target: { value } }) => onChange({ cantidadTrabajadores: value ? Number(value) : undefined })}
        error={errors.cantidadTrabajadores}
        helperText={helpers.cantidadTrabajadores}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default EmpresaTercerizadaForm;
