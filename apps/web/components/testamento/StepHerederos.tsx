'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Label, Button, Badge } from '@el-cenit/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@el-cenit/ui';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Trash2,
  Percent,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useTestamentoStore } from '@/hooks/useTestamento';

const herederoSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellidos: z.string().min(2, 'Los apellidos son obligatorios'),
  dni: z.string().regex(/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/, 'DNI/NIE no válido'),
  parentesco: z.enum(['conyuge', 'hijo', 'nieto', 'padre', 'hermano', 'otro'], {
    required_error: 'Seleccione el parentesco',
  }),
  porcentaje: z.coerce
    .number()
    .min(1, 'Mínimo 1%')
    .max(100, 'Máximo 100%'),
  tipo: z.enum(['forzoso', 'voluntario'], {
    required_error: 'Seleccione el tipo de heredero',
  }),
});

type HerederoFormData = z.infer<typeof herederoSchema>;

interface StepHerederosProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepHerederos({ onNext, onBack }: StepHerederosProps) {
  const { testamento, addHeredero, removeHeredero } = useTestamentoStore();
  const herederos = testamento.herederos;

  const totalPorcentaje = herederos.reduce((sum, h) => sum + h.porcentaje, 0);
  const porcentajeRestante = 100 - totalPorcentaje;
  const puedeAvanzar = herederos.length > 0 && totalPorcentaje <= 100;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HerederoFormData>({
    resolver: zodResolver(herederoSchema),
    defaultValues: {
      parentesco: 'hijo',
      tipo: 'forzoso',
    },
  });

  const onAddHeredero = (data: HerederoFormData) => {
    if (totalPorcentaje + data.porcentaje > 100) {
      toast.error(
        `Solo queda un ${porcentajeRestante}% disponible. Ajuste el porcentaje.`
      );
      return;
    }

    addHeredero({
      id: crypto.randomUUID(),
      ...data,
    });

    toast.success(`${data.nombre} ${data.apellidos} añadido como heredero`);
    reset();
  };

  const handleRemove = (id: string, nombre: string) => {
    removeHeredero(id);
    toast.success(`${nombre} eliminado de la lista de herederos`);
  };

  const handleNext = () => {
    if (herederos.length === 0) {
      toast.error('Debe designar al menos un heredero');
      return;
    }
    if (totalPorcentaje > 100) {
      toast.error('El total de porcentajes no puede superar el 100%');
      return;
    }
    toast.success('Herederos guardados correctamente');
    onNext();
  };

  const parentescoLabels: Record<string, string> = {
    conyuge: 'Cónyuge',
    hijo: 'Hijo/a',
    nieto: 'Nieto/a',
    padre: 'Padre/Madre',
    hermano: 'Hermano/a',
    otro: 'Otro',
  };

