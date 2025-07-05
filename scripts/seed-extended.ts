
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedExtended() {
  console.log('🌱 Seeding extended data...');

  try {
    // Seed Categories
    console.log('Creating categories...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Manutenção' },
        update: {},
        create: {
          name: 'Manutenção',
          description: 'Tarefas e gastos relacionados à manutenção',
          color: '#F59E0B',
          type: 'BOTH'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Limpeza' },
        update: {},
        create: {
          name: 'Limpeza',
          description: 'Tarefas e gastos de limpeza',
          color: '#10B981',
          type: 'BOTH'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Administrativo' },
        update: {},
        create: {
          name: 'Administrativo',
          description: 'Tarefas administrativas',
          color: '#3B82F6',
          type: 'TASK'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Operacional' },
        update: {},
        create: {
          name: 'Operacional',
          description: 'Gastos operacionais',
          color: '#8B5CF6',
          type: 'EXPENSE'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Emergência' },
        update: {},
        create: {
          name: 'Emergência',
          description: 'Situações de emergência',
          color: '#EF4444',
          type: 'BOTH'
        }
      })
    ]);

    console.log(`Created ${categories.length} categories`);

    // Get existing user and apartments
    const user = await prisma.user.findFirst();
    const apartments = await prisma.apartment.findMany();

    if (!user) {
      console.log('❌ No user found, skipping tasks and expenses');
      return;
    }

    if (apartments.length === 0) {
      console.log('❌ No apartments found, skipping tasks and expenses');
      return;
    }

    // Seed Tasks
    console.log('Creating tasks...');
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'Verificar ar condicionado',
          description: 'Verificar funcionamento do ar condicionado no apartamento 101',
          status: 'PENDING',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          apartmentId: apartments[0]?.id,
          categoryId: categories[0]?.id, // Manutenção
          createdBy: user.id
        }
      }),
      prisma.task.create({
        data: {
          title: 'Limpeza pós check-out',
          description: 'Realizar limpeza completa após saída do hóspede',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          apartmentId: apartments[1]?.id || apartments[0]?.id,
          categoryId: categories[1]?.id, // Limpeza
          createdBy: user.id
        }
      }),
      prisma.task.create({
        data: {
          title: 'Atualizar fotos do anúncio',
          description: 'Fazer novas fotos para os anúncios online',
          status: 'COMPLETED',
          priority: 'LOW',
          completedAt: new Date(),
          categoryId: categories[2]?.id, // Administrativo
          createdBy: user.id
        }
      }),
      prisma.task.create({
        data: {
          title: 'Trocar fechadura',
          description: 'Trocar fechadura danificada',
          status: 'PENDING',
          priority: 'URGENT',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
          apartmentId: apartments[0]?.id,
          categoryId: categories[4]?.id, // Emergência
          createdBy: user.id
        }
      })
    ]);

    console.log(`Created ${tasks.length} tasks`);

    // Seed Expenses
    console.log('Creating expenses...');
    const expenses = await Promise.all([
      prisma.expense.create({
        data: {
          description: 'Material de limpeza',
          amount: 85.50,
          expenseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          apartmentId: apartments[0]?.id,
          categoryId: categories[1]?.id, // Limpeza
          createdBy: user.id
        }
      }),
      prisma.expense.create({
        data: {
          description: 'Reparo do ar condicionado',
          amount: 250.00,
          expenseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          apartmentId: apartments[1]?.id || apartments[0]?.id,
          categoryId: categories[0]?.id, // Manutenção
          createdBy: user.id
        }
      }),
      prisma.expense.create({
        data: {
          description: 'Taxa de administração predial',
          amount: 320.00,
          expenseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          categoryId: categories[3]?.id, // Operacional
          createdBy: user.id
        }
      }),
      prisma.expense.create({
        data: {
          description: 'Chamada de emergência - chaveiro',
          amount: 120.00,
          expenseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          apartmentId: apartments[0]?.id,
          categoryId: categories[4]?.id, // Emergência
          createdBy: user.id
        }
      }),
      prisma.expense.create({
        data: {
          description: 'Produtos de higiene para hóspedes',
          amount: 95.75,
          expenseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          apartmentId: apartments[1]?.id || apartments[0]?.id,
          categoryId: categories[3]?.id, // Operacional
          createdBy: user.id
        }
      })
    ]);

    console.log(`Created ${expenses.length} expenses`);

    // Seed Integration Configs
    console.log('Creating integration configs...');
    const integrations = await Promise.all([
      prisma.integrationConfig.upsert({
        where: { 
          platform: 'BOOKING'
        },
        update: {},
        create: {
          platform: 'BOOKING',
          isActive: false,
          webhookUrl: 'https://example.com/webhook/booking'
        }
      }),
      prisma.integrationConfig.upsert({
        where: { 
          platform: 'AIRBNB'
        },
        update: {},
        create: {
          platform: 'AIRBNB',
          isActive: true,
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          webhookUrl: 'https://example.com/webhook/airbnb'
        }
      }),
      prisma.integrationConfig.upsert({
        where: { 
          platform: 'VRBO'
        },
        update: {},
        create: {
          platform: 'VRBO',
          isActive: false
        }
      })
    ]);

    console.log(`Created ${integrations.length} integration configs`);

    // Seed Property Maps for active integrations
    if (integrations[1] && apartments.length > 0) { // Airbnb integration
      console.log('Creating property maps...');
      const propertyMaps = await Promise.all(
        apartments.slice(0, 2).map((apartment, index) => 
          prisma.propertyMap.create({
            data: {
              apartmentId: apartment.id,
              externalId: `airbnb_${apartment.id}_${index + 1}`,
              externalName: `Airbnb - ${apartment.name}`,
              integrationId: integrations[1].id,
              isActive: true
            }
          })
        )
      );
      console.log(`Created ${propertyMaps.length} property maps`);
    }

    // Seed some pricing data
    console.log('Creating pricing data...');
    if (apartments.length > 0) {
      const pricingData = [];
      const today = new Date();
      
      // Create period-based pricing (3-day periods)
      for (let i = 0; i < 30; i += 3) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + i);
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 2); // 3-day periods
        
        // Add random pricing for each apartment
        for (const apartment of apartments.slice(0, 2)) {
          const basePrice = apartment.basePrice || 100;
          const variation = (Math.random() - 0.5) * 40; // ±20 variation
          const finalPrice = Math.max(basePrice + variation, 50); // Minimum 50
          
          pricingData.push({
            startDate,
            endDate,
            price: Math.round(finalPrice * 100) / 100, // Round to 2 decimals
            apartmentId: apartment.id
          });
        }
      }
      
      // Insert pricing in batches to avoid conflicts
      for (const pricing of pricingData) {
        try {
          await prisma.pricing.create({
            data: pricing
          });
        } catch (error) {
          // Skip if period already exists
          console.log(`Skipping pricing for ${pricing.startDate.toISOString()} - ${pricing.endDate.toISOString()}`);
        }
      }
      
      console.log(`Created pricing data for periods`);
    }

    console.log('✅ Extended seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during extended seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedExtended()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
