// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

// Mapeo de rutas a tareas de permiso
// Si una ruta requiere una tarea, agrégala aquí.
// Si no, no la incluyas.
const permissionMap: { [key: string]: string | null } = {
  "/inicio/favoritos": "Favoritos",
  "/inicio/empleador/poliza": "empleador_Poliza",
  "/inicio/empleador/cobertura": "empleador_Cobertura",
  "/inicio/empleador/cuentaCorriente": "empleador_CuentaCorriente",
  "/inicio/empleador/formularioRGRL": "empleador_FormularioRGRL",
  "/inicio/empleador/formularioRAR": "empleador_FormularioRAR",
  "/inicio/empleador/siniestros": "empleador_Siniestros",
  "/inicio/empleador/avisosDeObra": "empleador_AvisoDeObra",
  "/inicio/empleador/svcc": "empleador_SVCC",
  "/inicio/empleador/credenciales": "empleador_Credenciales",
  "/inicio/comercializador/cuentaCorriente": "Comercializador_CuentaCorriente",
  "/inicio/comercializador/polizas": "Comercializador_Polizas",
  "/inicio/cotizaciones": "Cotizaciones",
  "/inicio/informes/comisionesMedicas": "Informes_ComisionesMedicas",
  "/inicio/informes/siniestros": "Informes_Siniestros",
  "/inicio/informes/atencionAlPublico": "Informes_AtencionAlPublico",
  "/inicio/usuarios": "Usuarios",
};

type Task = {
  id: number;
  tareaDescripcion: string;
  habilitada: boolean;
};

type Module = {
  id: number;
  codigo: number;
  nombre: string;
  habilitado: boolean;
  tareas: Task[]; 
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  console.log("token_login",token)
  // 1. Redirección de autenticación 
  if (!token && pathname.startsWith('/inicio')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Control de Roles, Modulos y Tareas
  const userRol = (token as any)?.user?.rol || "";
  const userModules: Module[] = (token as any)?.user?.modulos || [];
  const userTasks: Task[] = userModules.map(m => m?.tareas).flat() || [];

  if (userRol?.toLowerCase() == 'administrador') { // Si es Admin, acceso ilimitado
        return NextResponse.next();
  }


  // 3. Control de permisos
  if (token && pathname.startsWith('/inicio')) {
    const requiredTask = permissionMap[pathname];
    
    // Si la ruta no está en el mapa, o no requiere una tarea, significa que no hay restricciones de permisos, así que se permite el acceso.
    if (!requiredTask) {
        return NextResponse.next();
    }

    // Si la ruta requiere una tarea, verifica si el usuario la tiene
    if (!userTasks.some(tarea => tarea.tareaDescripcion.toLowerCase() === requiredTask.toLowerCase())) {
        // Redirige a una página de "acceso denegado"
        return NextResponse.redirect(new URL('/accesoDenegado', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/inicio/:path*"],
};