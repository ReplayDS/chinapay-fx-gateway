import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Package, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  amount_brl: number;
  amount_cny: number;
  status: string;
  tracking_code: string | null;
  created_at: string;
}

export function ClientOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [disputeReason, setDisputeReason] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderImages, setOrderImages] = useState<{[key: string]: string[]}>({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
      
      // Load images for each order
      data.forEach(async (order) => {
        const { data: images } = await supabase
          .from('order_images')
          .select('image_url')
          .eq('order_id', order.id);
        
        if (images) {
          setOrderImages(prev => ({
            ...prev,
            [order.id]: images.map(img => img.image_url)
          }));
        }
      });
    }
  };

  const openDispute = async (orderId: string) => {
    if (!disputeReason.trim()) {
      toast.error('Por favor, descreva o motivo da disputa');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('disputes').insert({
      order_id: orderId,
      opened_by: user!.id,
      reason: disputeReason,
      status: 'open'
    });

    if (error) {
      toast.error('Erro ao abrir disputa');
    } else {
      toast.success('Disputa aberta com sucesso!');
      setDisputeReason('');
      setSelectedOrder(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: {[key: string]: any} = {
      pending: { variant: 'secondary', label: 'Pendente' },
      shipped: { variant: 'default', label: 'Enviado' },
      completed: { variant: 'outline', label: 'Finalizado' }
    };
    
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meus Pedidos</h2>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">#{order.order_number}</CardTitle>
                  <CardDescription>
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor em BRL</p>
                    <p className="font-semibold">R$ {order.amount_brl.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor em CNY</p>
                    <p className="font-semibold">¥ {order.amount_cny.toFixed(2)}</p>
                  </div>
                </div>

                {order.tracking_code && (
                  <div>
                    <p className="text-sm text-muted-foreground">Código de Rastreio</p>
                    <p className="font-mono text-sm">{order.tracking_code}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {orderImages[order.id] && orderImages[order.id].length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Fotos ({orderImages[order.id].length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Fotos do Pedido</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          {orderImages[order.id].map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Foto ${idx + 1}`}
                              className="w-full rounded-lg"
                            />
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {order.tracking_code && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://www.17track.net/pt/track?nums=${order.tracking_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Rastrear
                      </a>
                    </Button>
                  )}

                  <Dialog open={selectedOrder === order.id} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Abrir Disputa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Abrir Disputa</DialogTitle>
                        <DialogDescription>
                          Descreva o motivo da disputa para este pedido
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="reason">Motivo</Label>
                          <Textarea
                            id="reason"
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            placeholder="Descreva o problema..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={() => openDispute(order.id)}
                          className="w-full"
                        >
                          Enviar Disputa
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum pedido encontrado
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}