export default interface IModulo {
  id: number;
  codigo: string;
  nombre: string;
  habilitado: boolean;
  tareas: {
    id: number;
    tareaId: number;
    tareaDescripcion: string;
    habilitada: boolean;
  }[];
}