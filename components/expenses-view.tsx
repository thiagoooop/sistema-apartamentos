
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Receipt, Building2, TrendingUp, Calendar, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Expense {
  id: string;
  description: string;
  amount: number;
  expenseDate: string;
  receiptUrl?: string;
  apartment?: {
    name: string;
  };
  category?: {
    name: string;
    color: string;
  };
  createdAt: string;
}

interface Apartment {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export function ExpensesView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    receiptUrl: '',
    apartmentId: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchExpenses();
    fetchApartments();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(Array.isArray(data) ? data : (data.expenses || []));
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      if (!formData.description || !formData.amount || !formData.expenseDate) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          apartmentId: formData.apartmentId || null,
          categoryId: formData.categoryId || null,
        }),
      });

      if (response.ok) {
        toast.success('Gasto registrado com sucesso!');
        setIsModalOpen(false);
        setFormData({
          description: '',
          amount: 0,
          expenseDate: new Date().toISOString().split('T')[0],
          receiptUrl: '',
          apartmentId: '',
          categoryId: '',
        });
        fetchExpenses();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao registrar gasto');
      }
    } catch (error) {
      console.error('Erro ao registrar gasto:', error);
      toast.error('Erro interno do servidor');
    } finally {
      setIsCreating(false);
    }
  };

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const totalExpenses = safeExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const thisMonthExpenses = safeExpenses.filter(expense => {
    const expenseDate = new Date(expense.expenseDate);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

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

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {totalExpenses.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Total de Gastos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  R$ {thisMonthTotal.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Este Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {safeExpenses.length}
                </div>
                <p className="text-sm text-gray-600">Total de Registros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Lista de Gastos</span>
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Novo Gasto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Ex: Limpeza, Manutenção..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Valor (R$) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="expenseDate">Data *</Label>
                  <Input
                    id="expenseDate"
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => handleInputChange('expenseDate', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="apartmentId">Apartamento</Label>
                  <Select
                    value={formData.apartmentId}
                    onValueChange={(value) => handleInputChange('apartmentId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Geral</SelectItem>
                      {apartments.map((apartment) => (
                        <SelectItem key={apartment.id} value={apartment.id}>
                          {apartment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="categoryId">Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Sem categoria</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="receiptUrl">URL do Comprovante</Label>
                  <Input
                    id="receiptUrl"
                    value={formData.receiptUrl}
                    onChange={(e) => handleInputChange('receiptUrl', e.target.value)}
                    placeholder="http://..."
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
                        Registrar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {safeExpenses.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum gasto registrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece registrando seu primeiro gasto.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Primeiro Gasto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Apartamento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">{expense.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        R$ {expense.amount?.toFixed(2) || '0.00'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(expense.expenseDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {expense.apartment ? (
                          <>
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span>{expense.apartment.name}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Geral</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {expense.category ? (
                        <Badge 
                          variant="outline" 
                          style={{ backgroundColor: expense.category.color + '20', color: expense.category.color }}
                        >
                          {expense.category.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Editar
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
    </div>
  );
}
