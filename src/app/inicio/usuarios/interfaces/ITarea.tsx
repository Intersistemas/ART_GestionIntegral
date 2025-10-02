export default interface ITarea {
    id: number;
    tareaId: number;
    tareaDescripcion: string;
    moduloId: number;
    moduloDescripcion: string;
    habilitada?: boolean; // Campo opcional para manejar el estado de permisos
}
