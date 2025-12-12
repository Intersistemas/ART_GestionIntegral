'use client';
import CustomTab from '@/utils/ui/tab/CustomTab';
import PortadaHandler from './Portada/PortadaHandler';
import AnexoVHandler from './AnexoV/Sustancias/AnexoVHandler';
import NominasHandler from './Nomina/NominasHandler';
import { SyntheticEvent, useState } from 'react';
import CustomButton from '@/utils/ui/button/CustomButton';


function SVCCPage() {

  const initialTabIndex = 0; // Queremos que inicie en la primera pestaña (0)
  const [currentTab, setCurrentTab] = useState<number>(initialTabIndex);
  const [apiQuery, setApiQuery] = useState({
		action: "init",
		timeStamp: new Date(),
	});


  // 2. HANDLER DE CAMBIO: Convertimos el valor (string) que devuelve MUI a number
  const handleTabChange = (event: SyntheticEvent, newTabValue: string | number) => {
      setCurrentTab(newTabValue as number); 
  };
      

  const handleIniciaPresentacion = () => {
		const newApiQuery = {
			action: "nueva",
			timeStamp: new Date(),
		};
		setApiQuery(newApiQuery);
		setCurrentTab(1); // Cambia a la pestaña "Portada"
	};

  const tabItems = [
      {
          label: 'Inicio',
          value: 0,
          content: (
              
              <CustomButton
								variant="contained"
								color="primary"
								size="large"
								onClick={handleIniciaPresentacion}
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
              <div>Contenido de Confirma</div>
          ),
      },
  ];


  return (
    <div>
      <CustomTab 
            tabs={tabItems} 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
        /> 
    </div>
  )
}

export default SVCCPage