  const tipoColors: Record<string, string> = {
    forzoso: 'bg-amber-100 text-amber-700 border-amber-200',
    voluntario: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const tipoLabels: Record<string, string> = {
    forzoso: 'Legítimo (forzoso)',
    voluntario: 'Voluntario',
  };

  return (
    <div className="space-y-6">
      {/* Formulario de añadir heredero */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Añadir heredero
          </CardTitle>
          <CardDescription>
            Designe las personas que heredarán sus bienes. Puede añadir herederos
            forzosos (legítimos) y voluntarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onAddHeredero)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="María"
                  {...register('nombre')}
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  placeholder="García López"
                  {...register('apellidos')}
                  className={errors.apellidos ? 'border-red-500' : ''}
                />
                {errors.apellidos && (
                  <p className="text-sm text-red-500">{errors.apellidos.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dni">DNI / NIE</Label>
                <Input
                  id="dni"
                  placeholder="12345678A"
                  {...register('dni')}
                  className={errors.dni ? 'border-red-500' : ''}
                />
                {errors.dni && (
                  <p className="text-sm text-red-500">{errors.dni.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentesco">Parentesco</Label>
                <select
                  id="parentesco"
                  {...register('parentesco')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="conyuge">Cónyuge</option>
                  <option value="hijo">Hijo/a</option>
                  <option value="nieto">Nieto/a</option>
                  <option value="padre">Padre/Madre</option>
                  <option value="hermano">Hermano/a</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.parentesco && (
                  <p className="text-sm text-red-500">{errors.parentesco.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de heredero</Label>
                <select
                  id="tipo"
                  {...register('tipo')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="forzoso">Legítimo (forzoso)</option>
                  <option value="voluntario">Voluntario</option>
                </select>
                {errors.tipo && (
                  <p className="text-sm text-red-500">{errors.tipo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="porcentaje">
                  <Percent className="inline h-3 w-3 mr-1" />
                  Porcentaje (%)
                </Label>
                <Input
                  id="porcentaje"
                  type="number"
                  min={1}
                  max={porcentajeRestante > 0 ? porcentajeRestante : 100}
                  placeholder="0"
                  {...register('porcentaje')}
                  className={errors.porcentaje ? 'border-red-500' : ''}
                />
                {errors.porcentaje && (
                  <p className="text-sm text-red-500">{errors.porcentaje.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <span className="text-gray-500">Disponible: </span>
                <span
                  className={`font-semibold ${
                    porcentajeRestante === 0
                      ? 'text-green-600'
                      : porcentajeRestante < 0
                      ? 'text-red-600'
                      : 'text-gray-700'
                  }`}
                >
                  {porcentajeRestante}%
                </span>
                {porcentajeRestante === 0 && (
                  <CheckCircle2 className="inline h-4 w-4 ml-1 text-green-600" />
                )}
                {porcentajeRestante < 0 && (
                  <AlertTriangle className="inline h-4 w-4 ml-1 text-red-600" />
                )}
              </div>
              <Button type="submit" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Añadir heredero
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de herederos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Herederos designados
            </span>
            <Badge variant={totalPorcentaje === 100 ? 'default' : 'outline'}>
              {totalPorcentaje}% / 100%
            </Badge>
          </CardTitle>
          <CardDescription>
            {herederos.length === 0
              ? 'Aún no ha designado ningún heredero.'
              : `Tiene ${herederos.length} heredero${herederos.length !== 1 ? 's' : ''} designado${herederos.length !== 1 ? 's' : ''}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {herederos.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
              <Users className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm">No hay herederos registrados</p>
              <p className="text-xs text-gray-400">
                Use el formulario de arriba para añadir el primero
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {herederos.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canarias-100 text-canarias-700">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {h.nombre} {h.apellidos}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>DNI: {h.dni}</span>
                        <span>·</span>
                        <span>{parentescoLabels[h.parentesco]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tipoColors[h.tipo]}`}
                    >
                      {tipoLabels[h.tipo]}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Percent className="h-3 w-3" />
                      {h.porcentaje}%
                    </span>
                    <button
                      onClick={() => handleRemove(h.id, h.nombre)}
                      className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Eliminar heredero"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Barra de progreso del reparto */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reparto total</span>
                  <span
                    className={`font-semibold ${
                      totalPorcentaje === 100
                        ? 'text-green-600'
                        : totalPorcentaje > 100
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {totalPorcentaje}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      totalPorcentaje === 100
                        ? 'bg-green-500'
                        : totalPorcentaje > 100
                        ? 'bg-red-500'
                        : 'bg-canarias-600'
                    }`}
                    style={{ width: `${Math.min(totalPorcentaje, 100)}%` }}
                  />
                </div>
                {totalPorcentaje < 100 && (
                  <p className="text-xs text-amber-600">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    Queda un {100 - totalPorcentaje}% sin asignar. Puede continuar
                    y asignarlo más adelante o añadir más herederos.
                  </p>
                )}
                {totalPorcentaje === 100 && (
                  <p className="text-xs text-green-600">
                    <CheckCircle2 className="inline h-3 w-3 mr-1" />
                    El 100% del patrimonio está asignado.
                  </p>
                )}
                {totalPorcentaje > 100 && (
                  <p className="text-xs text-red-600">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    El total supera el 100%. Ajuste los porcentajes antes de continuar.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <Button onClick={handleNext} disabled={!puedeAvanzar}>
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}