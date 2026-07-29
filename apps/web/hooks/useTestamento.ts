import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface Heredero {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  parentesco: 'conyuge' | 'hijo' | 'nieto' | 'padre' | 'hermano' | 'otro';
  porcentaje: number;
  tipo: 'forzoso' | 'voluntario';
}

export interface Bien {
  id: string;
  tipo: 'inmueble' | 'cuenta_bancaria' | 'vehiculo' | 'acciones' | 'cripto' | 'otro';
  descripcion: string;
  valorEstimado: number;
  referencia?: string;
  ubicacion?: string;
}

export interface Testamento {
  id?: string;
  pasoActual: number;
  datosIdentidad?: {
    nombre: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: string;
    estadoCivil: string;
    domicilio: any;
  };
  herederos: Heredero[];
  bienes: Bien[];
  disposiciones: {
    albacea?: string;
    testamentoVital: boolean;
    tutelaMenores?: string;
    legadoSolidario?: {
      ong: string;
      porcentaje: number;
    };
  };
  estado: 'borrador' | 'firmado' | 'registrado' | 'revocado';
  hashDocumento?: string;
  selloTiempo?: string;
  blockchainTx?: string;
}

interface TestamentoState {
  testamento: Testamento;
  setPaso: (paso: number) => void;
  setDatosIdentidad: (datos: any) => void;
  addHeredero: (heredero: Heredero) => void;
  removeHeredero: (id: string) => void;
  addBien: (bien: Bien) => void;
  removeBien: (id: string) => void;
  setDisposiciones: (disp: any) => void;
  validarPaso: (paso: number) => Promise<boolean>;
  guardarBorrador: () => Promise<void>;
  firmarTestamento: () => Promise<void>;
}

export const useTestamentoStore = create<TestamentoState>()(
  immer(
    persist(
      (set, get) => ({
        testamento: {
          pasoActual: 1,
          herederos: [],
          bienes: [],
          disposiciones: {
            testamentoVital: false,
          },
          estado: 'borrador',
        },

        setPaso: (paso) => {
          set((state) => {
            state.testamento.pasoActual = paso;
          });
        },

        setDatosIdentidad: (datos) => {
          set((state) => {
            state.testamento.datosIdentidad = datos;
          });
        },

        addHeredero: (heredero) => {
          set((state) => {
            state.testamento.herederos.push(heredero);
          });
        },

        removeHeredero: (id) => {
          set((state) => {
            state.testamento.herederos = state.testamento.herederos.filter(h => h.id !== id);
          });
        },

        addBien: (bien) => {
          set((state) => {
            state.testamento.bienes.push(bien);
          });
        },

        removeBien: (id) => {
          set((state) => {
            state.testamento.bienes = state.testamento.bienes.filter(b => b.id !== id);
          });
        },

        setDisposiciones: (disp) => {
          set((state) => {
            state.testamento.disposiciones = { ...state.testamento.disposiciones, ...disp };
          });
        },

        validarPaso: async (paso) => {
          const { testamento } = get();
          switch (paso) {
            case 1:
              return !!testamento.datosIdentidad?.nombre && !!testamento.datosIdentidad?.dni;
            case 2:
              return testamento.herederos.length > 0 &&
                     testamento.herederos.reduce((sum, h) => sum + h.porcentaje, 0) <= 100;
            case 3:
              return testamento.bienes.length > 0;
            case 4:
              return true;
            default:
              return true;
          }
        },

        guardarBorrador: async () => {
          console.log('Borrador guardado');
        },

        firmarTestamento: async () => {
          set((state) => {
            state.testamento.estado = 'firmado';
          });
        },
      }),
      {
        name: 'el-cenit-testamento-storage',
        partialize: (state) => ({ testamento: state.testamento }),
      }
    )
  )
);