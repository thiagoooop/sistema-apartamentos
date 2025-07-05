
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pricing = await prisma.pricing.findMany({
      include: {
        apartment: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, price, apartmentId } = await request.json();

    // Validar se endDate é posterior ou igual a startDate
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ error: 'A data de fim deve ser posterior ou igual à data de início' }, { status: 400 });
    }

    // Verificar se já existe um período sobreposto para o mesmo apartamento
    const existingPricing = await prisma.pricing.findFirst({
      where: {
        apartmentId,
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } }
            ]
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } }
            ]
          },
          {
            AND: [
              { startDate: { gte: new Date(startDate) } },
              { endDate: { lte: new Date(endDate) } }
            ]
          }
        ]
      }
    });

    if (existingPricing) {
      return NextResponse.json({ error: 'Já existe um período de preço configurado que sobrepõe com as datas selecionadas' }, { status: 400 });
    }

    const pricing = await prisma.pricing.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: parseFloat(price),
        apartmentId
      },
      include: {
        apartment: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error creating pricing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
