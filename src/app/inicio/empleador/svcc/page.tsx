'use client';
import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import CustomTab from '@/utils/ui/tab/CustomTab';
import CustomSelectSearch from '@/utils/ui/form/CustomSelectSearch';
import Formato from '@/utils/Formato';
import { useEmpresasStore } from '@/data/empresasStore';
import { Empresa } from '@/data/authAPI';
import PortadaHandler from './Portada/PortadaHandler';
import AnexoVHandler from './AnexoV/AnexoVHandler';
import NominasHandler from './Nomina/NominasHandler';
import { SVCCPresentacionContextProvider } from './context';
import IniciarHandler from './Iniciar/IniciarHandler';
import FinalizarHandler from './Finalizar/FinalizarHandler';
import ConstanciaHandler from './Constancia/ConstanciaHandler';

export default function SVCCPage() {
  const [currentTab, setCurrentTab] = useState(0);// Queremos que inicie en la primera pestaña (0)
  const { empresas, isLoading: isLoadingEmpresas } = useEmpresasStore();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);
  const seleccionAutomaticaRef = useRef(false);

  // Seleccionar automáticamente si solo hay una empresa
  useEffect(() => {
    if (!isLoadingEmpresas) {
      if (empresas.length === 1) {
        setEmpresaSeleccionada(empresas[0]);
        seleccionAutomaticaRef.current = true;
      } else if (empresas.length !== 1 && seleccionAutomaticaRef.current) {
        setEmpresaSeleccionada(null);
        seleccionAutomaticaRef.current = false;
      }
    }
  }, [empresas.length, isLoadingEmpresas]);

  const handleEmpresaChange = (
    _event: React.SyntheticEvent,
    newValue: Empresa | null
  ) => {
    setEmpresaSeleccionada(newValue);
    seleccionAutomaticaRef.current = false;
  };

  const getEmpresaLabel = (empresa: Empresa | null): string => {
    if (!empresa) return "";
    return `${empresa.razonSocial} - ${Formato.CUIP(empresa.cuit)}`;
  };

  return (
    <SVCCPresentacionContextProvider empresaCUIT={empresaSeleccionada?.cuit}>
      <Box sx={{ maxWidth: 500, marginBottom: 2 }}>
        <CustomSelectSearch<Empresa>
          options={empresas}
          getOptionLabel={getEmpresaLabel}
          value={empresaSeleccionada}
          onChange={handleEmpresaChange}
          label="Seleccionar Empresa"
          placeholder="Buscar empresa..."
          loading={isLoadingEmpresas}
          loadingText="Cargando empresas..."
          noOptionsText={
            isLoadingEmpresas
              ? "Cargando..."
              : empresas.length === 0
              ? "No hay empresas disponibles"
              : "No se encontraron empresas"
          }
          disabled={isLoadingEmpresas}
        />
      </Box>
      <CustomTab
        currentTab={currentTab}
        onTabChange={(_event, tab) => setCurrentTab(tab)}
        tabs={[
          {
            label: 'Inicio',
            value: 0,
            content: <IniciarHandler />,
          },
          {
            label: 'Portada',
            value: 1,
            content: <PortadaHandler />,
          },
          {
            label: 'Anexo V',
            value: 2,
            content: <AnexoVHandler />,
          },
          {
            label: 'Nóminas',
            value: 3,
            content: <NominasHandler />,
          },
          {
            label: 'Confirma',
            value: 4,
            content: <FinalizarHandler />,
          },
          {
            label: 'Constancia',
            value: 5,
            content: <ConstanciaHandler />,
          },
        ]}
      />
    </SVCCPresentacionContextProvider>
  );
}
