"use client";

import { useAuth } from '@/data/AuthContext';
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";
import Persona from './types/persona';


const { useGetPersonal } = gestionEmpleadorAPI;

export default function CoberturaPage() {

  const { data: personal} = useGetPersonal();
  const { user, status } = useAuth();   

  console.log("personal",personal)

  return ( 
  <div>a</div> 

    
  );
   /* roles: roles || [],
    loading: rolesLoading,
    error: rolesError,*/
};