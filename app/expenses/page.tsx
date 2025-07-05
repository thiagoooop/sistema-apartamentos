
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { ExpensesView } from '@/components/expenses-view';
import { Receipt } from 'lucide-react';

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Receipt className="h-6 w-6" />
              <span>Gastos</span>
            </h1>
            <p className="text-gray-600">
              Controle todos os gastos e despesas
            </p>
          </div>
        </div>

        {/* Expenses view */}
        <ExpensesView />
      </div>
    </DashboardLayout>
  );
}
