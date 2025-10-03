export type Persona = {
  interno: number;
  CUIL: number;
  nombre: string;
}

export type Parameters = {
  cuit?: number;
  periodo?: number;
  page?: string;
  sort?: string;
};

export default Persona;
