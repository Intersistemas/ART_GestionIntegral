"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
import { BsSearch, BsBoxArrowRight, BsPersonCircle } from "react-icons/bs";
import { GoBellFill } from "react-icons/go";
import styles from './Navbar.module.css';
import Image from 'next/image';
import { useState } from 'react';
import CustomButton from "@/utils/ui/button/CustomButton";
import Formato from "@/utils/Formato";

function Navbar() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeAndNavigate = () => {
    setIsModalOpen(false);
  };

  // Corrected way to access nombre and cuit
  const user = session?.user as any;
  const nombre = user?.nombre;
  const cuit = user?.cuit;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/icons/LogoTexto.svg" 
            alt="ART Mutual Rural Logo"
            width={170}
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
                <GoBellFill className={styles.iconButton} />
              </li>
              <li className={styles.menuItem} onClick={toggleModal}>
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                ) : (
                  <BsPersonCircle className={styles.iconButton} />
                )}
              </li>
              <li className={styles.menuItem}>
                <SignOutButton icon={<BsBoxArrowRight className={styles.iconButton} />} />
              </li>
            </>
          ) : (
            null
          )}
        </ul>

        {isModalOpen && (
          <div className={styles.modalContainer}>
            <div className={styles.modalContent}>
              <button className={styles.closeButton} onClick={toggleModal}>&times;</button>
              
              <div className={styles.avatarSection}>
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="User Avatar"
                    width={80}
                    height={80}
                    className={styles.largeAvatar}
                  />
                ) : (
                  <BsPersonCircle className={styles.largeIcon} />
                )}
              </div>

              <div className={styles.userData}>
                <p className={styles.userName}>{nombre || 'N/A'}</p>
                <p className={styles.userEmail}>{user?.email}</p>
                <p className={styles.userCuit}>CUIT/CUIL: {Formato.CUIP(cuit) || 'N/A'}</p> 
              </div>

              <Link href="/inicio/perfil" className={styles.profileButtonWrapper}>
                <CustomButton onClick={closeAndNavigate}>
                  Ver Perfil
                </CustomButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;