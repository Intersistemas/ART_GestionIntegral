"use client"; // Esta directiva es necesaria para usar hooks del lado del cliente

import { usePathname } from "next/navigation";
import Providers from "./Providers";
import Navbar from "@/components/Navbar";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
import "./normalize.css";
import "./globals.css";

export const metadata = {
  title: "ART Gestión Integral",
  description: "ART - App Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSigninPage = pathname === "/login";

  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Renderiza el Navbar solo si no es la página de inicio de sesión */}
          {!isSigninPage && <Navbar />}
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
