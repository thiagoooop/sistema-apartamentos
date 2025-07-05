
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { AddClientForm } from '@/components/add-client-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewClientPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Link href="/clients">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <UserPlus className="h-6 w-6" />
              <span>Novo Cliente</span>
            </h1>
            <p className="text-gray-600">
              Adicione um novo cliente ao sistema
            </p>
          </div>
        </div>

        {/* Add client form */}
        <div className="bg-white rounded-lg shadow p-6">
          <AddClientForm />
        </div>
      </div>
    </DashboardLayout>
  );
}
