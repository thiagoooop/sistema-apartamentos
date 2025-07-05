
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Building2,
  Calendar,
  User
} from 'lucide-react';
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
  };
  apartment: {
    id: string;
    name: string;
  };
}

interface Apartment {
  id: string;
  name: string;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedApartment, setSelectedApartment] = useState('all');
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApartments();
    fetchReservations();
  }, [currentDate, selectedApartment]);

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
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const params = new URLSearchParams({
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString(),
        ...(selectedApartment !== 'all' && { apartment: selectedApartment }),
      });

      const response = await fetch(`/api/calendar?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Ajustar para começar na segunda-feira
    startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      
      return date >= checkIn && date <= checkOut;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedApartment} onValueChange={setSelectedApartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar apartamento" />
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
            <Link href="/reservations/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Reserva
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="calendar-grid">
            {/* Header dos dias da semana */}
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
            
            {/* Dias do mês */}
            {days.map((date, index) => {
              const dayReservations = getReservationsForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDay = isToday(date);
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${
                    !isCurrentMonthDay ? 'opacity-30' : ''
                  } ${isTodayDay ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isTodayDay ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </span>
                    {dayReservations.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayReservations.length}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayReservations.slice(0, 3).map((reservation) => (
                      <div
                        key={reservation.id}
                        className={`calendar-event ${getStatusColor(reservation.status)}`}
                        title={`${reservation.client.name} - ${reservation.apartment.name}`}
                      >
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span className="truncate">{reservation.client.name}</span>
                        </div>
                        {selectedApartment === 'all' && (
                          <div className="flex items-center space-x-1 text-xs opacity-75">
                            <Building2 className="h-2 w-2" />
                            <span className="truncate">{reservation.apartment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {dayReservations.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayReservations.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Legenda */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-600">Confirmado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-sm text-gray-600">Em andamento</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-sm text-gray-600">Concluído</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-600">Cancelado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
