'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Label, Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@el-cenit/ui';
import { toast } from 'sonner';
import {
  Package,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Euro,
  Building2,
  Car,
  Landmark,
  Bitcoin,
  FileText,
  MapPin,
} from 'lucide-react';
import { useTestamentoStore } from '@/hooks/useTestamento';

const bienSchema = z.object({
  tipo: z.enum(['inmueble', 'cuenta_bancaria', 'vehiculo', 'acciones', 'cripto', 'otro'], {
    required_error: 'Seleccione el tipo de bien',
  }),
  descripcion: z.string().min(3, 'La descripción es obligatoria'),
  valorEstimado: z.coerce
    .number()
    .min(0, 'El valor no puede ser negativo'),
  referencia: z.string().optional(),
  ubicacion: z.string().optional(),
});

type BienFormData = z.infer<typeof bienSchema>;

interface StepBienesProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepBienes({ onNext, onBack }: StepBienesProps) {
  const { testamento, addBien, removeBien } = useTestamentoStore();
  const bienes = testamento.bienes;

  const valorTotal = bienes.reduce((sum, b) => sum + (b.valorEstimado || 0), 0);
  const puedeAvanzar = bienes.length > 0;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BienFormData>({
    resolver: zodResolver(bienSchema),
    defaultValues: {
      tipo: 'inmueble',
    },
  });

  const tipoSeleccionado = watch('tipo');

  const onAddBien = (data: BienFormData) => {
    addBien({
      id: crypto.randomUUID(),
      ...data,
    });

    toast.success(`Bien añadido: ${data.descripcion}`);
    reset();
  };

  const handleRemove = (id: string, descripcion: string) => {
    removeBien(id);
    toast.success(`${descripcion} eliminado de la lista`);
  };

  const handleNext = () => {
    if (bienes.length === 0) {
      toast.error('Debe añadir al menos un bien');
      return;
    }
    toast.success('Bienes guardados correctamente');
    onNext();
  };

  const tipoConfig: Record<string, { label: string; icon: typeof Building2; color: string; placeholder: string }> = {
    inmueble: {
      label: 'Inmueble',
      icon: Building2,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      placeholder: 'Piso en Santa Cruz de Tenerife, 120m²',
    },
    cuenta_bancaria: {
      label: 'Cuenta bancaria',
      icon: Landmark,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      placeholder: 'Cuenta corriente BBVA',
    },
    vehiculo: {
      label: 'Vehículo',
      icon: Car,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      placeholder: 'Toyota Corolla 2020',
    },
    acciones: {
      label: 'Acciones / Participaciones',
      icon: FileText,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      placeholder: '100 acciones de Telefónica',
    },
    cripto: {
      label: 'Criptomonedas',
      icon: Bitcoin,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      placeholder: '0.5 BTC en wallet Ledger',
    },
    otro: {
      label: 'Otro',
      icon: Package,
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      placeholder: 'Colección de arte, joyas, etc.',
    },
  };

  const tipoActual = tipoConfig[tipoSeleccionado] || tipoConfig.otro;
  const IconoActual = tipoActual.icon;

  return (
    <div className="space-y-6">
      {/* Formulario de añadir bien */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Añadir bien o activo
          </CardTitle>
          <CardDescription>
            Inventarie sus bienes, propiedades, cuentas y activos. Estos se
            vincularán a los herederos designados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onAddBien)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de bien</Label>
                <select
                  id="tipo"
                  {...register('tipo')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="inmueble">🏠 Inmueble</option>
                  <option value="cuenta_bancaria">🏦 Cuenta bancaria</option>
                  <option value="vehiculo">🚗 Vehículo</option>
                  <option value="acciones">📈 Acciones / Participaciones</option>
                  <option value="cripto">₿ Criptomonedas</option>
                  <option value="otro">📦 Otro</option>
                </select>
                {errors.tipo && (
                  <p className="text-sm text-red-500">{errors.tipo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorEstimado">
                  <Euro className="inline h-3 w-3 mr-1" />
                  Valor estimado (€)
                </Label>
                <Input
                  id="valorEstimado"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="150000"
                  {...register('valorEstimado')}
                  className={errors.valorEstimado ? 'border-red-500' : ''}
                />
                {errors.valorEstimado && (
                  <p className="text-sm text-red-500">{errors.valorEstimado.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="descripcion">
                  <IconoActual className="inline h-4 w-4 mr-1" />
                  Descripción
                </Label>
                <Input
                  id="descripcion"
                  placeholder={tipoActual.placeholder}
                  {...register('descripcion')}
                  className={errors.descripcion ? 'border-red-500' : ''}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-500">{errors.descripcion.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referencia">
                  <FileText className="inline h-3 w-3 mr-1" />
                  Referencia / Nº cuenta (opcional)
                </Label>
                <Input
                  id="referencia"
                  placeholder="ES91 2100 0418 4502 0005 1332"
                  {...register('referencia')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  Ubicación (opcional)
                </Label>
                <Input
                  id="ubicacion"
                  placeholder="Santa Cruz de Tenerife, España"
                  {...register('ubicacion')}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Añadir bien
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de bienes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Bienes registrados
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {bienes.length} {bienes.length === 1 ? 'bien' : 'bienes'}
              </span>
              {valorTotal > 0 && (
                <Badge variant="outline">
                  <Euro className="h-3 w-3 mr-1" />
                  {valorTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {bienes.length === 0
              ? 'Aún no ha registrado ningún bien.'
              : `Patrimonio estimado: ${valorTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bienes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
              <Package className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm">No hay bienes registrados</p>
              <p className="text-xs text-gray-400">
                Use el formulario de arriba para añadir el primero
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bienes.map((b) => {
                const config = tipoConfig[b.tipo] || tipoConfig.otro;
                const Icono = config.icon;
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canarias-100 text-canarias-700">
                        <Icono className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{b.descripcion}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {b.referencia && <span>Ref: {b.referencia}</span>}
                          {b.ubicacion && (
                            <>
                              {b.referencia && <span>·</span>}
                              <span>{b.ubicacion}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {b.valorEstimado.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} €
                      </span>
                      <button
                        onClick={() => handleRemove(b.id, b.descripcion)}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Eliminar bien"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Total del patrimonio */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="font-medium text-gray-700">Valor total del patrimonio</span>
                <span className="text-lg font-bold text-canarias-700">
                  {valorTotal.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} €
                </span>
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