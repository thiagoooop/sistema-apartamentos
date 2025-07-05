
export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface Apartment {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  maxGuests: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  birthDate: Date | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  totalStays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID';
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'IN_PROGRESS';
  notes: string | null;
  source: string | null;
  apartmentId: string;
  clientId: string;
  apartment: Apartment;
  client: Client;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pricing {
  id: string;
  date: Date;
  price: number;
  apartmentId: string;
  apartment: Apartment;
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface CreateClientForm {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface CreateReservationForm {
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  paidAmount?: number;
  paymentStatus?: 'PENDING' | 'PARTIAL' | 'PAID';
  status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'IN_PROGRESS';
  notes?: string;
  source?: string;
  apartmentId: string;
  clientId: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard types
export interface DashboardStats {
  monthlyRevenue: number;
  occupancyRate: number;
  upcomingCheckins: number;
  totalClients: number;
  availableApartments: number;
}

// Calendar types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  reservation: Reservation;
}

// Report types
export interface ReportData {
  revenue: {
    month: string;
    apartment1: number;
    apartment2: number;
    total: number;
  }[];
  occupancy: {
    month: string;
    apartment1: number;
    apartment2: number;
    average: number;
  }[];
  topClients: {
    name: string;
    totalStays: number;
    totalAmount: number;
  }[];
  summary: {
    totalRevenue: number;
    averageOccupancy: number;
    totalReservations: number;
    topClient: string;
  };
}
