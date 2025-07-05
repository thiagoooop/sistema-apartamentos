
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'last12months';

    let startDate: Date;
    let endDate: Date = new Date();

    switch (period) {
      case 'thisyear':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case 'lastyear':
        startDate = new Date(endDate.getFullYear() - 1, 0, 1);
        endDate = new Date(endDate.getFullYear() - 1, 11, 31);
        break;
      case 'last6months':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, 1);
        break;
      default: // last12months
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 12, 1);
        break;
    }

    // Buscar todas as reservas do período
    const reservations = await prisma.reservation.findMany({
      where: {
        checkIn: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: 'CANCELLED',
        },
      },
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
    });

    // Agrupar dados por mês
    const monthlyData: { [key: string]: { revenue: { [aptId: string]: number }, occupancy: { [aptId: string]: number } } } = {};
    
    reservations.forEach(reservation => {
      const month = new Date(reservation.checkIn).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: {}, occupancy: {} };
      }
      
      const aptId = reservation.apartment.id;
      monthlyData[month].revenue[aptId] = (monthlyData[month].revenue[aptId] || 0) + reservation.totalAmount;
      
      // Calcular dias de ocupação
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      monthlyData[month].occupancy[aptId] = (monthlyData[month].occupancy[aptId] || 0) + days;
    });

    // Buscar apartamentos
    const apartments = await prisma.apartment.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    // Preparar dados para gráficos
    const revenue = Object.keys(monthlyData).map(month => ({
      month,
      apartment1: monthlyData[month].revenue[apartments[0]?.id] || 0,
      apartment2: monthlyData[month].revenue[apartments[1]?.id] || 0,
      total: Object.values(monthlyData[month].revenue).reduce((sum, value) => sum + value, 0),
    }));

    const occupancy = Object.keys(monthlyData).map(month => {
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const apt1Days = monthlyData[month].occupancy[apartments[0]?.id] || 0;
      const apt2Days = monthlyData[month].occupancy[apartments[1]?.id] || 0;
      const apt1Occupancy = (apt1Days / daysInMonth) * 100;
      const apt2Occupancy = (apt2Days / daysInMonth) * 100;
      
      return {
        month,
        apartment1: Math.round(apt1Occupancy * 10) / 10,
        apartment2: Math.round(apt2Occupancy * 10) / 10,
        average: Math.round(((apt1Occupancy + apt2Occupancy) / 2) * 10) / 10,
      };
    });

    // Top clientes
    const clientStats: { [clientId: string]: { name: string, totalStays: number, totalAmount: number } } = {};
    
    reservations.forEach(reservation => {
      const clientId = reservation.clientId;
      if (!clientStats[clientId]) {
        clientStats[clientId] = {
          name: reservation.client.name,
          totalStays: 0,
          totalAmount: 0,
        };
      }
      clientStats[clientId].totalStays += 1;
      clientStats[clientId].totalAmount += reservation.totalAmount;
    });

    const topClients = Object.values(clientStats)
      .sort((a, b) => b.totalStays - a.totalStays)
      .slice(0, 5);

    // Resumo
    const totalRevenue = reservations.reduce((sum, r) => sum + r.totalAmount, 0);
    const averageOccupancy = occupancy.reduce((sum, o) => sum + o.average, 0) / occupancy.length || 0;
    const totalReservations = reservations.length;
    const topClient = topClients[0]?.name || 'Nenhum';

    return NextResponse.json({
      revenue,
      occupancy,
      topClients,
      summary: {
        totalRevenue,
        averageOccupancy: Math.round(averageOccupancy * 10) / 10,
        totalReservations,
        topClient,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar relatórios:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
