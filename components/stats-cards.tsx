
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp,
  Building2
} from 'lucide-react';

interface StatsData {
  monthlyRevenue: number;
  occupancyRate: number;
  upcomingCheckins: number;
  totalClients: number;
  availableApartments: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    monthlyRevenue: 0,
    occupancyRate: 0,
    upcomingCheckins: 0,
    totalClients: 0,
    availableApartments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Receita do Mês',
      value: stats.monthlyRevenue,
      icon: DollarSign,
      format: 'currency',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Taxa de Ocupação',
      value: stats.occupancyRate,
      icon: TrendingUp,
      format: 'percentage',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Próximos Check-ins',
      value: stats.upcomingCheckins,
      icon: Calendar,
      format: 'number',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: Users,
      format: 'number',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Apartamentos Disponíveis',
      value: stats.availableApartments,
      icon: Building2,
      format: 'number',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (loading) return '-';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(card.value, card.format)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
