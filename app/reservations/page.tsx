
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { ReservationsTable } from '@/components/reservations-table';
import { Button } from '@/components/ui/button';
import { Plus, BookUser, Import } from 'lucide-react';
import Link from 'next/link';

export default function ReservationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <BookUser className="h-6 w-6" />
              <span>Reservas</span>
            </h1>
            <p className="text-gray-600">
              Gerencie todas as reservas dos seus apartamentos
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/reservations/import">
              <Button variant="outline">
                <Import className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </Link>
            <Link href="/reservations/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Reserva
              </Button>
            </Link>
          </div>
        </div>

        {/* Reservations table */}
        <ReservationsTable />
      </div>
    </DashboardLayout>
  );
}
