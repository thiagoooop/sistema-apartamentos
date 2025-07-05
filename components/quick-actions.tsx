
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Calendar, 
  UserPlus, 
  FileText,
  Import
} from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'Nova Reserva',
      description: 'Criar uma nova reserva',
      icon: Plus,
      href: '/reservations/new',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Ver Calendário',
      description: 'Visualizar disponibilidade',
      icon: Calendar,
      href: '/calendar',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Novo Cliente',
      description: 'Cadastrar cliente',
      icon: UserPlus,
      href: '/clients/new',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Relatórios',
      description: 'Ver relatórios',
      icon: FileText,
      href: '/reports',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'Importar',
      description: 'Importar reservas',
      icon: Import,
      href: '/reservations/import',
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Ações Rápidas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
