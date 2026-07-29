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
import { Mail, Lock, LogIn } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
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
      // Aquí iría la llamada a next-auth
      console.log('Login:', data);
      toast.success('Inicio de sesión exitoso');
      // router.push('/testamento/nuevo');
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Acceda a su cuenta para gestionar su testamento digital
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="inline h-4 w-4 mr-1" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="su@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                <Lock className="inline h-4 w-4 mr-1" />
                Contraseña
              </Label>
              <Link
                href="/recuperar-password"
                className="text-xs text-cenit-600 hover:underline"
              >
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tiene cuenta?{' '}
          <Link href="/registro" className="font-semibold text-cenit-600 hover:underline">
            Regístrese aquí
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}