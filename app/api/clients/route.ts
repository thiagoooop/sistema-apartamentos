
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.client.count({ where });

    return NextResponse.json({
      clients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
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
      name,
      email,
      phone,
      cpf,
      birthDate,
      address,
      city,
      state,
      zipCode,
    } = body;

    // Verificar se email já existe
    const existingClient = await prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 400 }
      );
    }

    // Verificar se CPF já existe (se fornecido)
    if (cpf) {
      const existingCpf = await prisma.client.findUnique({
        where: { cpf },
      });

      if (existingCpf) {
        return NextResponse.json(
          { error: 'CPF já cadastrado' },
          { status: 400 }
        );
      }
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        cpf,
        birthDate: birthDate ? new Date(birthDate) : null,
        address,
        city,
        state,
        zipCode,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
