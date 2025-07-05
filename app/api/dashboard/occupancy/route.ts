
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Apartment } from '@prisma/client';

export async function GET() {
  try {
    const now = new Date();
    const Apartments = await prisma.Apartment.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
    });

    const occupancyData = await Promise.all(
      Apartments.map(async (Apartment: Apartment) => {
        const reservations = await prisma.reservation.count({
          where: {
            ApartmentId: Apartment.id,
            checkIn: {
              lte: now,
            },
            checkOut: {
              gte: now,
            },
            status: {
              not: 'CANCELLED',
            },
          },
        });

        const isOccupied = reservations > 0;
        return {
          name: Apartment.name,
          value: isOccupied ? 100 : 0,
          color: isOccupied ? '#ef4444' : '#10b981',
        };
      })
    );

    const totalOccupied = occupancyData.filter(apt => apt.value > 0).length;
    const totalAvailable = Apartments.length - totalOccupied;

    const result = [
      {
        name: 'Ocupado',
        value: totalOccupied,
        color: '#ef4444',
      },
      {
        name: 'Disponível',
        value: totalAvailable,
        color: '#10b981',
      },
    ];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar ocupação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
