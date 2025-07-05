
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { StatsCards } from '@/components/stats-cards';
import { RecentReservations } from '@/components/recent-reservations';
import { OccupancyChart } from '@/components/occupancy-chart';
import { QuickActions } from '@/components/quick-actions';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral do seu sistema de gestão de apartamentos
          </p>
        </div>

        {/* Stats cards */}
        <StatsCards />

        {/* Quick actions */}
        <QuickActions />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent reservations */}
          <div className="lg:col-span-2">
            <RecentReservations />
          </div>

          {/* Occupancy chart */}
          <div className="lg:col-span-1">
            <OccupancyChart />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
