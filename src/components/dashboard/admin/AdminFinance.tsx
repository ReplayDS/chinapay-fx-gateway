import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
  supplier_id: string;
  profiles: { full_name: string };
  supplier_details: { alipay_qr_code_url: string };
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  created_at: string;
  profiles: { full_name: string };
}

export function AdminFinance() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedQrCode, setSelectedQrCode] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load withdrawals
    const { data: withdrawalsData } = await supabase
      .from('withdrawals')
      .select(`
        *,
        profiles!withdrawals_supplier_id_fkey (full_name),
        supplier_details!supplier_details_user_id_fkey (alipay_qr_code_url)
      `)
      .order('requested_at', { ascending: false });

    if (withdrawalsData) {
      setWithdrawals(withdrawalsData as any);
    }

    // Load transactions
    const { data: transactionsData } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles!transactions_supplier_id_fkey (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (transactionsData) {
      setTransactions(transactionsData as any);
    }
  };

  const approveWithdrawal = async (withdrawalId: string, qrCodeUrl: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('withdrawals')
      .update({
        status: 'approved',
        processed_at: new Date().toISOString(),
        processed_by: user!.id
      })
      .eq('id', withdrawalId);

    if (error) {
      toast.error('Erro ao aprovar');
    } else {
      setSelectedQrCode(qrCodeUrl);
      toast.success('Saque aprovado!');
      loadData();
    }
  };

  const rejectWithdrawal = async (withdrawalId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('withdrawals')
      .update({
        status: 'rejected',
        processed_at: new Date().toISOString(),
        processed_by: user!.id
      })
      .eq('id', withdrawalId);

    if (error) {
      toast.error('Erro ao rejeitar');
    } else {
      toast.success('Saque rejeitado');
      loadData();
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Solicitações de Saque</h2>
        <div className="grid gap-4">
          {withdrawals.filter(w => w.status === 'pending').map((withdrawal) => (
            <Card key={withdrawal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{withdrawal.profiles?.full_name}</CardTitle>
                    <CardDescription>
                      {new Date(withdrawal.requested_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-2xl font-bold">¥ {withdrawal.amount.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveWithdrawal(withdrawal.id, withdrawal.supplier_details?.alipay_qr_code_url)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectWithdrawal(withdrawal.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Recusar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedQrCode} onOpenChange={(open) => !open && setSelectedQrCode('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Alipay</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img src={selectedQrCode} alt="QR Code" className="max-w-sm rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <h2 className="text-2xl font-bold mb-4">Histórico de Transações</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.profiles?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString('pt-BR')} • {transaction.type}
                    </p>
                  </div>
                  <p className="font-bold">¥ {transaction.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}