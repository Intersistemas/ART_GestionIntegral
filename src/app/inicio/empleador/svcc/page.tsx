'use client';
import CustomTab from '@/utils/ui/tab/CustomTab';
import PortadaHandler from './Portada/PortadaHandler';
import AnexoVHandler from './AnexoV/Sustancias/AnexoVHandler';
import NominasHandler from './Nomina/NominasHandler';
import { useState } from 'react';
import CustomButton from '@/utils/ui/button/CustomButton';
import { SVCCPresentacionContextProvider, useSVCCPresentacionContext } from './context';

export default function SVCCPage() {
  return (
    <SVCCPresentacionContextProvider>
      <Contextualized />
    </SVCCPresentacionContextProvider>
  );
}

function Contextualized() {
  const {
    ultima: {
      isLoading,
      data: presentacion,
    },
    nueva: { trigger: onNueva },
    finaliza: { trigger: onFinaliza },
  } = useSVCCPresentacionContext();
  const [currentTab, setCurrentTab] = useState(0);// Queremos que inicie en la primera pestaña (0)

  return (
    <CustomTab
      currentTab={currentTab}
      onTabChange={(_event, tab) => setCurrentTab(tab)}
      tabs={[
        {
          label: 'Inicio',
          value: 0,
          content: (
            <CustomButton
              variant="contained"
              color="primary"
              size="large"
              onClick={() => onNueva({ idMotivo: 1 })}
              disabled={
                isLoading
                || (
                  presentacion?.interno != null
                  && presentacion.presentacionFecha == null
                )
              }
            >
              Iniciar Nueva Presentación
            </CustomButton>
          ),
        },
        {
          label: 'Portada',
          value: 1,
          content: (
            <PortadaHandler />
          ),
        },
        {
          label: 'Anexo V',
          value: 2,
          content: (
            <AnexoVHandler />
          ),
        },
        {
          label: 'Nóminas',
          value: 3,
          content: (
            <NominasHandler />
          ),
        },
        {
          label: 'Confirma',
          value: 4,
          content: (
            <CustomButton
              variant="contained"
              color="primary"
              size="large"
              onClick={() => onFinaliza({ ...presentacion })}
              disabled={
                isLoading
                || (
                  presentacion?.interno == null
                  || presentacion.presentacionFecha != null
                )
              }
            >
              Confirma presentación
            </CustomButton>
          ),
        },
      ]}
    />
  );
}
