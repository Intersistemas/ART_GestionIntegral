"use client";
import Link from 'next/link';
import styles from './Sidebar.module.css';
import { useState } from 'react';
import { BsPenFill, BsWechat, BsFolder, BsHouseGear, BsCalendar2Plus, BsPerson, BsCurrencyDollar, BsList, BsChevronDown, BsChevronRight, BsTerminal, BsFileText , BsCreditCard, BsCardChecklist , BsGraphUpArrow, BsClipboard2Data } from 'react-icons/bs';
import { IconType } from 'react-icons';

// Define la estructura de los datos del menú
interface MenuItem {
  name: string;
  icon: IconType;
  link?: string;
  children?: MenuItem[];
}

// Datos de ejemplo para el menú
const menuItems: MenuItem[] = [
  {
    name: "Empleador",
    icon: BsPerson,
    children: [
      { name: "Póliza", icon: BsFileText , link: "/empleador/poliza" },
      { name: "Cobertura", icon: BsCardChecklist , link: "/empleador/cobertura" },
      { name: "Cuenta Corriente", icon: BsGraphUpArrow, link: "/empleador/cuentacorriente" },
      { name: "Formulario RGRL", icon: BsClipboard2Data , link: "/empleador/formularioRGRL" },
      { name: "Formulario RAR", icon: BsClipboard2Data , link: "/empleador/formularioRAR" },
      { name: "Siniestros", icon: BsCalendar2Plus , link: "/empleador/siniestros" },
      { name: "Avisos de Obra", icon: BsHouseGear , link: "/empleador/avisosdeobra" },
      { name: "SVCC", icon: BsFolder, link: "/empleador/svcc" },
      { name: "Credenciales", icon: BsCreditCard, link: "/empleador/credenciales" },
    ],
  },
  {
    name: "Cotizador",
    icon: BsCurrencyDollar,
    children: [
      { name: "Cuenta Corriente", icon: BsGraphUpArrow, link: "/cotizador/cuentacorriente" },
      { name: "Carga archivos DDJJ", icon: BsList, link: "/cotizador/cuentas/ddjj" },
    ],
  },
  {
    name: "Consultas",
    icon: BsWechat ,
    link: "/consultas",
  },
  {
    name: "Gestiones",
    icon: BsPenFill ,
    link: "/gestiones",
  },
  {
    name: "Parametrización",
    icon: BsTerminal,
    link: "/parametrizacion",
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
      
      return (
        <li key={item.name} className={styles.menuItem}>
          {item.children ? (
            <>
              <div 
                onClick={() => handleMenuClick(item.name)} 
                className={`${styles.link} ${styles.collapsibleLink}`}
              >
                <item.icon className={styles.icon} />
                {isOpen && <span className={styles.linkText}>{item.name}</span>}
                {isOpen && (isMenuOpen ? <BsChevronDown className={styles.accordionIcon} /> : <BsChevronRight className={styles.accordionIcon} />)}
              </div>
              <ul className={`${styles.submenu} ${isMenuOpen ? styles.submenuOpen : ''}`}>
                {/* ¡Aquí está el cambio clave! Pasas `true` para la recursión */}
                {renderMenuItems(item.children, true)}
              </ul>
            </>
          ) : (
            <Link href={item.link || "#"} className={`${styles.link} ${isSubmenu ? styles.sublink : ''}`}>
              <item.icon className={styles.icon} />
              {isOpen && <span className={styles.linkText}>{item.name}</span>}
            </Link>
          )}
        </li>
      );
    });
  };

  return (
 <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
<nav className={styles.nav}>
        <ul>
          {renderMenuItems(menuItems)}
        </ul>
      </nav>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
        <BsList />
      </button>
    </aside>
  );
};

export default Sidebar;