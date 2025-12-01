import { PuestoDTO } from "@/data/gestionEmpleadorAPI";
import { MoreHoriz } from "@mui/icons-material";
import { Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Form } from "@/utils/ui/form/Form";

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const PuestoForm: Form<PuestoDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={3}>
      <TextField
        name="ciuo"
        type="number"
        label="CIUO"
        value={data.ciuo}
        disabled={disabled.ciuo}
        onChange={({ target: { value } }) => onChange({ ciuo: Number(value) })}
        error={errors.ciuo}
        helperText={helpers.ciuo}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Buscar CIUO"
                  arrow
                  slotProps={tooltip_SlotProps}
                >
                  <IconButton
                    color="primary"
                    size="large"
                    disabled={disabled.ciuo}
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
  </Grid>
);
