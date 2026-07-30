'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Label, Button } from '@el-cenit/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@el-cenit/ui';
import { toast } from 'sonner';
import {
  FileSignature,
  ArrowRight,
  ArrowLeft,
  HeartPulse,
  Baby,
  HandHeart,
  UserCheck,
  Info,
} from 'lucide-react';
import { useTestamentoStore } from '@/hooks/useTestamento';

const schema = z.object({
  albaceaNombre: z.string().optional(),
  albaceaDni: z.string().optional(),
  testamentoVital: z.boolean().default(false),
  tutelaMenores: z.string().optional(),
  legadoSolidario: z.boolean().default(false),
  ongNombre: z.string().optional(),
  ongPorcentaje: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface StepDisposicionesProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepDisposiciones({ onNext, onBack }: StepDisposicionesProps) {
  const { testamento, setDisposiciones } = useTestamentoStore();
  const disp = testamento.disposiciones || {};

  const [tvChecked, setTvChecked] = useState(disp.testamentoVital || false);
  const [lsChecked, setLsChecked] = useState(!!disp.legadoSolidario?.ong);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      albaceaNombre: disp.albacea?.split(' (')[0] || '',
      albaceaDni: disp.albacea?.match(/\(([^)]+)\)/)?.[1] || '',
      testamentoVital: disp.testamentoVital || false,
      tutelaMenores: disp.tutelaMenores || '',
      legadoSolidario: !!disp.legadoSolidario?.ong,
      ongNombre: disp.legadoSolidario?.ong || '',
      ongPorcentaje: disp.legadoSolidario?.porcentaje?.toString() || '',
    },
  });

  const albaceaNombre = watch('albaceaNombre');
  const tutelaMenores = watch('tutelaMenores');
  const ongNombre = watch('ongNombre');
  const ongPorcentaje = watch('ongPorcentaje');

  const onSubmit = (data: FormData) => {
    const albacea = data.albaceaNombre?.trim()
      ? `${data.albaceaNombre.trim()}${data.albaceaDni?.trim() ? ` (${data.albaceaDni.trim()})` : ''}`
      : undefined;

    const ongPct = data.ongPorcentaje ? parseFloat(data.ongPorcentaje) : 0;

    setDisposiciones({
      albacea,
      testamentoVital: tvChecked,
      tutelaMenores: data.tutelaMenores?.trim() || undefined,
      legadoSolidario: lsChecked && data.ongNombre?.trim()
        ? { ong: data.ongNombre.trim(), porcentaje: ongPct }
        : undefined,
    });

    toast.success('Disposiciones guardadas correctamente');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Albacea */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Designación de albacea
          </CardTitle>
          <CardDescription>
            Persona encargada de ejecutar y cumplir las disposiciones de su testamento
            tras su fallecimiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="albaceaNombre">Nombre completo del albacea</Label>
              <Input
                id="albaceaNombre"
                placeholder="María García López"
                {...register('albaceaNombre')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="albaceaDni">DNI / NIE del albacea</Label>
              <Input
                id="albaceaDni"
                placeholder="12345678A"
                {...register('albaceaDni')}
                className={errors.albaceaDni ? 'border-red-500' : ''}
              />
              {errors.albaceaDni && (
                <p className="text-sm text-red-500">{errors.albaceaDni.message}</p>
              )}
            </div>
          </div>
          <p className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-md p-3">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-canarias-600" />
            Si no designa albacea, el juez de primera instancia designará un albacea
            de oficio. Puede designar también un albacea suplente en caso de impedimento.
          </p>
        </CardContent>
      </Card>

      {/* Testamento vital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            Testamento vital
          </CardTitle>
          <CardDescription>
            Documento de voluntades anticipadas sobre tratamientos médicos en situaciones
            de incapacidad o enfermedad terminal.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                Deseo que se registre mi testamento vital junto al testamento ante la Consejería de Sanidad
              </p>
            </div>
          </label>

          {tvChecked && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm text-amber-800">
                <Info className="inline h-4 w-4 mr-1" />
                Su testamento vital será registrado ante la Consejería de Sanidad.
                Puede modificarlo o revocarlo en cualquier momento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tutela de menores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Tutela de menores
          </CardTitle>
          <CardDescription>
            Si tiene hijos menores de edad, designe quién será su tutor legal en caso
            de fallecimiento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="tutelaMenores">Nombre del tutor designado (opcional)</Label>
            <Input
              id="tutelaMenores"
              placeholder="Pedro Martín Sánchez — DNI: 87654321B"
              {...register('tutelaMenores')}
            />
            <p className="text-xs text-gray-500">
              Si no designa tutor, el juez de familia decidirá conforme al interés superior del menor.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Legado solidario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandHeart className="h-5 w-5" />
            Legado solidario
          </CardTitle>
          <CardDescription>
            Destine una parte de su patrimonio a una organización benéfica u ONG.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <Label htmlFor="ongNombre">Nombre de la ONG</Label>
                <Input
                  id="ongNombre"
                  placeholder="Cáritas Diocesana de Tenerife"
                  {...register('ongNombre')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ongPorcentaje">Porcentaje del patrimonio (%)</Label>
                <Input
                  id="ongPorcentaje"
                  type="number"
                  min={1}
                  max={100}
                  placeholder="5"
                  {...register('ongPorcentaje')}
                  className={errors.ongPorcentaje ? 'border-red-500' : ''}
                />
                {errors.ongPorcentaje && (
                  <p className="text-sm text-red-500">{errors.ongPorcentaje.message}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de disposiciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Resumen de disposiciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {albaceaNombre?.trim() ? (
              <span className="inline-flex items-center rounded-full bg-canarias-100 px-3 py-1 text-xs font-medium text-canarias-700">
                <UserCheck className="h-3 w-3 mr-1" />
                Albacea: {albaceaNombre}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
                Sin albacea designado
              </span>
            )}
            {tvChecked && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                <HeartPulse className="h-3 w-3 mr-1" />
                Testamento vital
              </span>
            )}
            {tutelaMenores?.trim() && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <Baby className="h-3 w-3 mr-1" />
                Tutela menores
              </span>
            )}
            {lsChecked && ongNombre?.trim() && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <HandHeart className="h-3 w-3 mr-1" />
                Legado: {ongNombre} ({ongPorcentaje || 0}%)
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <Button type="submit">
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}