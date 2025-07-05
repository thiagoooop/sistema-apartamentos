
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { ReportsView } from '@/components/reports-view';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Relatórios</span>
          </h1>
          <p className="text-gray-600">
            Análise detalhada do desempenho dos seus apartamentos
          </p>
        </div>

        {/* Reports view */}
        <ReportsView />
      </div>
    </DashboardLayout>
  );
}
