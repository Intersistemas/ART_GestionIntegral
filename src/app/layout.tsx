"use client";

import { usePathname } from "next/navigation";
import Providers from "./Providers";
import Navbar from "@/components/Navbar";
import ClientLayoutWrapper from "./ClientLayoutWrapper"; // Reintegramos el wrapper
import "./normalize.css";
import "@/styles/globals.css";

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
  const isSigninPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body>
        <Providers>
          {!isSigninPage && <Navbar />}
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}