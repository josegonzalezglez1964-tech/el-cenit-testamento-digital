import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { testamentoBorradorSchema } from '../../../lib/validators/testamentoSchema';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const resultado = testamentoBorradorSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        {
          error: 'Datos del testamento no válidos',
          detalles: resultado.error.flatten(),
        },
        { status: 400 }
      );
    }

    const datos = resultado.data;

    const nuevoTestamento = await prisma.testamento.create({
      data: {
        userId: session.user.id,
        datosIdentidad: datos.datosIdentidad,
        herederos: datos.herederos,
        bienes: datos.bienes,
        disposiciones: datos.disposiciones,
        estado: 'borrador',
        hashDocumento: null,
        selloTiempo: null,
        blockchainTx: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: nuevoTestamento.id,
        message: 'Testamento guardado correctamente',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error guardando testamento:', error);

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Falta el id del testamento' },
        { status: 400 }
      );
    }

    const resultado = testamentoBorradorSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        {
          error: 'Datos del testamento no válidos',
          detalles: resultado.error.flatten(),
        },
        { status: 400 }
      );
    }

    const datos = resultado.data;

    const existente = await prisma.testamento.findUnique({
      where: { id: datos.id },
    });

    if (!existente || existente.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Testamento no encontrado' },
        { status: 404 }
      );
    }

    const actualizado = await prisma.testamento.update({
      where: { id: datos.id },
      data: {
        datosIdentidad: datos.datosIdentidad,
        herederos: datos.herederos,
        bienes: datos.bienes,
        disposiciones: datos.disposiciones,
        estado: existente.estado,
        hashDocumento: existente.hashDocumento,
        selloTiempo: existente.selloTiempo,
        blockchainTx: existente.blockchainTx,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: actualizado.id,
        message: 'Testamento actualizado correctamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error actualizando testamento:', error);

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const testamento = await prisma.testamento.findUnique({
        where: { id },
      });

      if (!testamento || testamento.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Testamento no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        testamento,
      });
    }

    const testamentos = await prisma.testamento.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      testamentos,
    });
  } catch (error) {
    console.error('Error obteniendo testamentos:', error);

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}