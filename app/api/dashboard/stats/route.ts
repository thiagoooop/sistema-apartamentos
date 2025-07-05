
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Receita do mês
    const monthlyReservations = await prisma.reservation.findMany({
      where: {
        checkIn: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        totalAmount: true,
      },
    });

    const monthlyRevenue = monthlyReservations.reduce(
      (sum, reservation) => sum + reservation.totalAmount,
      0
    );

    // Taxa de ocupação (próximos 30 dias)
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const totalDays = 30;
    const totalApartments = await prisma.apartment.count({
      where: { isActive: true },
    });
    const totalPossibleDays = totalDays * totalApartments;

    const occupiedDays = await prisma.reservation.findMany({
      where: {
        checkIn: {
          lte: next30Days,
        },
        checkOut: {
          gte: now,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });

    let totalOccupiedDays = 0;
    occupiedDays.forEach((reservation) => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      totalOccupiedDays += days;
    });

    const occupancyRate = totalPossibleDays > 0 ? (totalOccupiedDays / totalPossibleDays) * 100 : 0;

    // Próximos check-ins (próximos 7 dias)
    const upcomingCheckins = await prisma.reservation.count({
      where: {
        checkIn: {
          gte: now,
          lte: startOfWeek,
        },
        status: {
          not: 'CANCELLED',
        },
      },
    });

    // Total de clientes
    const totalClients = await prisma.client.count();

    // Apartamentos disponíveis hoje
    const reservationsToday = await prisma.reservation.findMany({
      where: {
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
      select: {
        apartmentId: true,
      },
    });

    const occupiedApartmentIds = reservationsToday.map(r => r.apartmentId);
    const availableApartments = await prisma.apartment.count({
      where: {
        isActive: true,
        id: {
          notIn: occupiedApartmentIds,
        },
      },
    });

    return NextResponse.json({
      monthlyRevenue,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      upcomingCheckins,
      totalClients,
      availableApartments,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
