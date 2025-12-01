import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function ClientHome() {
  const [brlAmount, setBrlAmount] = useState('1000');
  const [cnyAmount, setCnyAmount] = useState('0');
  const [supplierId, setSupplierId] = useState('');
  const [feeRate, setFeeRate] = useState(5);

  useEffect(() => {
    const loadFeeRate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('client_details')
          .select('custom_fee_rate')
          .eq('user_id', user.id)
          .single();
        
        if (data) setFeeRate(data.custom_fee_rate);
      }
    };
    loadFeeRate();
  }, []);

  useEffect(() => {
    const brl = parseFloat(brlAmount) || 0;
    const EXCHANGE_RATE = 1.42;
    const fee = brl * (feeRate / 100);
    const total = (brl - fee) * EXCHANGE_RATE;
    setCnyAmount(total.toFixed(2));
  }, [brlAmount, feeRate]);

  const handleCreateOrder = async () => {
    if (!supplierId) {
      toast.error('Por favor, insira o ID do fornecedor');
      return;
    }

    try {
      const { data: supplier } = await supabase
        .from('supplier_details')
        .select('user_id, approval_status')
        .eq('supplier_id', supplierId)
        .single();

      if (!supplier || supplier.approval_status !== 'approved') {
        toast.error('Fornecedor não encontrado ou não aprovado');
        return;
      }

      const brl = parseFloat(brlAmount);
      const cny = parseFloat(cnyAmount);
      const fee = brl * (feeRate / 100);

      const { data: { user } } = await supabase.auth.getUser();
      
      const orderNumber = `ORD${Date.now()}`;
      
      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        client_id: user!.id,
        supplier_id: supplier.user_id,
        amount_brl: brl,
        amount_cny: cny,
        fee_rate: feeRate,
        fee_amount: fee,
        total_amount: brl,
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Pedido criado com sucesso!');
      setBrlAmount('1000');
      setSupplierId('');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar pedido');
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Conversão</CardTitle>
          <CardDescription>Calcule quanto você receberá em Yuan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brl">Valor em BRL</Label>
            <Input
              id="brl"
              type="number"
              value={brlAmount}
              onChange={(e) => setBrlAmount(e.target.value)}
              placeholder="1000.00"
            />
          </div>

          <div className="flex justify-center">
            <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
          </div>

          <div>
            <Label htmlFor="cny">Valor em CNY (após taxa de {feeRate}%)</Label>
            <Input
              id="cny"
              type="number"
              value={cnyAmount}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de câmbio</span>
              <span className="font-semibold">1 BRL = 1.42 CNY</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de serviço ({feeRate}%)</span>
              <span className="font-semibold text-destructive">R$ {(parseFloat(brlAmount || '0') * (feeRate / 100)).toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="supplier">ID do Fornecedor</Label>
            <Input
              id="supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <Button onClick={handleCreateOrder} className="w-full">
            Iniciar Transferência
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
          <CardDescription>Tutorial passo a passo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Insira o valor em BRL</h4>
            <p className="text-sm text-muted-foreground">
              Digite quanto você deseja enviar em Reais
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Obtenha o ID do fornecedor</h4>
            <p className="text-sm text-muted-foreground">
              Peça ao fornecedor o ID único de 6 dígitos dele
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. Inicie a transferência</h4>
            <p className="text-sm text-muted-foreground">
              Clique em "Iniciar Transferência" para criar o pedido
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">4. Aguarde o envio</h4>
            <p className="text-sm text-muted-foreground">
              O fornecedor anexará fotos e código de rastreio quando enviar
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">5. Confirme o recebimento</h4>
            <p className="text-sm text-muted-foreground">
              Quando receber, o valor será liberado para o fornecedor
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}