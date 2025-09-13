"use client";
import * as React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { BsFillStarFill, BsLayoutSplit, BsBriefcaseFill, BsPenFill, BsPersonFillGear, BsFolder, BsHouseGear, BsCalendar2Plus, BsBarChartLineFill, BsList, BsChevronDown,
   BsChevronRight, BsTerminal, BsFileText, BsCreditCard, BsCardChecklist, BsGraphUpArrow, BsClipboard2Data } from 'react-icons/bs';
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { IconType } from 'react-icons';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import styles from './Sidebar.module.css';

// Define la estructura de los datos del menú
interface MenuItem {
  name: string;
  icon: IconType;
  link?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: "Favoritos",
    icon: BsFillStarFill,
    link: "/favoritos",
  },
  {
    name: "Dashboard",
    icon: BsLayoutSplit,
    link: "/dashboard",
  },
  {
    name: "Empleador",
    icon: BsBriefcaseFill,
    children: [
      { name: "Póliza", icon: BsFileText, link: "/empleador/poliza" },
      { name: "Cobertura", icon: BsCardChecklist, link: "/empleador/cobertura" },
      { name: "Cuenta Corriente", icon: BsGraphUpArrow, link: "/empleador/cuentacorriente" },
      { name: "Formulario RGRL", icon: BsClipboard2Data, link: "/empleador/formularioRGRL" },
      { name: "Formulario RAR", icon: BsClipboard2Data, link: "/empleador/formularioRAR" },
      { name: "Siniestros", icon: BsCalendar2Plus, link: "/empleador/siniestros" },
      { name: "Avisos de Obra", icon: BsHouseGear, link: "/empleador/avisosdeobra" },
      { name: "SVCC", icon: BsFolder, link: "/empleador/svcc" },
      { name: "Credenciales", icon: BsCreditCard, link: "/empleador/credenciales" },
    ],
  },
  {
    name: "Comercializador",
    icon: BsBriefcaseFill,
    children: [
      { name: "Cuenta Corriente", icon: BsGraphUpArrow, link: "/comercializador/cuentacorriente" },
      { name: "Polizas", icon: BsList, link: "/comercializador/polizas" },
    ],
  },
  {
    name: "Cotizaciones",
    icon: FaFileInvoiceDollar,
    link: "/cotizaciones",
  },
  {
    name: "Informes",
    icon: BsBarChartLineFill,
    link: "/informes",
  },
  {
    name: "Usuarios",
    icon: BsPersonFillGear,
    link: "/usuarios",
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleMenuClick = (menuName: string) => {
    setOpenMenus(prevOpenMenus => {
      if (prevOpenMenus.includes(menuName)) {
        return prevOpenMenus.filter(name => name !== menuName);
      } else {
        return [...prevOpenMenus, menuName];
      }
    });
  };

  const renderMenuItems = (items: MenuItem[], isSubmenu: boolean = false) => {
    return items.map((item) => {
      const isMenuOpen = openMenus.includes(item.name);
      
      const listItemButtonClasses = `${styles.menuItemButton} ${isOpen ? styles.menuItemButtonOpen : styles.menuItemButtonClosed} ${isSubmenu ? styles.submenuItem : ''}`;
      const listItemIconClasses = `${styles.icon} ${isOpen ? styles.iconOpen : styles.iconClosed}`;
      const listItemTextClasses = `${isOpen ? styles.linkTextVisible : styles.linkTextHidden}`;
      const arrowIconClasses = `${styles.accordionIcon}`;

      return (
        <React.Fragment key={item.name}>
          <ListItem disablePadding className={styles.listItem}>
            {item.children ? (
              <>
                <ListItemButton
                  onClick={() => handleMenuClick(item.name)}
                  className={listItemButtonClasses}
                >
                  <ListItemIcon className={listItemIconClasses}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    className={listItemTextClasses}
                  />
                  {isOpen && (isMenuOpen ? <BsChevronDown className={arrowIconClasses} /> : <BsChevronRight className={arrowIconClasses} />)}
                </ListItemButton>
                <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding className={styles.submenu}>
                    {renderMenuItems(item.children, true)}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                component={Link}
                href={item.link || "#"}
                className={listItemButtonClasses}
              >
                <ListItemIcon className={listItemIconClasses}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  className={listItemTextClasses}
                />
              </ListItemButton>
            )}
          </ListItem>
        </React.Fragment>
      );
    });
  };

  return (
    <Box
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
    >
      <Box 
        className={`${styles.header} ${isOpen ? styles.headerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className={styles.toggleButton}>
          <BsList />
        </button>
        {isOpen && <span className={styles.headerText}>ART Gestión</span>}
      </Box>
      <List className={styles.listContainer}>
        {renderMenuItems(menuItems)}
      </List>
    </Box>
  );
};

export default Sidebar;