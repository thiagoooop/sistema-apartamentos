
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Mail, Phone, Calendar, MapPin, Eye } from 'lucide-react';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  birthDate: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  totalStays: number;
  createdAt: string;
}

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchClients();
  }, [search, currentPage]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/clients?${params}`);
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchClients();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return '-';
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const formatCpf = (cpf: string | null) => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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
        <CardTitle>Lista de Clientes</CardTitle>
        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <Button type="submit" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum cliente encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Tente ajustar sua busca.' : 'Comece adicionando um novo cliente.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{formatPhone(client.phone)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">CPF:</span> {formatCpf(client.cpf)}
                    </div>
                    {client.birthDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(client.birthDate)}</span>
                      </div>
                    )}
                    {client.city && client.state && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{client.city}, {client.state}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Estadias:</span> {client.totalStays}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/clients/${client.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </Link>
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
