import IModulo from "./IModulo";

export default interface UsuarioRow {
  id: number;
  cuit: string;
  nombre: string;
  tipo: string;
  userName: string;
  email: string;
  estado: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  cargo: string;
  rol: string;
  empresaId: number;
  deletedDate: string | null;
  modulos: IModulo[];
  // Add other fields if needed
}
