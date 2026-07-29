export type TipoFirma = 'DNIE' | 'FIRMA_AVANZADA' | 'VIDEOCONFERENCIA';

export interface Firma {
  id: string;
  testamentoId: string;
  firmanteId: string;
  tipoFirma: TipoFirma;
  fechaFirma: Date;
  hashDocumento: string;
  evidencia?: string;
  notarioId?: string;
  verificado: boolean;
  fechaCreacion: Date;
}

export interface CreateFirmaInput {
  testamentoId: string;
  firmanteId: string;
  tipoFirma: TipoFirma;
  hashDocumento: string;
  evidencia?: string;
  notarioId?: string;
}

export interface VerificarFirmaInput {
  firmaId: string;
  notarioId: string;
  verificado: boolean;
  observaciones?: string;
}