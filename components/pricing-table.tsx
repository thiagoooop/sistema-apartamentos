
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, DollarSign, Edit, Trash2, Building2, Plus, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Pricing {
  id: string;
  startDate: string;
  endDate: string;
  price: number;
  apartment: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Apartment {
  id: string;
  name: string;
}

export function PricingTable() {
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    price: 0,
    apartmentId: '',
  });

  useEffect(() => {
    fetchPricing();
    fetchApartments();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pricing');
      if (response.ok) {
        const data = await response.json();
        setPricing(Array.isArray(data) ? data : (data.pricing || []));
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setPricing([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApartments = async () => {
    try {
      const response = await fetch('/api/apartments');
      if (response.ok) {
        const data = await response.json();
        setApartments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      if (!formData.startDate || !formData.endDate || !formData.price || !formData.apartmentId) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error('A data de fim deve ser posterior à data de início');
        return;
      }

      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Preço definido com sucesso!');
        setIsModalOpen(false);
        setFormData({
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          price: 0,
          apartmentId: '',
        });
        fetchPricing();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao definir preço');
      }
    } catch (error) {
      console.error('Erro ao definir preço:', error);
      toast.error('Erro interno do servidor');
    } finally {
      setIsCreating(false);
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

  const safePricing = Array.isArray(pricing) ? pricing : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Preços Configurados</span>
        </CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Definir Preço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Definir Preço por Período</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data Fim *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="apartmentId">Apartamento *</Label>
                <Select
                  value={formData.apartmentId}
                  onValueChange={(value) => handleInputChange('apartmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um apartamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map((apartment) => (
                      <SelectItem key={apartment.id} value={apartment.id}>
                        {apartment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Definir
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {safePricing.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum preço configurado
            </h3>
            <p className="text-gray-600 mb-4">
              Comece definindo preços especiais para períodos específicos.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Definir Primeiro Preço
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safePricing.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {format(new Date(item.startDate), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(item.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>{item.apartment?.name || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      R$ {item.price?.toFixed(2) || '0.00'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setFormData({
                            startDate: item.startDate,
                            endDate: item.endDate,
                            price: item.price,
                            apartmentId: item.apartment.id,
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
