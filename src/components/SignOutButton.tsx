// components/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import styles from './Navbar.module.css';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className={styles.menuLink} // Aplica la clase del enlace para el estilo
    >
      Salir
    </button>
  );
}