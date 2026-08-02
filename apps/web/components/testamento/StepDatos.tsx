'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Label, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@el-cenit/ui';
import { toast } from 'sonner';
import { User, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { useTestamentoStore } from '@/hooks/useTestamento';
import { useEffect } from 'react';

const schema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellidos: z.string().min(2, 'Los apellidos son obligatorios'),
  dni: z.string().regex(/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/, 'DNI/NIE no válido'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  telefono: z.string().regex(/^[67][0-9]{8}$/, 'Teléfono no válido'),
  email: z.string().email('Email no válido'),
});

type FormData = z.infer<typeof schema>;

interface StepDatosProps {
  onNext: () => void;
}

export function StepDatos({ onNext }: StepDatosProps) {
  const { setDatosIdentidad, testamento } = useTestamentoStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Pre-cargar datos si ya existen en el store (al volver atrás)
  useEffect(() => {
    if (testamento.datosIdentidad) {
      const d = testamento.datosIdentidad;
      reset({
        nombre: d.nombre || '',
        apellidos: d.apellidos || '',
        dni: d.dni || '',
        fechaNacimiento: d.fechaNacimiento || '',
        direccion: d.domicilio?.calle || '',
        telefono: d.domicilio?.telefono || '',
        email: d.domicilio?.email || '',
      });
    }
  }, [reset, testamento.datosIdentidad]);

  const onSubmit = async (data: FormData) => {
    try {
      // ✅ GUARDAR EN EL STORE GLOBAL (esto faltaba)
      setDatosIdentidad({
        nombre: data.nombre,
        apellidos: data.apellidos,
        dni: data.dni,
        fechaNacimiento: data.fechaNacimiento,
        estadoCivil: '',
        domicilio: {
          calle: data.direccion,
          telefono: data.telefono,
          email: data.email,
        },
      });
      
      console.log('Datos del testador guardados en store:', data);
      toast.success('Datos guardados correctamente');
      onNext();
    } catch (error) {
      toast.error('Error al guardar los datos');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del testador</CardTitle>
        <CardDescription>
          Introduzca sus datos personales. Estos serán verificados con su DNIe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                <User className="inline h-4 w-4 mr-1" />
                Nombre
              </Label>
              <Input
                id="nombre"
                placeholder="Juan"
                {...register('nombre')}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">
                <User className="inline h-4 w-4 mr-1" />
                Apellidos
              </Label>
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
              <Label htmlFor="dni">
                <User className="inline h-4 w-4 mr-1" />
                DNI / NIE
              </Label>
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
              <Label htmlFor="fechaNacimiento">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha de nacimiento
              </Label>
              <Input
                id="fechaNacimiento"
                type="date"
                {...register('fechaNacimiento')}
                className={errors.fechaNacimiento ? 'border-red-500' : ''}
              />
              {errors.fechaNacimiento && (
                <p className="text-sm text-red-500">{errors.fechaNacimiento.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="direccion">
                <MapPin className="inline h-4 w-4 mr-1" />
                Dirección completa
              </Label>
              <Input
                id="direccion"
                placeholder="Calle Mayor, 123, 38001 Santa Cruz de Tenerife"
                {...register('direccion')}
                className={errors.direccion ? 'border-red-500' : ''}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500">{errors.direccion.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">
                <Phone className="inline h-4 w-4 mr-1" />
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="612345678"
                {...register('telefono')}
                className={errors.telefono ? 'border-red-500' : ''}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Continuar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}