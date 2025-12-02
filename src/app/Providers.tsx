// src/app/Providers.tsx
"use client";

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';
import React from 'react';
import { AuthProvider } from '@/data/AuthContext'; // Importa tu AuthProvider
import EmotionCacheProvider from './EmotionCacheProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <SessionProvider
        basePath="/api/auth"
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        <ThemeProvider theme={theme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </SessionProvider>
    </EmotionCacheProvider>
  );
}