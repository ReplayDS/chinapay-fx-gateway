import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Package, TrendingUp } from 'lucide-react';

export function AdminHome() {
  const [stats, setStats] = useState({
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    openOrders: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Today's transactions
    const { data: todayData } = await supabase
      .from('transactions')
      .select('amount')
      .gte('created_at', today.toISOString());

    const todayTotal = todayData?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;

    // Week's transactions
    const { data: weekData } = await supabase
      .from('transactions')
      .select('amount')
      .gte('created_at', weekAgo.toISOString());

    const weekTotal = weekData?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;

    // Month's transactions
    const { data: monthData } = await supabase
      .from('transactions')
      .select('amount')
      .gte('created_at', monthAgo.toISOString());

    const monthTotal = monthData?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;

    // Open orders
    const { data: openOrders } = await supabase
      .from('orders')
      .select('id')
      .in('status', ['pending', 'shipped']);

    setStats({
      todayTotal,
      weekTotal,
      monthTotal,
      openOrders: openOrders?.length || 0
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visão Geral</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {stats.todayTotal.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Semana</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {stats.weekTotal.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {stats.monthTotal.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Abertos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openOrders}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}