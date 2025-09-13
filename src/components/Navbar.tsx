"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
// Importaciones actualizadas para usar los iconos de relleno (fill)
import { BsSearch, BsFillBellFill, BsPersonFill, BsBoxArrowRight } from "react-icons/bs";
import styles from './Navbar.module.css';
import Image from 'next/image';

function Navbar() {
  const { data: session, status } = useSession();
  console.log("session:", session);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/icons/LogoTexto.svg" 
            alt="ART Mutual Rural Logo"
            width={200}
            height={60} 
          />
        </Link>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.searchInput}
          />
          <BsSearch className={styles.searchIcon} />
        </div>
        <ul className={styles.menu}>
          {session ? (
            <>
              <li className={styles.menuItem}>
                <BsFillBellFill className={styles.iconButton} />
              </li>
              <li className={styles.menuItem}>
                <Link href="/perfil" className={styles.menuLink}>
                  <BsPersonFill className={styles.iconButton} />
                </Link>
              </li>
              <li className={styles.menuItem}>
                <SignOutButton icon={<BsBoxArrowRight className={styles.iconButton} />} />
              </li>
            </>
          ) : (
            null
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;