
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const apartment = searchParams.get('apartment');

    if (!start || !end) {
      return NextResponse.json(
        { error: 'Parâmetros start e end são obrigatórios' },
        { status: 400 }
      );
    }

    const where: any = {
      checkIn: {
        lte: new Date(end),
      },
      checkOut: {
        gte: new Date(start),
      },
      status: {
        not: 'CANCELLED',
      },
    };

    if (apartment && apartment !== 'all') {
      where.apartmentId = apartment;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        client: {
          select: {
            name: true,
          },
        },
        apartment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        checkIn: 'asc',
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas do calendário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
