import ITarea from "./ITarea";

export default interface UsuarioRow {
  id: number;
  cuit: string;
  nombre: string;
  tipo: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  cargo: string;
  rol: string;
  empresaId: number;
  tareas: ITarea[];
  // Add other fields if needed
}
