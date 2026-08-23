import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.datosIdentidad || !body.herederos || !body.bienes) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios del testamento' },
        { status: 400 }
      );
    }

    const nuevoTestamento = await prisma.testamento.create({
      data: {
        userId: session.user.id,
        datosIdentidad: body.datosIdentidad,
        herederos: body.herederos,
        bienes: body.bienes,
        disposiciones: body.disposiciones || { testamentoVital: false },
        estado: body.estado || 'borrador',
        hashDocumento: body.hashDocumento || null,
        selloTiempo: body.selloTiempo || null,
        blockchainTx: body.blockchainTx || null,
      },
    });

    return NextResponse.json(
      { success: true, id: nuevoTestamento.id, message: 'Testamento guardado correctamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error guardando testamento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Falta el id del testamento' }, { status: 400 });
    }

    const existente = await prisma.testamento.findUnique({ where: { id: body.id } });

    if (!existente || existente.userId !== session.user.id) {
      return NextResponse.json({ error: 'Testamento no encontrado' }, { status: 404 });
    }

    const actualizado = await prisma.testamento.update({
      where: { id: body.id },
      data: {
        datosIdentidad: body.datosIdentidad ?? existente.datosIdentidad,
        herederos: body.herederos ?? existente.herederos,
        bienes: body.bienes ?? existente.bienes,
        disposiciones: body.disposiciones ?? existente.disposiciones,
        estado: body.estado ?? existente.estado,
        hashDocumento: body.hashDocumento ?? existente.hashDocumento,
        selloTiempo: body.selloTiempo ?? existente.selloTiempo,
        blockchainTx: body.blockchainTx ?? existente.blockchainTx,
      },
    });

    return NextResponse.json(
      { success: true, id: actualizado.id, message: 'Testamento actualizado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error actualizando testamento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const testamento = await prisma.testamento.findUnique({ where: { id } });

      if (!testamento || testamento.userId !== session.user.id) {
        return NextResponse.json({ error: 'Testamento no encontrado' }, { status: 404 });
      }

      return NextResponse.json({ success: true, testamento });
    }

    const testamentos = await prisma.testamento.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, testamentos });
  } catch (error) {
    console.error('Error obteniendo testamentos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}