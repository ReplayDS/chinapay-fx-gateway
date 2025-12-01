import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  amount_cny: number;
  status: string;
  tracking_code: string | null;
  created_at: string;
  profiles: { full_name: string };
}

interface SupplierOrdersProps {
  language: 'pt' | 'zh';
}

export function SupplierOrders({ language }: SupplierOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [disputeReason, setDisputeReason] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_client_id_fkey (full_name)
      `)
      .eq('supplier_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
  };

  const uploadImagesAndShip = async (orderId: string) => {
    if (!trackingCode.trim() || images.length === 0) {
      toast.error(language === 'pt' ? 'Adicione código e fotos' : '请添加追踪码和照片');
      return;
    }

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${orderId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('order-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Save image references
      const imageInserts = imageUrls.map(url => ({
        order_id: orderId,
        image_url: url
      }));

      await supabase.from('order_images').insert(imageInserts);

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'shipped',
          tracking_code: trackingCode,
          shipped_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      toast.success(language === 'pt' ? 'Pedido enviado!' : '订单已发货！');
      setSelectedOrder(null);
      setTrackingCode('');
      setImages([]);
      loadOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openDispute = async (orderId: string) => {
    if (!disputeReason.trim()) {
      toast.error(language === 'pt' ? 'Descreva o motivo' : '请描述原因');
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
      toast.error('Erro / 错误');
    } else {
      toast.success(language === 'pt' ? 'Disputa aberta!' : '争议已开启！');
      setDisputeReason('');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: 'secondary' as const, pt: 'Pendente', zh: '待发货' },
      shipped: { variant: 'default' as const, pt: 'Enviado', zh: '已发货' },
      completed: { variant: 'outline' as const, pt: 'Finalizado', zh: '已完成' }
    };
    
    const s = config[status as keyof typeof config] || config.pending;
    return <Badge variant={s.variant}>{language === 'pt' ? s.pt : s.zh}</Badge>;
  };

  const t = {
    pt: {
      title: 'Pedidos',
      client: 'Cliente',
      value: 'Valor',
      status: 'Status',
      attachPhotos: 'Anexar Fotos e Rastreio',
      openDispute: 'Abrir Disputa',
      tracking: 'Código de Rastreio',
      photos: 'Fotos do Envio',
      send: 'Enviar',
      disputeReason: 'Motivo da Disputa',
      noOrders: 'Nenhum pedido'
    },
    zh: {
      title: '订单',
      client: '客户',
      value: '金额',
      status: '状态',
      attachPhotos: '上传照片和追踪码',
      openDispute: '开启争议',
      tracking: '追踪码',
      photos: '发货照片',
      send: '发送',
      disputeReason: '争议原因',
      noOrders: '暂无订单'
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t[language].title}</h2>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">#{order.order_number}</CardTitle>
                  <CardDescription>
                    {new Date(order.created_at).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'zh-CN')}
                  </CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t[language].client}</p>
                    <p className="font-semibold">{order.profiles?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t[language].value}</p>
                    <p className="font-semibold">¥ {order.amount_cny.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t[language].status}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Dialog open={selectedOrder === order.id} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {t[language].attachPhotos}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t[language].attachPhotos}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>{t[language].tracking}</Label>
                            <Input
                              value={trackingCode}
                              onChange={(e) => setTrackingCode(e.target.value)}
                              placeholder="XX123456789CN"
                            />
                          </div>
                          <div>
                            <Label>{t[language].photos}</Label>
                            <Input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => setImages(Array.from(e.target.files || []))}
                            />
                          </div>
                          <Button
                            onClick={() => uploadImagesAndShip(order.id)}
                            className="w-full"
                          >
                            {t[language].send}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {t[language].openDispute}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t[language].openDispute}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>{t[language].disputeReason}</Label>
                          <Textarea
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={() => openDispute(order.id)}
                          className="w-full"
                        >
                          {t[language].send}
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
              {t[language].noOrders}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}