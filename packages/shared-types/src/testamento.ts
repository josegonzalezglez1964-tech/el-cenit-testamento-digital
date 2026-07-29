export type EstadoTestamento = 'BORRADOR' | 'PENDIENTE_FIRMA' | 'FIRMADO' | 'REGISTRADO' | 'ANULADO';

export interface Testamento {
  id: string;
  testadorId: string;
  titulo: string;
  contenido: string;
  estado: EstadoTestamento;
  fechaCreacion: Date;
  fechaUltimaModificacion: Date;
  fechaFirma?: Date;
  fechaRegistroBlockchain?: Date;
  hashBlockchain?: string;
  herederos: Heredero[];
  bienes: Bien[];
}

export interface Heredero {
  id: string;
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

export interface Bien {
  id: string;
  descripcion: string;
  tipo: 'INMUEBLE' | 'CUENTA_BANCARIA' | 'VEHICULO' | 'JOYA' | 'ACCIONES' | 'OTROS';
  valorEstimado?: number;
  moneda: string;
  ubicacion?: string;
  documentoAdjunto?: string;
  herederoAsignadoId?: string;
}

export interface Firma {
  id: string;
  testamentoId: string;
  firmanteId: string;
  tipoFirma: 'DNIE' | 'FIRMA_AVANZADA' | 'VIDEOCONFERENCIA';
  fechaFirma: Date;
  hashDocumento: string;
  evidencia?: string;
  notarioId?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento?: Date;
  direccion?: string;
  telefono?: string;
  rol: 'TESTADOR' | 'NOTARIO' | 'ADMIN';
  verificado: boolean;
  fechaRegistro: Date;
}