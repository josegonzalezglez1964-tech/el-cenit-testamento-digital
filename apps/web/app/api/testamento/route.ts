import { NextRequest, NextResponse } from 'next/server';

// Simulación de base de datos en memoria (reemplazar por Prisma en producción)
const testamentosDB: any[] = [];

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

    const nuevoTestamento = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    testamentosDB.push(nuevoTestamento);

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