
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { NewReservationForm } from '@/components/new-reservation-form';
import { ArrowLeft, BookUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewReservationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/reservations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <BookUser className="h-6 w-6" />
                <span>Nova Reserva</span>
              </h1>
              <p className="text-gray-600">
                Crie uma nova reserva para seus apartamentos
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <NewReservationForm />
      </div>
    </DashboardLayout>
  );
}
