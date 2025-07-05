
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { TasksView } from '@/components/tasks-view';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <CheckSquare className="h-6 w-6" />
              <span>Tarefas</span>
            </h1>
            <p className="text-gray-600">
              Gerencie todas as tarefas do sistema
            </p>
          </div>
        </div>

        {/* Tasks view */}
        <TasksView />
      </div>
    </DashboardLayout>
  );
}
