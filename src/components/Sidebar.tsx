"use client";
import * as React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Importa usePathname
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
      link: "/dashboard/favoritos",
    },
    {
      name: "Dashboard",
      icon: BsLayoutSplit,
      link: "/dashboard/dashboard",
    },
    {
      name: "Empleador",
      icon: BsBriefcaseFill,
      children: [
        { name: "Póliza", icon: BsFileText, link: "/dashboard/empleador/poliza" },
        { name: "Cobertura", icon: BsCardChecklist, link: "/dashboard/empleador/cobertura" },
        { name: "Cuenta Corriente", icon: BsGraphUpArrow, link: "/dashboard/empleador/cuentaCorriente" },
        { name: "Formulario RGRL", icon: BsClipboard2Data, link: "/dashboard/empleador/formularioRGRL" },
        { name: "Formulario RAR", icon: BsClipboard2Data, link: "/dashboard/empleador/formularioRAR" },
        { name: "Siniestros", icon: BsCalendar2Plus, link: "/dashboard/empleador/siniestros" },
        { name: "Avisos de Obra", icon: BsHouseGear, link: "/dashboard/empleador/avisosDeObra" },
        { name: "SVCC", icon: BsFolder, link: "/dashboard/empleador/svcc" },
        { name: "Credenciales", icon: BsCreditCard, link: "/dashboard/empleador/credenciales" },
      ],
    },
    {
      name: "Comercializador",
      icon: BsBriefcaseFill,
      children: [
        { name: "Cuenta Corriente", icon: BsGraphUpArrow, link: "/dashboard/comercializador/cuentaCorriente" },
        { name: "Polizas", icon: BsList, link: "/dashboard/comercializador/polizas" },
      ],
    },
    {
      name: "Cotizaciones",
      icon: FaFileInvoiceDollar,
      link: "/dashboard/cotizaciones",
    },
    {
      name: "Informes",
      icon: BsBarChartLineFill,
      children: [
        { name: "Comisiones Médicas", icon: BsGraphUpArrow, link: "/dashboard/informes/comisionesMedicas" },
        { name: "Siniestros", icon: BsList, link: "/dashboard/informes/siniestros" },
        { name: "Atención Al Público", icon: BsList, link: "/dashboard/informes/atencionAlPublico" },
      ],
    },
    {
      name: "Usuarios",
      icon: BsPersonFillGear,
      link: "/dashboard/usuarios",
    },
];

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
    // Estado para la visualización (abierto/cerrado)
    const [isOpen, setIsOpen] = useState(false);
    // Nuevo estado para el bloqueo (abierto con clic)
    const [isLocked, setIsLocked] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const pathname = usePathname(); // Obtiene la ruta actual

    const handleMenuClick = (menuName: string) => {
      setOpenMenus(prevOpenMenus => {
        if (prevOpenMenus.includes(menuName)) {
          return prevOpenMenus.filter(name => name !== menuName);
        } else {
          return [...prevOpenMenus, menuName];
        }
      });
    };

    const handleToggleLock = () => {
      // Si ya está bloqueado, lo desbloquea y minimiza el sidebar.
      if (isLocked) {
        setIsLocked(false);
        setIsOpen(false);
      } else {
        // Si no está bloqueado, lo bloquea y lo expande
        setIsLocked(true);
        setIsOpen(true);
      }
    };

    const handleMouseEnter = () => {
      // El sidebar siempre se abre al pasar el cursor
      setIsOpen(true);
    };

    const handleMouseLeave = () => {
      // El sidebar solo se cierra si no está bloqueado
      if (!isLocked) {
        setIsOpen(false);
      }
    };

    const renderMenuItems = (items: MenuItem[], isSubmenu: boolean = false) => {
        return items.map((item) => {
            const isMenuOpen = openMenus.includes(item.name);
            const isActive = item.link === pathname; // Verifica si el ítem está activo
            
            const listItemButtonClasses = `${styles.menuItemButton} ${isOpen ? styles.menuItemButtonOpen : styles.menuItemButtonClosed} ${isSubmenu ? styles.submenuItem : ''} ${isActive ? styles.activeLink : ''}`;
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Box 
                className={`${styles.header} ${isOpen ? styles.headerOpen : ''} ${isLocked ? styles.headerLocked : ''}`}
                onClick={handleToggleLock}
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