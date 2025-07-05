
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

    const integrations = await prisma.integrationConfig.findMany({
      include: {
        propertyMaps: {
          include: {
            apartment: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        platform: 'asc'
      }
    });

    // Transform to include property count
    const integrationsWithCount = integrations.map(integration => ({
      ...integration,
      propertyCount: integration.propertyMaps?.length || 0
    }));

    return NextResponse.json(integrationsWithCount);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, apiKey, apiSecret, webhookUrl, settings } = await request.json();

    const integration = await prisma.integrationConfig.create({
      data: {
        platform,
        apiKey: apiKey || null,
        apiSecret: apiSecret || null,
        webhookUrl: webhookUrl || null,
        settings: settings || null,
        isActive: false
      }
    });

    return NextResponse.json(integration);
  } catch (error) {
    console.error('Error creating integration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
