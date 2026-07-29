'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@el-cenit/ui/components/Input';
import { Label } from '@el-cenit/ui/components/Label';
import { Button } from '@el-cenit/ui/components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@el-cenit/ui/components/Card';
import { toast } from 'sonner';
import { User, Mail, Lock, Calendar, MapPin, Phone, UserPlus } from 'lucide-react';

const schema = z
  .object({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    apellidos: z.string().min(2, 'Los apellidos son obligatorios'),
    dni: z.string().regex(/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/, 'DNI/NIE no válido'),
    fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    direccion: z.string().min(5, 'La dirección es obligatoria'),
    telefono: z.string().regex(/^[67][0-9]{8}$/, 'Teléfono no válido'),
    email: z.string().email('Email no válido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegistroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Aquí iría la llamada a la API de registro
      console.log('Registro:', data);
      toast.success('Cuenta creada correctamente. Verifique su email.');
    } catch (error) {
      toast.error('Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>
          Regístrese para comenzar a proteger su legado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                Dirección
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

            <div className="space-y-2">
              <Label htmlFor="password">
                <Lock className="inline h-4 w-4 mr-1" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                <Lock className="inline h-4 w-4 mr-1" />
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita la contraseña"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tiene cuenta?{' '}
          <Link href="/login" className="font-semibold text-cenit-600 hover:underline">
            Inicie sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}