import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'client' | 'supplier'>('client');
  const navigate = useNavigate();

  // Client fields
  const [clientData, setClientData] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    email: '',
    password: ''
  });

  // Supplier fields
  const [supplierData, setSupplierData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    qrCodeFile: null as File | null
  });

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: clientData.email,
        password: clientData.password
      });

      if (error) throw error;

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleData?.role === 'client') {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard/client');
      } else if (roleData?.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        throw new Error('Tipo de usuário inválido');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: clientData.email,
        password: clientData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/client`
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: clientData.fullName,
          email: clientData.email,
          phone: clientData.phone,
          user_type: 'client'
        });

      if (profileError) throw profileError;

      // Create role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'client'
        });

      if (roleError) throw roleError;

      // Create client details
      const { error: detailsError } = await supabase
        .from('client_details')
        .insert({
          user_id: authData.user.id,
          cpf: clientData.cpf
        });

      if (detailsError) throw detailsError;

      toast.success('Cadastro realizado com sucesso!');
      navigate('/dashboard/client');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: supplierData.email,
        password: supplierData.password
      });

      if (error) throw error;

      const { data: supplierDetails } = await supabase
        .from('supplier_details')
        .select('approval_status')
        .eq('user_id', data.user.id)
        .single();

      if (supplierDetails?.approval_status === 'pending') {
        toast.info('Sua conta está aguardando aprovação');
        navigate('/waiting-approval');
      } else if (supplierDetails?.approval_status === 'approved') {
        toast.success('登录成功！/ Login realizado!');
        navigate('/dashboard/supplier');
      } else {
        toast.error('Conta rejeitada. Entre em contato com o suporte.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierData.qrCodeFile) {
      toast.error('Por favor, anexe o QR Code do Alipay');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: supplierData.email,
        password: supplierData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/waiting-approval`
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // Upload QR Code
      const fileExt = supplierData.qrCodeFile.name.split('.').pop();
      const fileName = `${authData.user.id}/qrcode.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('alipay-qrcodes')
        .upload(fileName, supplierData.qrCodeFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('alipay-qrcodes')
        .getPublicUrl(fileName);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: supplierData.fullName,
          email: supplierData.email,
          phone: supplierData.phone,
          user_type: 'supplier'
        });

      if (profileError) throw profileError;

      // Create role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'supplier'
        });

      if (roleError) throw roleError;

      // Get unique supplier ID
      const { data: supplierIdData, error: supplierIdError } = await supabase
        .rpc('generate_supplier_id');

      if (supplierIdError) throw supplierIdError;

      // Create supplier details
      const { error: detailsError } = await supabase
        .from('supplier_details')
        .insert({
          user_id: authData.user.id,
          supplier_id: supplierIdData,
          alipay_qr_code_url: publicUrl,
          contact_info: supplierData.phone,
          approval_status: 'pending'
        });

      if (detailsError) throw detailsError;

      toast.success('Cadastro realizado! Aguardando aprovação.');
      navigate('/waiting-approval');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLogin ? 'Login' : 'Cadastro'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'client' | 'supplier')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="client">Cliente</TabsTrigger>
              <TabsTrigger value="supplier">Fornecedor / 供应商</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <form onSubmit={isLogin ? handleClientLogin : handleClientRegister} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input
                        id="fullName"
                        value={clientData.fullName}
                        onChange={(e) => setClientData({ ...clientData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={clientData.cpf}
                        onChange={(e) => setClientData({ ...clientData, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Número</Label>
                      <Input
                        id="phone"
                        value={clientData.phone}
                        onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={clientData.password}
                    onChange={(e) => setClientData({ ...clientData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="supplier">
              <form onSubmit={isLogin ? handleSupplierLogin : handleSupplierRegister} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="supplierName">Nome / 姓名</Label>
                      <Input
                        id="supplierName"
                        value={supplierData.fullName}
                        onChange={(e) => setSupplierData({ ...supplierData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierPhone">Número / 电话号码</Label>
                      <Input
                        id="supplierPhone"
                        value={supplierData.phone}
                        onChange={(e) => setSupplierData({ ...supplierData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="supplierEmail">Email / 电子邮件</Label>
                  <Input
                    id="supplierEmail"
                    type="email"
                    value={supplierData.email}
                    onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supplierPassword">Senha / 密码</Label>
                  <Input
                    id="supplierPassword"
                    type="password"
                    value={supplierData.password}
                    onChange={(e) => setSupplierData({ ...supplierData, password: e.target.value })}
                    required
                  />
                </div>
                {!isLogin && (
                  <div>
                    <Label htmlFor="qrcode">QR Code Alipay / 支付宝二维码</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="qrcode"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSupplierData({ ...supplierData, qrCodeFile: e.target.files?.[0] || null })}
                        required
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? 'Entrar / 登录' : 'Cadastrar / 注册'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}