// src/app/Providers.tsx
"use client";

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Si tienes más proveedores (como el tema de MUI), agrégalos aquí.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}