// src/app/inicio/empleador/avisosDeObra/AvisosObraList.tsx
import React from "react";
import {
    AddCircleOutline,
    ChangeCircleOutlined,
    InfoOutlined,
    RemoveCircleOutline,
    PictureAsPdfOutlined
} from "@mui/icons-material";
import {
    ButtonGroup,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import { AvisoObraRecord, AvisoTipo, Provincia } from "./types/types";
import AvisosObraPdfGenerator from "./AvisoObraPdfGenerator";
import { AvisosObraTipos } from "./data/avisosObraTipos";
import { Provincias } from "./data/provincias";
import Formato from "@/utils/Formato";

export interface AvisosObraListProps {
    data: AvisoObraRecord[];
    onInsert: (record: AvisoObraRecord) => void;
    onChange: (record: AvisoObraRecord) => void;
    onDelete: (record: AvisoObraRecord) => void;
    onView: (record: AvisoObraRecord) => void;
    onPdf: (record: AvisoObraRecord) => void; 
}

const AvisosObraList: React.FC<AvisosObraListProps> = ({
    data,
    onInsert,
    onChange,
    onDelete,
    onView,
    onPdf,     // 🟢 DESTRUCTURADO
}) => {
    const records = data || [];

    const tipoDesc = (record: AvisoObraRecord): string => {
        const tipo = (AvisosObraTipos as AvisoTipo[]).find(
            (r) => r.Codigo === record.obraTipo
        );
        if (tipo == null) return record.obraTipo;
        return tipo.Descripcion;
    };

    const direccionDesc = (record: AvisoObraRecord): string => {
        let dir: string = "";

        if (record.direccionCalleRuta != null) {
            if (dir !== "") dir = `${dir} `;
            dir = `${dir}${record.direccionCalleRuta}`;
        }
        if (record.direccionNumero != null) {
            if (dir !== "") dir = `${dir} `;
            dir = `${dir}${record.direccionNumero}`;
        }
        if (record.direccionLocalidad != null) {
            if (dir !== "") dir = `${dir} - `;
            dir = `${dir}${record.direccionLocalidad}`;
        }

        if (record.direccionPciaCodigo != null) {
            const pcia = (Provincias as Provincia[]).find(
                (r) => r.Codigo === record.direccionPciaCodigo
            );
            if (pcia != null) {
                if (dir !== "") dir = `${dir} - `;
                dir = `${dir}${pcia.Descripcion}`;
            }
        }

        if (dir === "") return "";
        return `Calle ${dir}`;
    };

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" width={40}>Número</TableCell>
                        <TableCell align="left" width={100}>Tipo</TableCell>
                        <TableCell align="left">Dirección</TableCell>
                        <TableCell align="center" width={110}>Recepción</TableCell>
                        <TableCell align="center" width={110}>Confirmación</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {records.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                No se encontraron Avisos de Obra.
                            </TableCell>
                        </TableRow>
                    ) : (
                        records.map((record) => (
                            <TableRow key={record.interno}>
                                <TableCell>{record.obraNumero}</TableCell>
                                <TableCell>{tipoDesc(record)}</TableCell>
                                <TableCell>{direccionDesc(record)}</TableCell>
                                <TableCell>{Formato.Fecha(record.recepcionFecha)}</TableCell>
                                <TableCell>{Formato.Fecha(record.confirmacionFecha)}</TableCell>

                                <TableCell align="right">
                                    <ButtonGroup>
                                        <Tooltip title="Consulta">
                                            <IconButton color="primary" onClick={() => onView(record)}>
                                                <InfoOutlined />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Modifica">
                                            <IconButton color="primary" onClick={() => onChange(record)}>
                                                <ChangeCircleOutlined />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Borra">
                                            <IconButton
                                                color="primary"
                                                onClick={() => onDelete(record)}
                                                disabled={record.confirmacionFecha != null}
                                            >
                                                <RemoveCircleOutline />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="PDF">
                                            <IconButton color="primary" onClick={() => onPdf(record)}>
                                                <PictureAsPdfOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AvisosObraList;
