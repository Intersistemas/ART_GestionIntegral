export type ParametersPoliza = {
    CUIT?: number;
    ComercializadorInterno?: number;
    OrganizadorComercializadorInterno?: number;
}

export type ParametersComercializador = {
    CUIL?: number;
    SRTOrganizadorComercializadorInterno?: number;
    SRTGrupoOrganizadorInterno?: number;
}

export type OrganizadorComercializador = {
    SRTGrupoOrganizadorInterno?: number;
    CUIL?: number;
}

export type GrupoOrganizadorComercializador = {
    SRTGrupoOrganizadorInterno?: number;
    CUIL?: number;
}