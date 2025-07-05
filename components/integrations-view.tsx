
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  Settings, 
  Wifi, 
  WifiOff, 
  Building2, 
  Key,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Integration {
  id: string;
  platform: 'BOOKING' | 'AIRBNB' | 'VRBO';
  isActive: boolean;
  lastSync?: string;
  propertyCount: number;
}

const platformConfig = {
  BOOKING: {
    name: 'Booking.com',
    icon: Globe,
    color: 'blue',
    description: 'Integração com Booking.com para sincronização automática de reservas'
  },
  AIRBNB: {
    name: 'Airbnb',
    icon: Building2,
    color: 'red',
    description: 'Integração com Airbnb para gestão unificada de propriedades'
  },
  VRBO: {
    name: 'VRBO',
    icon: Globe,
    color: 'orange',
    description: 'Integração com VRBO para maximizar ocupação'
  }
};

export function IntegrationsView() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/integrations');
      if (response.ok) {
        const data = await response.json();
        setIntegrations(Array.isArray(data) ? data : (data.integrations || []));
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (integrationId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.id === integrationId 
              ? { ...integration, isActive }
              : integration
          )
        );
      }
    } catch (error) {
      console.error('Error toggling integration:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const safeIntegrations = Array.isArray(integrations) ? integrations : [];
  const platforms = Object.keys(platformConfig) as Array<keyof typeof platformConfig>;

  return (
    <div className="space-y-6">
      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {safeIntegrations.filter(i => i.isActive).length}
                </div>
                <p className="text-sm text-gray-600">Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {safeIntegrations.filter(i => !i.isActive).length}
                </div>
                <p className="text-sm text-gray-600">Inativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {safeIntegrations.reduce((sum, i) => sum + i.propertyCount, 0)}
                </div>
                <p className="text-sm text-gray-600">Propriedades Sincronizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const config = platformConfig[platform];
          const integration = safeIntegrations.find(i => i.platform === platform);
          const Icon = config.icon;
          
          return (
            <Card key={platform}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 text-${config.color}-600`} />
                    <span>{config.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {integration?.isActive ? (
                      <Wifi className="h-4 w-4 text-green-600" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      checked={integration?.isActive || false}
                      onCheckedChange={(checked) => 
                        integration && toggleIntegration(integration.id, checked)
                      }
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  {config.description}
                </p>
                
                {integration ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge 
                        variant={integration.isActive ? "default" : "secondary"}
                        className={integration.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {integration.isActive ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </div>
                    
                    {integration.lastSync && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Última Sincronização:</span>
                        <span className="text-sm font-medium">
                          {new Date(integration.lastSync).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Propriedades:</span>
                      <span className="text-sm font-medium">
                        {integration.propertyCount}
                      </span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`${platform}-api-key`}>API Key</Label>
                      <Input
                        id={`${platform}-api-key`}
                        type="password"
                        placeholder="Sua API key..."
                      />
                    </div>
                    
                    <Button className="w-full" disabled>
                      <Key className="mr-2 h-4 w-4" />
                      Conectar {config.name}
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      * Funcionalidade em desenvolvimento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Configuração de Webhooks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Configure URLs de webhook para receber notificações automáticas das plataformas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <Input
                id="webhook-url"
                placeholder="https://seu-dominio.com/api/webhooks"
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Secret Token</Label>
              <Input
                id="webhook-secret"
                type="password"
                placeholder="Token secreto para validação"
                disabled
              />
            </div>
          </div>
          
          <Button variant="outline" disabled>
            <Settings className="mr-2 h-4 w-4" />
            Salvar Configuração
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
