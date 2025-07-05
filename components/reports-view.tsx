
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Building2
} from 'lucide-react';

interface RevenueData {
  month: string;
  apartment1: number;
  apartment2: number;
  total: number;
}

interface OccupancyData {
  month: string;
  apartment1: number;
  apartment2: number;
  average: number;
}

interface TopClientsData {
  name: string;
  totalStays: number;
  totalAmount: number;
}

interface ReportsData {
  revenue: RevenueData[];
  occupancy: OccupancyData[];
  topClients: TopClientsData[];
  summary: {
    totalRevenue: number;
    averageOccupancy: number;
    totalReservations: number;
    topClient: string;
  };
}

export function ReportsView() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('last12months');

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports?period=${period}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/reports/export?period=${period}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${period}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="loading-spinner"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500">Erro ao carregar relatórios</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last12months">Últimos 12 meses</SelectItem>
            <SelectItem value="thisyear">Este ano</SelectItem>
            <SelectItem value="lastyear">Ano passado</SelectItem>
            <SelectItem value="last6months">Últimos 6 meses</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.summary.totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupação Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.averageOccupancy.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalReservations}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente Top</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {data.summary.topClient}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal por Apartamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Receita']}
                  />
                  <Legend />
                  <Bar dataKey="apartment1" fill={chartColors[0]} name="Apartamento 1" />
                  <Bar dataKey="apartment2" fill={chartColors[1]} name="Apartamento 2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy chart */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Ocupação Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.occupancy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Ocupação']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="apartment1" 
                    stroke={chartColors[0]} 
                    strokeWidth={2}
                    name="Apartamento 1"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="apartment2" 
                    stroke={chartColors[1]} 
                    strokeWidth={2}
                    name="Apartamento 2"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke={chartColors[2]} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Média"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top clients */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Mais Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600">
                      {client.totalStays} estadia{client.totalStays > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(client.totalAmount)}</p>
                  <p className="text-sm text-gray-600">Total gasto</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
