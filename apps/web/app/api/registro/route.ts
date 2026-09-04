import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

const registroSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre es obligatorio'),

  apellidos: z
    .string()
    .trim()
    .min(2, 'Los apellidos son obligatorios'),

  dni: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/,
      'DNI/NIE no válido'
    ),

  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria'),

  direccion: z
    .string()
    .trim()
    .min(5, 'La dirección es obligatoria'),

  telefono: z
    .string()
    .trim()
    .regex(/^[67][0-9]{8}$/, 'Teléfono no válido'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email no válido'),

  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registroSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ||
            'Datos de registro no válidos',
        },
        { status: 400 }
      );
    }

    const {
      nombre,
      apellidos,
      dni,
      fechaNacimiento,
      direccion,
      telefono,
      email,
      password,
    } = result.data;

    const fecha = new Date(`${fechaNacimiento}T00:00:00.000Z`);

    if (Number.isNaN(fecha.getTime())) {
      return NextResponse.json(
        {
          error: 'La fecha de nacimiento no es válida',
        },
        { status: 400 }
      );
    }

    const usuarioPorEmail = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (usuarioPorEmail) {
      return NextResponse.json(
        {
          error: 'Ya existe una cuenta con ese email',
        },
        { status: 409 }
      );
    }

    const usuarioPorDni = await prisma.user.findUnique({
      where: {
        dni,
      },
      select: {
        id: true,
      },
    });

    if (usuarioPorDni) {
      return NextResponse.json(
        {
          error: 'Ya existe una cuenta con ese DNI/NIE',
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const usuario = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nombre,
        apellidos,
        dni,
        fechaNacimiento: fecha,
        direccion,
        telefono,
        role: 'TESTADOR',
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
        dni: true,
        fechaNacimiento: true,
        direccion: true,
        telefono: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Cuenta creada correctamente',
        user: usuario,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    return NextResponse.json(
      {
        error: 'No se pudo crear la cuenta',
      },
      { status: 500 }
    );
  }
}