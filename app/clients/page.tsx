
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { ClientsTable } from '@/components/clients-table';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Clientes</span>
            </h1>
            <p className="text-gray-600">
              Gerencie todos os seus clientes e histórico de reservas
            </p>
          </div>
          <Link href="/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        </div>

        {/* Clients table */}
        <ClientsTable />
      </div>
    </DashboardLayout>
  );
}
