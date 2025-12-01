import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface SupplierFinanceProps {
  language: 'pt' | 'zh';
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
}

export function SupplierFinance({ language }: SupplierFinanceProps) {
  const [stats, setStats] = useState({
    weekTotal: 0,
    available: 0,
    toRelease: 0
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get week transactions
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: weekTransactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('supplier_id', user.id)
      .gte('created_at', weekAgo.toISOString());

    const weekTotal = weekTransactions?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;

    // Calculate available (completed orders not yet withdrawn)
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('amount_cny')
      .eq('supplier_id', user.id)
      .eq('status', 'completed');

    const completedTotal = completedOrders?.reduce((sum, o) => sum + parseFloat(o.amount_cny.toString()), 0) || 0;

    const { data: withdrawnTotal } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('supplier_id', user.id)
      .eq('status', 'approved');

    const withdrawn = withdrawnTotal?.reduce((sum, w) => sum + parseFloat(w.amount.toString()), 0) || 0;

    // Get to release (shipped not completed)
    const { data: shippedOrders } = await supabase
      .from('orders')
      .select('amount_cny')
      .eq('supplier_id', user.id)
      .eq('status', 'shipped');

    const toRelease = shippedOrders?.reduce((sum, o) => sum + parseFloat(o.amount_cny.toString()), 0) || 0;

    setStats({
      weekTotal,
      available: completedTotal - withdrawn,
      toRelease
    });

    // Load withdrawals
    const { data: withdrawalsData } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('supplier_id', user.id)
      .order('requested_at', { ascending: false });

    if (withdrawalsData) {
      setWithdrawals(withdrawalsData);
    }
  };

  const requestWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > stats.available) {
      toast.error(language === 'pt' ? 'Valor inválido' : '金额无效');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('withdrawals').insert({
      supplier_id: user!.id,
      amount,
      status: 'pending'
    });

    if (error) {
      toast.error('Erro / 错误');
    } else {
      toast.success(language === 'pt' ? 'Solicitação enviada!' : '申请已提交！');
      setWithdrawAmount('');
      loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: 'secondary' as const, pt: 'Pendente', zh: '待审核' },
      approved: { variant: 'default' as const, pt: 'Aprovado', zh: '已批准' },
      rejected: { variant: 'destructive' as const, pt: 'Rejeitado', zh: '已拒绝' }
    };
    
    const s = config[status as keyof typeof config] || config.pending;
    return <Badge variant={s.variant}>{language === 'pt' ? s.pt : s.zh}</Badge>;
  };

  const t = {
    pt: {
      title: 'Financeiro',
      weekEarnings: 'Recebido Esta Semana',
      available: 'Disponível para Saque',
      toRelease: 'Total a Liberar',
      requestWithdraw: 'Solicitar Saque',
      amount: 'Valor',
      history: 'Histórico',
      date: 'Data',
      value: 'Valor',
      status: 'Status',
      noHistory: 'Nenhum histórico'
    },
    zh: {
      title: '财务',
      weekEarnings: '本周收入',
      available: '可提现',
      toRelease: '待释放',
      requestWithdraw: '申请提现',
      amount: '金额',
      history: '历史记录',
      date: '日期',
      value: '金额',
      status: '状态',
      noHistory: '暂无记录'
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t[language].title}</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t[language].weekEarnings}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {stats.weekTotal.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t[language].available}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">¥ {stats.available.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t[language].toRelease}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {stats.toRelease.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {stats.available > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t[language].requestWithdraw}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>{t[language].amount}</Label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  max={stats.available}
                />
              </div>
              <Button onClick={requestWithdrawal} className="mt-auto">
                {t[language].requestWithdraw}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t[language].history}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">¥ {withdrawal.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(withdrawal.requested_at).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'zh-CN')}
                  </p>
                </div>
                {getStatusBadge(withdrawal.status)}
              </div>
            ))}
            {withdrawals.length === 0 && (
              <p className="text-center text-muted-foreground py-4">{t[language].noHistory}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}