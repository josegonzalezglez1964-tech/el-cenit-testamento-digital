export type TipoBien = 'INMUEBLE' | 'CUENTA_BANCARIA' | 'VEHICULO' | 'JOYA' | 'ACCIONES' | 'OTROS';

export interface Bien {
  id: string;
  testamentoId: string;
  descripcion: string;
  tipo: TipoBien;
  valorEstimado?: number;
  moneda: string;
  ubicacion?: string;
  documentoAdjunto?: string;
  herederoAsignadoId?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
}

export interface CreateBienInput {
  descripcion: string;
  tipo: TipoBien;
  valorEstimado?: number;
  moneda: string;
  ubicacion?: string;
  documentoAdjunto?: string;
  herederoAsignadoId?: string;
}

export interface UpdateBienInput {
  descripcion?: string;
  tipo?: TipoBien;
  valorEstimado?: number;
  moneda?: string;
  ubicacion?: string;
  documentoAdjunto?: string;
  herederoAsignadoId?: string;
}