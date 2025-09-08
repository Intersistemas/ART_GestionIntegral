"use client";
import { useSession, signOut } from "next-auth/react";

function ProfilePage() {
  const { data: session, status } = useSession();

  // Muestra una pantalla de carga mientras se obtienen los datos
  if (status === "loading") {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  // Si no hay sesión, puedes redirigir al usuario o mostrar un mensaje
  if (!session) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-xl">No has iniciado sesión.</p>
      </div>
    );
  }

  // Solo toma las propiedades que son seguras de serializar
  const sessionData = {
    user: {
      name: session.user?.name,
      email: session.user?.email,
      image: session.user?.image,
      nombre: session.user?.nombre,
      cuit: session.user?.cuit,
      roles: session.user?.roles,
    },
    expires: session.expires,
  };

  console.log("sessionData",sessionData)

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-y-10 items-center justify-center">
      <h1 className="font-bold text-3xl">Perfil</h1>

      <pre className="bg-zinc-800 p-4">
        {JSON.stringify(sessionData, null, 2)}
      </pre>

    </div>
  );
}

export default ProfilePage;
