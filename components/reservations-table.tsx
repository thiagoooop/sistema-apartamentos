
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  Eye,
  Edit,
  Trash2,
  Building2
} from 'lucide-react';
import Link from 'next/link';

interface Reservation {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  status: string;
  notes: string | null;
  source: string | null;
  client: {
    name: string;
    email: string;
    phone: string | null;
  };
  apartment: {
    name: string;
  };
  createdAt: string;
}

interface Apartment {
  id: string;
  name: string;
}

export function ReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchApartments();
    fetchReservations();
  }, [search, selectedApartment, selectedStatus, currentPage]);

  const fetchApartments = async () => {
    try {
      const response = await fetch('/api/apartments');
      if (response.ok) {
        const data = await response.json();
        setApartments(data);
      }
    } catch (error) {
      console.error('Erro ao carregar apartamentos:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(selectedApartment && { apartment: selectedApartment }),
        ...(selectedStatus && { status: selectedStatus }),
      });

      const response = await fetch(`/api/reservations?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReservations();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'COMPLETED':
        return 'Concluído';
      case 'IN_PROGRESS':
        return 'Em andamento';
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PARTIAL':
        return 'Parcial';
      case 'PENDING':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getSourceLabel = (source: string | null) => {
    switch (source) {
      case 'MANUAL':
        return 'Manual';
      case 'AIRBNB':
        return 'Airbnb';
      case 'BOOKING':
        return 'Booking.com';
      default:
        return source || 'Manual';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Reservas</CardTitle>
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome do cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <Select value={selectedApartment} onValueChange={setSelectedApartment}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Apartamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Apartamentos</SelectItem>
              {apartments.map((apartment) => (
                <SelectItem key={apartment.id} value={apartment.id}>
                  {apartment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
              <SelectItem value="COMPLETED">Concluído</SelectItem>
              <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma reserva encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search || selectedApartment || selectedStatus 
                ? 'Tente ajustar os filtros.' 
                : 'Comece criando uma nova reserva.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{reservation.client.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3" />
                          <span>{reservation.apartment.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                          </span>
                        </div>
                        <span>{reservation.guests} hóspede{reservation.guests > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Valor Total:</span>{' '}
                      {formatCurrency(reservation.totalAmount)}
                    </div>
                    <div>
                      <span className="font-medium">Pago:</span>{' '}
                      {formatCurrency(reservation.paidAmount)}
                    </div>
                    <div>
                      <span className="font-medium">Fonte:</span>{' '}
                      {getSourceLabel(reservation.source)}
                    </div>
                    {reservation.notes && (
                      <div>
                        <span className="font-medium">Obs:</span>{' '}
                        {reservation.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(reservation.status)}>
                      {getStatusLabel(reservation.status)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
                      {getPaymentStatusLabel(reservation.paymentStatus)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/reservations/${reservation.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/reservations/${reservation.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
