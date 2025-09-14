// src/app/layout.tsx
import Providers from './Providers';
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
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}