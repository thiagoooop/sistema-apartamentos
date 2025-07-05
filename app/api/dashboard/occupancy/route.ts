export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
// Correção Final: Importamos diretamente o tipo 'Apartment' com 'A' maiúsculo.
import { Apartment } from '@prisma/client'; 

export async function GET() {
  try {
    const now = new Date();
    // Usamos prisma.apartment (minúsculo) para a busca.
    // O resultado será um array de objetos do tipo 'Apartment'.
    const apartments: Apartment[] = await prisma.apartment.findMany({
      where: { isActive: true },
    });

    const occupancyData = await Promise.all(
      apartments.map(async (apartment: Apartment) => { // Tipamos o parâmetro corretamente.
        const reservations = await prisma.reservation.count({
          where: {
            apartmentId: apartment.id, // Usamos o id do parâmetro.
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
          name: apartment.name,
          value: isOccupied ? 100 : 0,
          color: isOccupied ? '#ef4444' : '#10b981',
        };
      })
    );

    const totalOccupied = occupancyData.filter(apt => apt.value > 0).length;
    const totalAvailable = apartments.length;

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