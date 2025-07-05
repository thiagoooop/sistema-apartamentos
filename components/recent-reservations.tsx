
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Eye } from 'lucide-react';
import Link from 'next/link';

interface Reservation {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  client: {
    name: string;
    email: string;
  };
  apartment: {
    name: string;
  };
}

export function RecentReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Garantir que reservations seja sempre um array
  const safeReservations = Array.isArray(reservations) ? reservations : [];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations?limit=5');
        if (response.ok) {
          const data = await response.json();
          // Garantir que reservations é sempre um array
          setReservations(Array.isArray(data) ? data : (data.reservations || []));
        }
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        // Garantir que reservations seja sempre um array em caso de erro
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="loading-spinner"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reservas Recentes</CardTitle>
        <Link href="/reservations">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Ver Todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {safeReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma reserva encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando uma nova reserva.
              </p>
            </div>
          ) : (
            safeReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {reservation.client.name}
                    </span>
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {reservation.apartment.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                    </span>
                    <span>
                      {reservation.guests} hóspede{reservation.guests > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(reservation.totalAmount)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status === 'CONFIRMED' ? 'Confirmado' : 
                     reservation.status === 'CANCELLED' ? 'Cancelado' : 
                     reservation.status === 'COMPLETED' ? 'Concluído' : 
                     reservation.status}
                  </Badge>
                  <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
                    {reservation.paymentStatus === 'PAID' ? 'Pago' : 
                     reservation.paymentStatus === 'PARTIAL' ? 'Parcial' : 
                     reservation.paymentStatus === 'PENDING' ? 'Pendente' : 
                     reservation.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
