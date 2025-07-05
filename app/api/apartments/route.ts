
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(apartments);
  } catch (error) {
    console.error('Erro ao buscar apartamentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
