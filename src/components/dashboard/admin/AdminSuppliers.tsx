import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Image, Barcode, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Supplier {
  id: string;
  user_id: string;
  supplier_id: string;
  approval_status: string;
  alipay_qr_code_url: string;
  created_at: string;
  profiles: { full_name: string; email: string; phone: string };
}

export function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const { data, error } = await supabase
      .from('supplier_details')
      .select(`
        *,
        profiles (full_name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSuppliers(data as any);
    }
  };

  const approveSupplier = async (supplierId: string, userId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('supplier_details')
      .update({
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user!.id
      })
      .eq('id', supplierId);

    if (error) {
      toast.error('Erro ao aprovar');
    } else {
      toast.success('Fornecedor aprovado!');
      loadSuppliers();
    }
  };

  const rejectSupplier = async (supplierId: string) => {
    const { error } = await supabase
      .from('supplier_details')
      .update({ approval_status: 'rejected' })
      .eq('id', supplierId);

    if (error) {
      toast.error('Erro ao rejeitar');
    } else {
      toast.success('Fornecedor rejeitado');
      loadSuppliers();
    }
  };

  const loadSupplierOrders = async (userId: string) => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_images (image_url)
      `)
      .eq('supplier_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: 'secondary' as const, label: 'Pendente' },
      approved: { variant: 'default' as const, label: 'Aprovado' },
      rejected: { variant: 'destructive' as const, label: 'Rejeitado' }
    };
    
    const s = config[status as keyof typeof config] || config.pending;
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Fornecedores</h2>

      <div className="grid gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{supplier.profiles?.full_name}</CardTitle>
                  <CardDescription>
                    ID: {supplier.supplier_id} • {supplier.profiles?.email}
                  </CardDescription>
                </div>
                {getStatusBadge(supplier.approval_status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <p><span className="text-muted-foreground">Telefone:</span> {supplier.profiles?.phone}</p>
                  <p><span className="text-muted-foreground">Cadastrado em:</span> {new Date(supplier.created_at).toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {supplier.approval_status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => approveSupplier(supplier.id, supplier.user_id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectSupplier(supplier.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          loadSupplierOrders(supplier.user_id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Pedidos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Pedidos do Fornecedor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id}>
                            <CardHeader>
                              <CardTitle className="text-base">#{order.order_number}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <p className="text-sm"><span className="text-muted-foreground">Status:</span> {order.status}</p>
                                <p className="text-sm"><span className="text-muted-foreground">Valor:</span> ¥ {order.amount_cny}</p>
                                {order.tracking_code && (
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        navigator.clipboard.writeText(order.tracking_code);
                                        toast.success('Código copiado!');
                                      }}>
                                        <Barcode className="h-4 w-4 mr-2" />
                                        Código: {order.tracking_code}
                                      </a>
                                    </Button>
                                  </div>
                                )}
                                {order.order_images?.length > 0 && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <Image className="h-4 w-4 mr-2" />
                                        Ver Fotos ({order.order_images.length})
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <div className="grid grid-cols-2 gap-4">
                                        {order.order_images.map((img: any, idx: number) => (
                                          <img
                                            key={idx}
                                            src={img.image_url}
                                            alt={`Foto ${idx + 1}`}
                                            className="w-full rounded"
                                          />
                                        ))}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Ban className="h-4 w-4 mr-2" />
                        Bloquear
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bloquear Fornecedor?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação bloqueará o fornecedor. Tem certeza?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => rejectSupplier(supplier.id)}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}