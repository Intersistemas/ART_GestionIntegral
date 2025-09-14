// src/app/RootLayout.tsx
import React from 'react';
import Providers from './Providers'; // Importa el componente Providers
import "./normalize.css";
import "@/styles/globals.css";
import ClientSessionWrapper from './ClientSessionWrapper';

export const metadata = {
  title: "ART Gestión Integral",
  description: "ART - App Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientSessionWrapper>{children}</ClientSessionWrapper>
        </Providers>
      </body>
    </html>
  );
}