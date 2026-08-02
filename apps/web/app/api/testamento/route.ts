import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validación básica
    if (!body.datosIdentidad || !body.herederos || !body.bienes) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios del testamento' },
        { status: 400 }
      );
    }

    const nuevoTestamento = await prisma.testamento.create({
      data: {
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
      {
        success: true,
        id: nuevoTestamento.id,
        message: 'Testamento guardado correctamente en la base de datos',
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const testamento = await prisma.testamento.findUnique({
        where: { id },
      });

      if (!testamento) {
        return NextResponse.json(
          { error: 'Testamento no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, testamento });
    }

    const testamentos = await prisma.testamento.findMany({
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
}      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const testamento = testamentosDB.find((t) => t.id === id);
      if (!testamento) {
        return NextResponse.json(
          { error: 'Testamento no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, testamento });
    }

    return NextResponse.json({
      success: true,
      testamentos: testamentosDB,
    });
  } catch (error) {
    console.error('Error obteniendo testamentos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
