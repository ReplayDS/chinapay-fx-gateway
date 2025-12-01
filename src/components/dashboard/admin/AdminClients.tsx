import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  user_id: string;
  cpf: string;
  custom_fee_rate: number;
  profiles: { full_name: string; email: string; phone: string };
  orders: { id: string }[];
}

export function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newFeeRate, setNewFeeRate] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data, error } = await supabase
      .from('client_details')
      .select(`
        *,
        profiles (full_name, email, phone),
        orders:orders!orders_client_id_fkey (id)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setClients(data as any);
    }
  };

  const updateFeeRate = async () => {
    if (!selectedClient) return;

    const feeRate = parseFloat(newFeeRate);
    if (isNaN(feeRate) || feeRate < 0 || feeRate > 100) {
      toast.error('Taxa inválida (0-100)');
      return;
    }

    const { error } = await supabase
      .from('client_details')
      .update({ custom_fee_rate: feeRate })
      .eq('id', selectedClient.id);

    if (error) {
      toast.error('Erro ao atualizar taxa');
    } else {
      toast.success('Taxa atualizada!');
      setSelectedClient(null);
      setNewFeeRate('');
      loadClients();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Clientes</h2>

      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{client.profiles?.full_name}</CardTitle>
                  <CardDescription>{client.profiles?.email}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Taxa atual</p>
                  <p className="text-2xl font-bold">{client.custom_fee_rate}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-medium">{client.profiles?.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total de Pedidos</p>
                    <p className="font-medium">{client.orders?.length || 0}</p>
                  </div>
                </div>

                <Dialog
                  open={selectedClient?.id === client.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setSelectedClient(null);
                      setNewFeeRate('');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedClient(client);
                        setNewFeeRate(client.custom_fee_rate.toString());
                      }}
                    >
                      <Percent className="h-4 w-4 mr-2" />
                      Alterar Taxa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Taxa do Cliente</DialogTitle>
                      <DialogDescription>
                        Cliente: {client.profiles?.full_name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="feeRate">Nova Taxa (%)</Label>
                        <Input
                          id="feeRate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={newFeeRate}
                          onChange={(e) => setNewFeeRate(e.target.value)}
                          placeholder="5.0"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Taxa padrão: 5%
                        </p>
                      </div>
                      <Button onClick={updateFeeRate} className="w-full">
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}

        {clients.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum cliente cadastrado
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}