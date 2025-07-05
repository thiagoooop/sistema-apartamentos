import 'dotenv/config';
import { prisma } from '../lib/db'; 
import bcrypt from 'bcryptjs';

async function setupSupabase() {
  console.log('🚀 Iniciando setup do Supabase...');
  
  try {
    // Teste de conectividade
    await prisma.$connect();
    console.log('✅ Conectado ao banco Supabase com sucesso!');

    // Criar usuário administrador
    console.log('👤 Criando usuário administrador...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'thiago_pera@me.com' },
      update: {},
      create: {
        email: 'thiago_pera@me.com',
        name: 'Thiago Pera',
        password: hashedPassword,
      },
    });

    console.log('✅ Usuário administrador criado:', user.email);

    // Criar categorias padrão
    console.log('📋 Criando categorias padrão...');
    await prisma.category.createMany({
      data: [
        {
          name: 'Limpeza',
          description: 'Tarefas de limpeza e manutenção',
          color: '#10B981',
          type: 'BOTH',
          isActive: true,
        },
        {
          name: 'Manutenção',
          description: 'Reparos e manutenção preventiva',
          color: '#F59E0B',
          type: 'BOTH',
          isActive: true,
        },
        {
          name: 'Suprimentos',
          description: 'Compra de suprimentos e materiais',
          color: '#3B82F6',
          type: 'EXPENSE',
          isActive: true,
        },
        {
          name: 'Check-in/Check-out',
          description: 'Preparação para hóspedes',
          color: '#8B5CF6',
          type: 'TASK',
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Categorias padrão criadas');

    // Criar apartamentos exemplo
    console.log('🏠 Criando apartamentos exemplo...');
    const apt1 = await prisma.apartment.upsert({
      where: { id: 'apt1' },
      update: {},
      create: {
        id: 'apt1',
        name: 'Apartamento 1',
        description: 'Apartamento moderno com 2 quartos e vista para o mar',
        basePrice: 150.0,
        maxGuests: 4,
        isActive: true,
      },
    });

    const apt2 = await prisma.apartment.upsert({
      where: { id: 'apt2' },
      update: {},
      create: {
        id: 'apt2',
        name: 'Apartamento 2',
        description: 'Apartamento aconchegante com 1 quarto e varanda',
        basePrice: 120.0,
        maxGuests: 2,
        isActive: true,
      },
    });

    console.log('✅ Apartamentos criados');

    // Criar clientes exemplo
    console.log('👥 Criando clientes exemplo...');
    const client1 = await prisma.client.upsert({
      where: { email: 'maria@email.com' },
      update: {},
      create: {
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        birthDate: new Date('1990-05-15'),
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        totalStays: 0,
      },
    });

    const client2 = await prisma.client.upsert({
      where: { email: 'joao@email.com' },
      update: {},
      create: {
        name: 'João Santos',
        email: 'joao@email.com',
        phone: '(11) 88888-8888',
        cpf: '987.654.321-00',
        birthDate: new Date('1985-10-20'),
        address: 'Av. Paulista, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        totalStays: 0,
      },
    });

    console.log('✅ Clientes exemplo criados');

    // Criar reservas exemplo
    console.log('📅 Criando reservas exemplo...');
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.reservation.createMany({
      data: [
        {
          checkIn: nextWeek,
          checkOut: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
          guests: 2,
          totalAmount: 450.0,
          paidAmount: 450.0,
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          notes: 'Cliente VIP',
          source: 'MANUAL',
          apartmentId: apt1.id,
          clientId: client1.id,
        },
        {
          checkIn: nextMonth,
          checkOut: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
          guests: 1,
          totalAmount: 240.0,
          paidAmount: 120.0,
          paymentStatus: 'PARTIAL',
          status: 'CONFIRMED',
          notes: 'Check-in às 15h',
          source: 'AIRBNB',
          apartmentId: apt2.id,
          clientId: client2.id,
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Reservas exemplo criadas');

    console.log('🎉 Setup do Supabase concluído com sucesso!');
    console.log('📧 Login: thiago_pera@me.com');
    console.log('🔑 Senha: 123456');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupSupabase()
  .catch((e) => {
    console.error('❌ Falha no setup:', e);
    process.exit(1);
  });
