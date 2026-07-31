'use client';

import { useState } from 'react';
import { Button } from '@el-cenit/ui';
import { toast } from 'sonner';
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Users,
  User,
  Info,
  FileText,
} from 'lucide-react';
import { useTestamentoStore } from '@/hooks/useTestamento';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function StepDisposiciones({ onNext, onBack }: Props) {
  const { testamento, setDisposiciones } = useTestamentoStore();
  const disp = testamento.disposiciones || {};

  const [albaceaNombre, setAlbaceaNombre] = useState(disp.albacea?.split(' (')[0] || '');
  const [albaceaDni, setAlbaceaDni] = useState(disp.albacea?.match(/\(([^)]+)\)/)?.[1] || '');
  const [tvChecked, setTvChecked] = useState(disp.testamentoVital || false);
  const [tutela, setTutela] = useState(disp.tutelaMenores || '');
  const [lsChecked, setLsChecked] = useState(!!disp.legadoSolidario?.ong);
  const [ongNombre, setOngNombre] = useState(disp.legadoSolidario?.ong || '');
  const [ongPct, setOngPct] = useState(disp.legadoSolidario?.porcentaje?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const albacea = albaceaNombre.trim()
      ? `${albaceaNombre.trim()}${albaceaDni.trim() ? ` (${albaceaDni.trim()})` : ''}`
      : undefined;

    setDisposiciones({
      albacea,
      testamentoVital: tvChecked,
      tutelaMenores: tutela.trim() || undefined,
      legadoSolidario: lsChecked && ongNombre.trim()
        ? { ong: ongNombre.trim(), porcentaje: parseFloat(ongPct) || 0 }
        : undefined,
    });

    toast.success('Disposiciones guardadas correctamente');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Albacea */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-canarias-600" />
            Designación de albacea
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Persona encargada de ejecutar y cumplir las disposiciones de su testamento.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre completo del albacea</label>
              <input
                type="text"
                value={albaceaNombre}
                onChange={(e) => setAlbaceaNombre(e.target.value)}
                placeholder="María García López"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-canarias-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">DNI / NIE del albacea</label>
              <input
                type="text"
                value={albaceaDni}
                onChange={(e) => setAlbaceaDni(e.target.value)}
                placeholder="12345678A"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-canarias-500"
              />
            </div>
          </div>
          <p className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-md p-3">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-canarias-600" />
            Si no designa albacea, el juez de primera instancia designará un albacea de oficio.
          </p>
        </div>
      </div>

      {/* Testamento vital */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-5 w-5 text-canarias-600" />
            Testamento vital
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Documento de voluntades anticipadas sobre tratamientos médicos.
          </p>
        </div>
        <div className="p-6">
          <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={tvChecked}
              onChange={(e) => setTvChecked(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <div>
              <p className="font-medium text-gray-900">Incluir testamento vital</p>
              <p className="text-sm text-gray-500">
                Registrar mi testamento vital ante la Consejería de Sanidad
              </p>
            </div>
          </label>
          {tvChecked && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <Info className="inline h-4 w-4 mr-1" />
              Su testamento vital será registrado ante la Consejería de Sanidad.
              Puede modificarlo o revocarlo en cualquier momento.
            </div>
          )}
        </div>
      </div>

      {/* Tutela de menores */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Users className="h-5 w-5 text-canarias-600" />
            Tutela de menores
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Designe quién será tutor legal de sus hijos menores en caso de fallecimiento.
          </p>
        </div>
        <div className="p-6 space-y-2">
          <label className="text-sm font-medium">Nombre del tutor designado (opcional)</label>
          <input
            type="text"
            value={tutela}
            onChange={(e) => setTutela(e.target.value)}
            placeholder="Pedro Martín Sánchez — DNI: 87654321B"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-canarias-500"
          />
          <p className="text-xs text-gray-500">
            Si no designa tutor, el juez de familia decidirá conforme al interés superior del menor.
          </p>
        </div>
      </div>

      {/* Legado solidario */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-5 w-5 text-canarias-600" />
            Legado solidario
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Destine una parte de su patrimonio a una organización benéfica.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lsChecked}
              onChange={(e) => setLsChecked(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              Deseo incluir un legado solidario a una ONG
            </span>
          </label>
          {lsChecked && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-lg bg-gray-50 p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la ONG</label>
                <input
                  type="text"
                  value={ongNombre}
                  onChange={(e) => setOngNombre(e.target.value)}
                  placeholder="Cáritas Diocesana de Tenerife"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-canarias-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Porcentaje del patrimonio (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={ongPct}
                  onChange={(e) => setOngPct(e.target.value)}
                  placeholder="5"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-canarias-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-4 border-b">
          <h4 className="text-sm font-semibold">Resumen de disposiciones</h4>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {albaceaNombre.trim() ? (
              <span className="inline-flex items-center rounded-full bg-canarias-100 px-3 py-1 text-xs font-medium text-canarias-700">
                <User className="h-3 w-3 mr-1" /> Albacea: {albaceaNombre}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-gray-500">Sin albacea</span>
            )}
            {tvChecked && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                <Heart className="h-3 w-3 mr-1" /> Testamento vital
              </span>
            )}
            {tutela.trim() && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <Users className="h-3 w-3 mr-1" /> Tutela menores
              </span>
            )}
            {lsChecked && ongNombre.trim() && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <Heart className="h-3 w-3 mr-1" /> Legado: {ongNombre} ({ongPct || 0}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
        </Button>
        <Button type="submit">
          Continuar <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
