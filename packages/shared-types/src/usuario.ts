export type RolUsuario = 'TESTADOR' | 'NOTARIO' | 'ADMIN';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento?: Date;
  direccion?: string;
  telefono?: string;
  rol: RolUsuario;
  verificado: boolean;
  fechaRegistro: Date;
  ultimoAcceso?: Date;
  avatar?: string;
}

export interface CreateUsuarioInput {
  email: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento?: Date;
  direccion?: string;
  telefono?: string;
  rol?: RolUsuario;
}

export interface UpdateUsuarioInput {
  email?: string;
  nombre?: string;
  apellidos?: string;
  dni?: string;
  fechaNacimiento?: Date;
  direccion?: string;
  telefono?: string;
  avatar?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Usuario;
  token: string;
  expiresAt: Date;
}