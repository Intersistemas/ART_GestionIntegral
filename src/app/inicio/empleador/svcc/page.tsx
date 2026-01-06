'use client';
import { useState } from 'react';
import CustomTab from '@/utils/ui/tab/CustomTab';
import PortadaHandler from './Portada/PortadaHandler';
import AnexoVHandler from './AnexoV/AnexoVHandler';
import NominasHandler from './Nomina/NominasHandler';
import { SVCCPresentacionContextProvider } from './context';
import IniciarHandler from './Iniciar/IniciarHandler';
import FinalizarHandler from './Finalizar/FinalizarHandler';
import ConstanciaHandler from './Constancia/ConstanciaHandler';

export default function SVCCPage() {
  const [currentTab, setCurrentTab] = useState(0);// Queremos que inicie en la primera pestaña (0)
  return (
    <SVCCPresentacionContextProvider>
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
