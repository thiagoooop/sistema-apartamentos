
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Download, 
  Upload, 
  Database, 
  Calendar, 
  FileText,
  Loader2,
  AlertTriangle
} from 'lucide-react';

export function BackupManager() {
  const [loading, setLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'creating' | 'ready'>('idle');

  const handleCreateBackup = async () => {
    setLoading(true);
    setBackupStatus('creating');
    
    try {
      // Simular criação de backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      setBackupStatus('ready');
      toast.success('Backup criado com sucesso!');
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Erro ao criar backup');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    // Simular download
    toast.success('Download do backup iniciado');
  };

  const backupItems = [
    { name: 'Clientes', icon: Database, count: 0, size: '2.1 KB' },
    { name: 'Reservas', icon: Calendar, count: 0, size: '15.3 KB' },
    { name: 'Apartamentos', icon: Database, count: 0, size: '1.8 KB' },
    { name: 'Configurações', icon: FileText, count: 0, size: '0.5 KB' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Create Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Criar Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Crie um backup completo de todos os dados do sistema.
          </p>
          
          <div className="space-y-3">
            {backupItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{item.size}</Badge>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleCreateBackup} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Backup...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Criar Backup
                </>
              )}
            </Button>
          </div>

          {backupStatus === 'ready' && (
            <Button 
              variant="outline" 
              onClick={handleDownloadBackup}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Backup
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Restore Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Restaurar Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Atenção</h4>
              <p className="text-sm text-amber-700">
                Restaurar um backup substituirá todos os dados atuais do sistema.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                Arraste um arquivo de backup aqui ou clique para selecionar
              </p>
            </div>
          </div>

          <Button variant="outline" className="w-full" disabled>
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Arquivo
          </Button>

          <Button variant="destructive" className="w-full" disabled>
            Restaurar Backup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
