"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
import { BsSearch, BsBoxArrowRight, BsPersonCircle } from "react-icons/bs";
import { GoBellFill } from "react-icons/go";
import styles from './Navbar.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CustomButton from "@/utils/ui/button/CustomButton";
import Formato from "@/utils/Formato";
import { getFormulariosRGRL, getEstablecimientosEmpresa, formatEstablecimientoLabel } from '@/data/rgrlAPI';
import { useAuth } from '@/data/AuthContext';

function Navbar() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [missingCount, setMissingCount] = useState<number>(0);
  const [loadingBell, setLoadingBell] = useState<boolean>(false);
  const [missingList, setMissingList] = useState<any[]>([]);

  const toggleModal = () => {
    const next = !isModalOpen;
    setIsModalOpen(next);
    if (next) setBellOpen(false);
  };

  const closeAndNavigate = () => {
    setIsModalOpen(false);
  };

  // Corrected way to access nombre and cuit
  const user = session?.user as any;
  const nombre = user?.nombre;
  const cuit = user?.cuit;
  const auth = useAuth();
  const empresaCUIT = (auth?.user as any)?.empresaCUIT ?? cuit ?? 0;

  const toggleBell = () => {
    setBellOpen(v => {
      const next = !v;
      if (next) setIsModalOpen(false);
      return next;
    });
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingBell(true);
        const c = Number(empresaCUIT ?? 0);
        if (!c || Number.isNaN(c)) {
          setMissingCount(0);
          setMissingList([]);
          return;
        }
        const [ests, forms] = await Promise.all([
          getEstablecimientosEmpresa(c),
          // Pedimos todos los formularios para que el cálculo de notificaciones sea correcto
          getFormulariosRGRL(c, true),
        ]);

        const formsEstIds = new Set((forms ?? []).map((f: any) => Number(f.internoEstablecimiento)).filter(Boolean));

        const missing = (ests ?? []).filter((e: any) => !formsEstIds.has(Number(e.interno)));
        if (!mounted) return;
        setMissingCount(missing.length);
        setMissingList(missing);
      } catch (err) {
        console.error('Error cargando notificaciones RGRL', err);
      } finally {
        if (mounted) setLoadingBell(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [empresaCUIT]);


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
   <li className={styles.menuItem} onClick={toggleBell}>
                <div className={styles.bellWrapper}>
                  <GoBellFill className={`${styles.iconButton} ${missingCount > 0 ? styles.iconAlert : ''}`} />
                  {missingCount > 0 && <span className={styles.badge}>!</span>}
                  {bellOpen && (
                    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={toggleBell}>&times;</button>
                        <div style={{ fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>Notificaciones RGRL</div>
                        {loadingBell ? (
                          <div className={styles.bellItem}>Cargando...</div>
                        ) : (
                          <>
                            {missingList.length === 0 ? (
                              <div className={styles.bellItem}>No hay notificaciones</div>
                            ) : (
                              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                                {missingList.map((m, i) => (
                                  <div className={styles.bellItem} key={i}>
                                    <div className={styles.bellItemTitle}>Falta formulario RGRL en:</div>
                                    <div className={styles.bellItemName}>{formatEstablecimientoLabel(m)}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className={styles.bellFooter}>
                              <CustomButton onClick={() => { setBellOpen(false); window.location.href = '/inicio/empleador/formularioRGRL'; }}>Ver Formularios</CustomButton>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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