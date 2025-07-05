
export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/components/dashboard-layout';
import { BackupManager } from '@/components/backup-manager';
import { DatabaseBackup } from 'lucide-react';

export default function BackupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <DatabaseBackup className="h-6 w-6" />
              <span>Backup</span>
            </h1>
            <p className="text-gray-600">
              Faça backup e restaure os dados do sistema
            </p>
          </div>
        </div>

        {/* Backup manager */}
        <BackupManager />
      </div>
    </DashboardLayout>
  );
}
