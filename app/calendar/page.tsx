
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { CalendarView } from '@/components/calendar-view';
import { CalendarDays } from 'lucide-react';

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <CalendarDays className="h-6 w-6" />
            <span>Calendário</span>
          </h1>
          <p className="text-gray-600">
            Visualize a ocupação dos seus apartamentos
          </p>
        </div>

        {/* Calendar view */}
        <CalendarView />
      </div>
    </DashboardLayout>
  );
}
