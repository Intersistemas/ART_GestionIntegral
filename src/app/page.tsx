// src/app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession();
  if (session) {
    // Redirige al usuario autenticado al inicio
    redirect('/inicio');
  }else{
     redirect('/login');
  }

  // Muestra la página pública de inicio (landing page)
  return (
    <div>
      <h1>Bienvenido a la aplicación</h1>
      <p>Por favor, <a href="/login">inicia sesión</a> para continuar.</p>
    </div>
  );
}