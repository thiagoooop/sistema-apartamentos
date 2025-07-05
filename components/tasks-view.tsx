
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, CheckSquare, Clock, AlertTriangle, Check, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  completedAt?: string;
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

const statusConfig = {
  PENDING: { label: 'Pendente', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { label: 'Em Andamento', icon: AlertTriangle, color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Concluída', icon: Check, color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelada', icon: X, color: 'bg-red-100 text-red-800' }
};

const priorityConfig = {
  LOW: { label: 'Baixa', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Média', color: 'bg-blue-100 text-blue-800' },
  HIGH: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
};

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING' as const,
    priority: 'MEDIUM' as const,
    dueDate: '',
    apartmentId: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchApartments();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : (data.tasks || []));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
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
      if (!formData.title.trim()) {
        toast.error('Por favor, preencha o título da tarefa');
        return;
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Tarefa criada com sucesso!');
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          status: 'PENDING' as const,
          priority: 'MEDIUM' as const,
          dueDate: '',
          apartmentId: '',
          categoryId: '',
        });
        fetchTasks();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao criar tarefa');
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
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

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {safeTasks.filter(t => t.status === 'PENDING').length}
            </div>
            <p className="text-sm text-gray-600">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {safeTasks.filter(t => t.status === 'IN_PROGRESS').length}
            </div>
            <p className="text-sm text-gray-600">Em Andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {safeTasks.filter(t => t.status === 'COMPLETED').length}
            </div>
            <p className="text-sm text-gray-600">Concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {safeTasks.filter(t => t.priority === 'URGENT').length}
            </div>
            <p className="text-sm text-gray-600">Urgentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5" />
            <span>Lista de Tarefas</span>
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva a tarefa (opcional)"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                        <SelectItem value="COMPLETED">Concluída</SelectItem>
                        <SelectItem value="CANCELLED">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Baixa</SelectItem>
                        <SelectItem value="MEDIUM">Média</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Data de Vencimento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="apartmentId">Apartamento</Label>
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
                  <Label htmlFor="categoryId">Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        Criar Tarefa
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {safeTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando sua primeira tarefa.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Tarefa
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarefa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Apartamento</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeTasks.map((task) => {
                  const statusInfo = statusConfig[task.status];
                  const priorityInfo = priorityConfig[task.priority];
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityInfo.color}>
                          {priorityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.apartment?.name || '-'}
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })
                        ) : (
                          '-'
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
