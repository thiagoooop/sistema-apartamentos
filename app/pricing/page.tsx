
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { PricingTable } from '@/components/pricing-table';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign } from 'lucide-react';

export default function PricingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <DollarSign className="h-6 w-6" />
              <span>Preços</span>
            </h1>
            <p className="text-gray-600">
              Gerencie os preços por data dos seus apartamentos
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Definir Preço
          </Button>
        </div>

        {/* Pricing table */}
        <PricingTable />
      </div>
    </DashboardLayout>
  );
}
