'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Label, Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@el-cenit/ui';
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