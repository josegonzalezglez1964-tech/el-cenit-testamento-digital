export interface Heredero {
  id: string;
  testamentoId: string;
  nombre: string;
  apellidos: string;
  dni: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  porcentajeHerencia: number;
  tipo: 'UNIVERSAL' | 'POR_CUOTA' | 'LEGITIMARIO';
  orden: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
}

export interface CreateHerederoInput {
  nombre: string;
  apellidos: string;
  dni: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  porcentajeHerencia: number;
  tipo: 'UNIVERSAL' | 'POR_CUOTA' | 'LEGITIMARIO';
  orden: number;
}

export interface UpdateHerederoInput {
  nombre?: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  porcentajeHerencia?: number;
  tipo?: 'UNIVERSAL' | 'POR_CUOTA' | 'LEGITIMARIO';
  orden?: number;
}