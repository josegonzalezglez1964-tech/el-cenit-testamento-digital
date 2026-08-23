'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

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
  guardando: boolean;
  ultimoGuardado: string | null;
  setPaso: (paso: number) => void;
  setDatosIdentidad: (datos: any) => void;
  addHeredero: (heredero: Heredero) => void;
  removeHeredero: (id: string) => void;
  addBien: (bien: Bien) => void;
  removeBien: (id: string) => void;
  setDisposiciones: (disp: any) => void;
  validarPaso: (paso: number) => Promise<boolean>;
  guardarBorrador: () => Promise<boolean>;
  firmarTestamento: () => Promise<void>;
  resetTestamento: () => void;
}

const encryptedStorage: StateStorage = {
  getItem: async (name) => {
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      const { decryptData } = await import('@/lib/crypto/secureStorage');
      return await decryptData(value);
    } catch {
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem: async (name, value) => {
    const { encryptData } = await import('@/lib/crypto/secureStorage');
    const encrypted = await encryptData(value);
    localStorage.setItem(name, encrypted);
  },
  removeItem: async (name) => {
    localStorage.removeItem(name);
  },
};

export const useTestamentoStore = create<TestamentoState>()(
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
      guardando: false,
      ultimoGuardado: null,

      setPaso: (paso) => {
        set((state) => ({
          testamento: { ...state.testamento, pasoActual: paso },
        }));
      },

      setDatosIdentidad: (datos) => {
        set((state) => ({
          testamento: { ...state.testamento, datosIdentidad: datos },
        }));
      },

      addHeredero: (heredero) => {
        set((state) => ({
          testamento: {
            ...state.testamento,
            herederos: [...state.testamento.herederos, heredero],
          },
        }));
      },

      removeHeredero: (id) => {
        set((state) => ({
          testamento: {
            ...state.testamento,
            herederos: state.testamento.herederos.filter((h) => h.id !== id),
          },
        }));
      },

      addBien: (bien) => {
        set((state) => ({
          testamento: {
            ...state.testamento,
            bienes: [...state.testamento.bienes, bien],
          },
        }));
      },

      removeBien: (id) => {
        set((state) => ({
          testamento: {
            ...state.testamento,
            bienes: state.testamento.bienes.filter((b) => b.id !== id),
          },
        }));
      },

      setDisposiciones: (disp) => {
        set((state) => ({
          testamento: {
            ...state.testamento,
            disposiciones: { ...state.testamento.disposiciones, ...disp },
          },
        }));
      },

      validarPaso: async (paso) => {
        const { testamento } = get();
        switch (paso) {
          case 1:
            return !!testamento.datosIdentidad?.nombre && !!testamento.datosIdentidad?.dni;
          case 2:
            return (
              testamento.herederos.length > 0 &&
              testamento.herederos.reduce((sum, h) => sum + h.porcentaje, 0) <= 100
            );
          case 3:
            return testamento.bienes.length > 0;
          case 4:
            return true;
          default:
            return true;
        }
      },

      guardarBorrador: async () => {
        const { testamento } = get();

        // No hay nada útil que guardar todavía (el usuario no ha pasado del paso 1)
        if (!testamento.datosIdentidad?.nombre) {
          return false;
        }

        set({ guardando: true });

        try {
          const payload = {
            id: testamento.id,
            datosIdentidad: testamento.datosIdentidad,
            herederos: testamento.herederos,
            bienes: testamento.bienes,
            disposiciones: testamento.disposiciones,
            estado: testamento.estado,
          };

          const res = await fetch('/api/testamento', {
            method: testamento.id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            throw new Error('No se pudo guardar el borrador');
          }

          const data = await res.json();

          set((state) => ({
            testamento: { ...state.testamento, id: state.testamento.id ?? data.id },
            guardando: false,
            ultimoGuardado: new Date().toISOString(),
          }));

          return true;
        } catch (error) {
          console.error('Error guardando borrador:', error);
          set({ guardando: false });
          return false;
        }
      },

      firmarTestamento: async () => {
        set((state) => ({
          testamento: { ...state.testamento, estado: 'firmado' },
        }));
      },

      resetTestamento: () => {
        set({
          testamento: {
            pasoActual: 1,
            herederos: [],
            bienes: [],
            disposiciones: {
              testamentoVital: false,
            },
            estado: 'borrador',
          },
        });
      },
    }),
    {
      name: 'el-cenit-testamento-storage',
      partialize: (state) => ({ testamento: state.testamento }),
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);