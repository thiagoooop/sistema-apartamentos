
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export function AddClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar cliente');
      }

      toast.success('Cliente criado com sucesso!');
      router.push('/clients');
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Erro ao criar cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nome do cliente"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="00000-000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Cidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Estado"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Endereço completo"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/clients')}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Cliente
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
