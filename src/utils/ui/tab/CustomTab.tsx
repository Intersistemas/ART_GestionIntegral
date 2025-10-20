//src/utils/ui/tab/CustomTab.tsx

import React, { useState, ReactNode, SyntheticEvent } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import styles from './CustomTab.module.css';

// Define la estructura de cada "tab"
interface TabItem {
  label: string;
  content: ReactNode; // El contenido que se mostrará en el panel
}

// Define las propiedades del componente CustomTabs
interface CustomTabsProps {
  tabs: TabItem[];
  initialTabIndex?: number; // Opcional: el índice de la pestaña seleccionada por defecto
}

// Interfaz para el Panel de la pestaña
interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

// Componente auxiliar para el Panel de Contenido de cada Tab
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={styles.tabPanel} // Aplicamos la clase para padding o estilos del panel
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* Aquí se podría usar el componente Typography, pero dejaremos el children directo */}
          {children}
        </Box>
      )}
    </div>
  );
}

// Función auxiliar para las propiedades de accesibilidad
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Componente principal CustomTabs
const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, initialTabIndex = 0 }) => {
  const [value, setValue] = useState(initialTabIndex);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* El contenedor principal del Tabs. 
        Aplicamos la clase styles.customTabsBar al componente MUI Tabs para estilizarlo.
      */}
      <Box className={styles.tabsContainer}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="custom tabs"
          className={styles.customTabsBar} 
          // Opcional: Estilo del indicador (la línea inferior)
          // La línea inferior se estiliza mejor con CSS Modules o el prop sx directamente.
          // Aquí utilizaremos CSS Modules para el color principal.
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              {...a11yProps(index)}
              className={styles.customTab} // Clase para cada Tab individual
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Renderizado de los Paneles de Contenido */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default CustomTabs;