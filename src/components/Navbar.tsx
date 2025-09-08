// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
import { BsSearch, BsBell } from "react-icons/bs";
import styles from './Navbar.module.css';
import Image from 'next/image';
import logo from '../../public/media/ARTIcon_SVG.svg';

function Navbar() {
  const { data: session, status } = useSession();
  console.log("session:", session);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/">
          <div className={styles.logoContainer}>
            <Image
              src={logo}
              alt="ART Gestión Integral Logo"
              width={80}
              height={20}
            />
            <h1 className={styles.title}>ART Gestión Integral</h1>
          </div>
        </Link>
        <ul className={styles.menu}>
          {session ? (
            <>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className={styles.searchInput}
                />
                <BsSearch className={styles.searchIcon} />
              </div>
              <li className={styles.menuItem}>
                <BsBell className={styles.bellIcon} />
              </li>
              <li className={styles.menuItem}>
                <Link href="/perfil" className={styles.menuLink}>
                  Perfil
                </Link>
              </li>
              <li className={styles.menuItem}>
                <SignOutButton />
              </li>
            </>
          ) : (
            null // O renderizar un componente de ingreso si es necesario
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
