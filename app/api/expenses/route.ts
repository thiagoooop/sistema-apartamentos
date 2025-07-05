
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

    const expenses = await prisma.expense.findMany({
      include: {
        apartment: {
          select: {
            id: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        expenseDate: 'desc'
      }
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { description, amount, expenseDate, receiptUrl, apartmentId, categoryId } = await request.json();

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        expenseDate: new Date(expenseDate),
        receiptUrl: receiptUrl || null,
        apartmentId: apartmentId || null,
        categoryId: categoryId || null,
        createdBy: user.id
      },
      include: {
        apartment: {
          select: {
            id: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
