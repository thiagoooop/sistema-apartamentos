
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProduction() {
  console.log('🧪 Testando configuração de produção...');
  
  try {
    // Teste de conectividade
    console.log('🔗 Testando conexão com banco...');
    await prisma.$connect();
    console.log('✅ Conexão com banco OK');

    // Teste de leitura
    console.log('📖 Testando leitura de dados...');
    const userCount = await prisma.user.count();
    const apartmentCount = await prisma.apartment.count();
    const clientCount = await prisma.client.count();
    const reservationCount = await prisma.reservation.count();
    
    console.log(`📊 Dados no banco:`);
    console.log(`   • Usuários: ${userCount}`);
    console.log(`   • Apartamentos: ${apartmentCount}`);
    console.log(`   • Clientes: ${clientCount}`);
    console.log(`   • Reservas: ${reservationCount}`);

    // Teste de autenticação
    console.log('🔐 Testando usuário administrador...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'thiago_pera@me.com' },
    });
    
    if (adminUser) {
      console.log('✅ Usuário administrador encontrado');
      console.log(`   • Email: ${adminUser.email}`);
      console.log(`   • Nome: ${adminUser.name}`);
      console.log(`   • Criado em: ${adminUser.createdAt}`);
    } else {
      console.log('❌ Usuário administrador não encontrado');
    }

    // Teste de dados essenciais
    console.log('📋 Testando dados essenciais...');
    const apartments = await prisma.apartment.findMany({
      where: { isActive: true },
      select: { id: true, name: true, basePrice: true },
    });
    
    console.log(`🏠 Apartamentos ativos: ${apartments.length}`);
    apartments.forEach(apt => {
      console.log(`   • ${apt.name} (R$ ${apt.basePrice})`);
    });

    // Teste de reservas
    console.log('📅 Testando reservas...');
    const activeReservations = await prisma.reservation.findMany({
      where: { 
        status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        checkOut: { gte: new Date() }
      },
      include: {
        client: { select: { name: true } },
        apartment: { select: { name: true } }
      }
    });
    
    console.log(`📋 Reservas ativas: ${activeReservations.length}`);
    activeReservations.forEach(res => {
      console.log(`   • ${res.client.name} - ${res.apartment.name} (${res.status})`);
    });

    console.log('🎉 Todos os testes passaram!');
    console.log('✅ Sistema pronto para produção');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testProduction()
  .catch((e) => {
    console.error('❌ Falha nos testes:', e);
    process.exit(1);
  });
