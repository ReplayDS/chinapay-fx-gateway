import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Package, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SupplierHomeProps {
  language: 'pt' | 'zh';
}

export function SupplierHome({ language }: SupplierHomeProps) {
  const [supplierId, setSupplierId] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    toRelease: 0,
    todayEarnings: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get supplier ID
    const { data: supplierData } = await supabase
      .from('supplier_details')
      .select('supplier_id')
      .eq('user_id', user.id)
      .single();

    if (supplierData) {
      setSupplierId(supplierData.supplier_id);
    }

    // Get pending orders count
    const { data: pendingOrders } = await supabase
      .from('orders')
      .select('id')
      .eq('supplier_id', user.id)
      .eq('status', 'pending');

    // Get total to release (shipped but not completed)
    const { data: toReleaseOrders } = await supabase
      .from('orders')
      .select('amount_cny')
      .eq('supplier_id', user.id)
      .eq('status', 'shipped');

    const toRelease = toReleaseOrders?.reduce((sum, order) => sum + parseFloat(order.amount_cny.toString()), 0) || 0;

    // Get today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todayTransactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('supplier_id', user.id)
      .gte('created_at', today.toISOString());

    const todayEarnings = todayTransactions?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;

    setStats({
      pending: pendingOrders?.length || 0,
      toRelease: toRelease,
      todayEarnings: todayEarnings
    });
  };

  const copyId = () => {
    navigator.clipboard.writeText(supplierId);
    toast.success(language === 'pt' ? 'ID copiado!' : 'ID已复制！');
  };

  const t = {
    pt: {
      pendingShip: 'Pendente de Envio',
      toRelease: 'Total a Liberar',
      receivedToday: 'Recebido Hoje',
      myId: 'MEU ID',
      copy: 'Copiar'
    },
    zh: {
      pendingShip: '待发货',
      toRelease: '待释放总额',
      receivedToday: '今日收入',
      myId: '我的ID',
      copy: '复制'
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t[language].pendingShip}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t[language].toRelease}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {stats.toRelease.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t[language].receivedToday}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {stats.todayEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t[language].myId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold font-mono">{supplierId}</div>
              <Button size="sm" variant="ghost" onClick={copyId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}