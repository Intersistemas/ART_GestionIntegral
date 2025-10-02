"use client";

import { useAuth } from '@/data/AuthContext';
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";

//const { useGetAll, useGetRoles, registrar } = UsuarioAPI;
const { getPersonal } = gestionEmpleadorAPI;

export default function CoberturaPage() {

  //const { data: roles, error: rolesError, isLoading: rolesLoading } = useGetRoles();
  const { user, status } = useAuth();   


  return ( <div>a</div> );
   /* roles: roles || [],
    loading: rolesLoading,
    error: rolesError,*/
};