export type Persona = {
  interno: number;
  CUIL: number;
  nombre: string;
}

export interface Parameters {
  cuit?: number;
  periodo?: number;
  page?: string;
  sort?: string;
};

export default Persona;
