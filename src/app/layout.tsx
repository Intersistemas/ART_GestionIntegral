import Providers from "./Providers";
import Navbar from "../components/Navbar";
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
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
