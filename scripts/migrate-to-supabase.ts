
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function migrateToSupabase() {
  console.log('🔄 Iniciando migração para Supabase...');
  
  try {
    // Verificar conectividade
    await prisma.$connect();
    console.log('✅ Conectado ao Supabase');

    // Aplicar migrações do Prisma
    console.log('📦 Aplicando migrações do schema...');
    // Nota: Execute "npx prisma migrate deploy" antes de rodar este script
    
    // Verificar se existem dados
    const userCount = await prisma.user.count();
    const apartmentCount = await prisma.apartment.count();
    const clientCount = await prisma.client.count();
    
    console.log(`📊 Status atual do banco:`);
    console.log(`   • Usuários: ${userCount}`);
    console.log(`   • Apartamentos: ${apartmentCount}`);
    console.log(`   • Clientes: ${clientCount}`);
    
    if (userCount === 0) {
      console.log('🚀 Banco vazio detectado. Executando setup inicial...');
      
      // Executar setup inicial
      const { execSync } = require('child_process');
      execSync('npx tsx scripts/setup-supabase.ts', { stdio: 'inherit' });
      
    } else {
      console.log('✅ Banco já possui dados. Migração concluída!');
    }
    
    console.log('🎉 Migração para Supabase concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateToSupabase()
  .catch((e) => {
    console.error('❌ Falha na migração:', e);
    process.exit(1);
  });
