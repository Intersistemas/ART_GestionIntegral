import { Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { EmpresaTercerizadaDTO } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import { Form } from "@/utils/ui/form/Form";
import { useSVCCPresentacionContext } from "../../context";
import { useState } from "react";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import EstablecimientoBrowse from "@/components/establecimientos/EstablecimientoBrowse";
import RefCIIUBrowse from "@/components/RefCIIU/RefCIIUBrowse";

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const EmpresaTercerizadaForm: Form<EmpresaTercerizadaDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { }
}) => {
  const [lookupEstablecimientos, setLookupEstablecimientos] = useState<boolean>(false);
  const [lookupCIIU, setLookupCIIU] = useState<boolean>(false);
  const { establecimientos, refCIIU } = useSVCCPresentacionContext();

  return (
    <Grid container size={12} spacing={2} maxHeight="fit-content">
      <Grid size={3}>
        <TextField
          name="idEstablecimientoEmpresa"
          type="number"
          label="Establ. Empresa"
          value={data.idEstablecimientoEmpresa ?? ""}
          disabled={disabled.idEstablecimientoEmpresa}
          onChange={({ target: { value } }) => onChange({ idEstablecimientoEmpresa: Number(value) })}
          error={errors.idEstablecimientoEmpresa}
          helperText={helpers.idEstablecimientoEmpresa}
          slotProps={{
            inputLabel: { shrink: data.idEstablecimientoEmpresa != null },
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
                        onClick={() => setLookupEstablecimientos(true)}
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
          open={lookupEstablecimientos}
          onClose={() => setLookupEstablecimientos(false)}
          title="Selección de establecimiento"
          size="large"
          actions={(
            <Grid container spacing={2}>
              <CustomButton
                onClick={() => setLookupEstablecimientos(false)}
                color="secondary"
              >
                Cancelar
              </CustomButton>
            </Grid>
          )}
        >
          <Grid container spacing={2} justifyContent="center" minHeight="500px">
            <Grid size={12}>
              <EstablecimientoBrowse
                isLoading={establecimientos.isLoading || establecimientos.isValidating}
                data={{ data: establecimientos.data ?? [] }}
                onSelect={(select) => () => {
                  onChange({ idEstablecimientoEmpresa: select.codEstabEmpresa });
                  setLookupEstablecimientos(false);
                }}
              />
            </Grid>
          </Grid>
        </CustomModal>
      </Grid>
      <Grid size={9}>
        <TextField
          name="Placeholder"
          label="Establ. Empresa - Descripcion"
          value={establecimientos.map[data.idEstablecimientoEmpresa ?? 0] ?? ""}
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
          label="CIIU"
          value={data.ciiu ?? ""}
          disabled={disabled.ciiu}
          onChange={({ target: { value } }) => onChange({ ciiu: Number(value) })}
          error={errors.ciiu}
          helperText={helpers.ciiu}
          slotProps={{
            inputLabel: { shrink: data.ciiu != null },
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
                        onClick={() => setLookupCIIU(true)}
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
          open={lookupCIIU}
          onClose={() => setLookupCIIU(false)}
          title="Selección de CIIUv4"
          size="large"
          actions={(
            <Grid container spacing={2}>
              <CustomButton
                onClick={() => setLookupCIIU(false)}
                color="secondary"
              >
                Cancelar
              </CustomButton>
            </Grid>
          )}
        >
          <Grid container spacing={2} justifyContent="center" minHeight="500px">
            <Grid size={12}>
              <RefCIIUBrowse
                isLoading={refCIIU.isLoading || refCIIU.isValidating}
                data={{ data: refCIIU.data ?? [] }}
                onSelect={(select) => () => {
                  onChange({ ciiu: select.ciiuRev4 });
                  setLookupCIIU(false);
                }}
              />
            </Grid>
          </Grid>
        </CustomModal>
      </Grid>
      <Grid size={4}>
        <TextField
          name="cantidadTrabajadores"
          type="number"
          label="Cant. trabajadores"
          value={data.cantidadTrabajadores ?? ""}
          disabled={disabled.cantidadTrabajadores}
          onChange={({ target: { value } }) => onChange({ cantidadTrabajadores: value ? Number(value) : undefined })}
          error={errors.cantidadTrabajadores}
          helperText={helpers.cantidadTrabajadores}
          slotProps={{ inputLabel: { shrink: data.cantidadTrabajadores != null }}}
          fullWidth
        />
      </Grid>
    </Grid>
  )
};

export default EmpresaTercerizadaForm;
