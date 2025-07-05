export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apartment as Apartment } from '@prisma/client'; // Importamos o tipo e damos um apelido

export async function GET() {
  try {
    const now = new Date();
    // Correção 1: Usamos prisma.apartment (minúsculo) como definido no seu schema
    const apartments = await prisma.apartment.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
    });

    const occupancyData = await Promise.all(
      // Correção 2: Usamos a variável no plural e minúscula (convenção)
      apartments.map(async (apt: Apartment) => { // Usamos o tipo com 'A' maiúsculo que o Prisma gera
        const reservations = await prisma.reservation.count({
          where: {
            // Correção 3: Usamos apartmentId (camelCase) como definido no schema
            apartmentId: apt.id,
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
          name: apt.name,
          value: isOccupied ? 100 : 0,
          color: isOccupied ? '#ef4444' : '#10b981',
        };
      })
    );

    const totalOccupied = occupancyData.filter(apt => apt.value > 0).length;
    const totalAvailable = apartments.length - totalOccupied;

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