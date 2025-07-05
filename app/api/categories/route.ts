
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const categories = await prisma.category.findMany({
      where: type ? {
        type: {
          in: type === 'TASK' ? ['TASK', 'BOTH'] : 
              type === 'EXPENSE' ? ['EXPENSE', 'BOTH'] : 
              ['TASK', 'EXPENSE', 'BOTH']
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, color, type } = await request.json();

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        color: color || '#3B82F6',
        type: type || 'BOTH'
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
