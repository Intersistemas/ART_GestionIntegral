interface UsuarioRow {
  id: number;
  cuit: string;
  nombre: string;
  tipo: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  // Add other fields if needed
}
export default UsuarioRow;