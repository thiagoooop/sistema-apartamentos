
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { IntegrationsView } from '@/components/integrations-view';
import { Plug } from 'lucide-react';

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Plug className="h-6 w-6" />
              <span>Integrações</span>
            </h1>
            <p className="text-gray-600">
              Configure integrações com plataformas externas
            </p>
          </div>
        </div>

        {/* Integrations view */}
        <IntegrationsView />
      </div>
    </DashboardLayout>
  );
}
