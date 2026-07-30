'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Input,
  Label,
  Button,
  Badge,
} from '@el-cenit/ui';
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
  albaceaNombre: z.string().min(2, 'El nombre del albacea es obligatorio').optional().or(z.literal('')),
  albaceaDni: z.string().regex(/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/, 'DNI/NIE no válido').optional().or(z.literal('')),
  testamentoVital: z.boolean(),
  tutelaMenores: z.string().optional(),
  legadoSolidario: z.boolean(),
  ongNombre: z.string().optional(),
  ongPorcentaje: z.coerce.number().min(1).max(100).optional(),
});

type FormData = z.infer<typeof schema>;

interface StepDisposicionesProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepDisposiciones({ onNext, onBack }: StepDisposicionesProps) {
  const { testamento, setDisposiciones } = useTestamentoStore();
  const disp = testamento.disposiciones || {};

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
      legadoSolidario: !!disp.legadoSolidario?.ong || false,
      ongNombre: disp.legadoSolidario?.ong || '',
      ongPorcentaje: disp.legadoSolidario?.porcentaje || undefined,
    },
  });

  const testamentoVital = watch('testamentoVital');
  const legadoSolidario = watch('legadoSolidario');

  const onSubmit = (data: FormData) => {
    const albacea = data.albaceaNombre
      ? `${data.albaceaNombre}${data.albaceaDni ? ` (${data.albaceaDni})` : ''}`
      : undefined;

    setDisposiciones({
      albacea,
      testamentoVital: data.testamentoVital,
      tutelaMenores: data.tutelaMenores || undefined,
      legadoSolidario: data.legadoSolidario && data.ongNombre
        ? {
            ong: data.ongNombre,
            porcentaje: data.ongPorcentaje || 0,
          }
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
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors flex-1">
              <input
                type="radio"
                value="false"
                checked={!testamentoVital}
                onChange={() => {}}
                onClick={() => {
                  const el = document.getElementById('tv-no') as HTMLInputElement;
                  if (el) el.click();
                }}
                className="sr-only"
              />
              <input
                id="tv-no"
                type="radio"
                {...register('testamentoVital')}
                value="false"
                checked={!testamentoVital}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <div>
                <p className="font-medium text-gray-900">No incluir</p>
                <p className="text-sm text-gray-500">
                  No deseo incluir testamento vital en este documento
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors flex-1">
              <input
                type="radio"
                value="true"
                checked={testamentoVital}
                onChange={() => {}}
                onClick={() => {
                  const el = document.getElementById('tv-si') as HTMLInputElement;
                  if (el) el.click();
                }}
                className="sr-only"
              />
              <input
                id="tv-si"
                type="radio"
                {...register('testamentoVital')}
                value="true"
                checked={testamentoVital}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <div>
                <p className="font-medium text-gray-900">Sí, incluir</p>
                <p className="text-sm text-gray-500">
                  Deseo que se registre mi testamento vital junto al testamento
                </p>
              </div>
            </label>
          </div>

          {testamentoVital && (
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
              id="legado-solidario"
              type="checkbox"
              {...register('legadoSolidario')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              Deseo incluir un legado solidario a una ONG
            </span>
          </label>

          {legadoSolidario && (
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
            {watch('albaceaNombre') ? (
              <Badge variant="default" className="bg-canarias-600">
                <UserCheck className="h-3 w-3 mr-1" />
                Albacea: {watch('albaceaNombre')}
              </Badge>
            ) : (
              <Badge variant="outline">Sin albacea designado</Badge>
            )}
            {testamentoVital && (
              <Badge variant="default" className="bg-red-500">
                <HeartPulse className="h-3 w-3 mr-1" />
                Testamento vital
              </Badge>
            )}
            {watch('tutelaMenores') && (
              <Badge variant="default" className="bg-blue-500">
                <Baby className="h-3 w-3 mr-1" />
                Tutela menores
              </Badge>
            )}
            {legadoSolidario && watch('ongNombre') && (
              <Badge variant="default" className="bg-green-600">
                <HandHeart className="h-3 w-3 mr-1" />
                Legado: {watch('ongNombre')} ({watch('ongPorcentaje') || 0}%)
              </Badge>
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