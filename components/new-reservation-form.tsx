
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, DollarSign, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Apartment {
  id: string;
  name: string;
}

export function NewReservationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalAmount: 0,
    paidAmount: 0,
    paymentStatus: 'PENDING',
    status: 'CONFIRMED',
    notes: '',
    source: 'MANUAL',
    apartmentId: '',
    clientId: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Carregar dados em paralelo
      const [clientsResponse, apartmentsResponse] = await Promise.all([
        fetch('/api/clients').catch(() => null),
        fetch('/api/apartments').catch(() => null)
      ]);

      // Processar clientes
      if (clientsResponse?.ok) {
        try {
          const clientsData = await clientsResponse.json();
          const clientsList = clientsData?.clients || clientsData || [];
          setClients(Array.isArray(clientsList) ? clientsList : []);
        } catch (error) {
          console.error('Erro ao processar dados de clientes:', error);
          setClients([]);
        }
      } else {
        console.error('Erro ao carregar clientes');
        setClients([]);
      }

      // Processar apartamentos
      if (apartmentsResponse?.ok) {
        try {
          const apartmentsData = await apartmentsResponse.json();
          setApartments(Array.isArray(apartmentsData) ? apartmentsData : []);
        } catch (error) {
          console.error('Erro ao processar dados de apartamentos:', error);
          setApartments([]);
        }
      } else {
        console.error('Erro ao carregar apartamentos');
        setApartments([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      setClients([]);
      setApartments([]);
    } finally {
      setLoadingData(false);
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
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.checkIn || !formData.checkOut || !formData.apartmentId || !formData.clientId) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
        toast.error('A data de check-out deve ser posterior à data de check-in');
        return;
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Reserva criada com sucesso!');
        router.push('/reservations');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao criar reserva');
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast.error('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto carrega dados
  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dados...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Informações da Reserva</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in *</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out *</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guests">Número de Hóspedes</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
              />
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
                  {apartments.length > 0 ? (
                    apartments.map((apartment) => (
                      <SelectItem key={apartment.id} value={apartment.id}>
                        {apartment.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Nenhum apartamento disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="clientId">Cliente *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => handleInputChange('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-sm text-gray-500">{client.email}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Nenhum cliente disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Informações financeiras e status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Informações Financeiras</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="totalAmount">Valor Total (R$)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="paidAmount">Valor Pago (R$)</Label>
              <Input
                id="paidAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.paidAmount}
                onChange={(e) => handleInputChange('paidAmount', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="paymentStatus">Status do Pagamento</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="PARTIAL">Parcial</SelectItem>
                  <SelectItem value="PAID">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status da Reserva</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source">Fonte da Reserva</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => handleInputChange('source', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="AIRBNB">Airbnb</SelectItem>
                  <SelectItem value="BOOKING">Booking.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Observações adicionais sobre a reserva..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/reservations')}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Criar Reserva
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
