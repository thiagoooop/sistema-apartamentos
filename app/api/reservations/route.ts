
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const apartment = searchParams.get('apartment') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};

    if (search) {
      where.client = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    if (apartment) {
      where.apartmentId = apartment;
    }

    if (status) {
      where.status = status;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        client: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        apartment: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        checkIn: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.reservation.count({ where });

    return NextResponse.json({
      reservations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      checkIn,
      checkOut,
      guests,
      totalAmount,
      paidAmount,
      paymentStatus,
      status,
      notes,
      source,
      apartmentId,
      clientId,
    } = body;

    // Validar se o apartamento está disponível
    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        apartmentId,
        status: {
          not: 'CANCELLED',
        },
        OR: [
          {
            checkIn: {
              lte: new Date(checkOut),
            },
            checkOut: {
              gte: new Date(checkIn),
            },
          },
        ],
      },
    });

    if (conflictingReservations.length > 0) {
      return NextResponse.json(
        { error: 'Apartamento não disponível para as datas selecionadas' },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalAmount,
        paidAmount: paidAmount || 0,
        paymentStatus: paymentStatus || 'PENDING',
        status: status || 'CONFIRMED',
        notes,
        source: source || 'MANUAL',
        apartmentId,
        clientId,
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        apartment: {
          select: {
            name: true,
          },
        },
      },
    });

    // Atualizar contador de estadias do cliente
    await prisma.client.update({
      where: { id: clientId },
      data: {
        totalStays: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
