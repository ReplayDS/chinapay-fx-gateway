import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function WaitingApproval() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [language, setLanguage] = useState<'pt' | 'zh'>('pt');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const checkStatus = async () => {
      const { data } = await supabase
        .from('supplier_details')
        .select('approval_status')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setStatus(data.approval_status);
        if (data.approval_status === 'approved') {
          navigate('/dashboard/supplier');
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('zh')) {
      setLanguage('zh');
    }

    return () => clearInterval(interval);
  }, [user, navigate]);

  const t = {
    pt: {
      title: 'Aguardando Aprovação',
      pending: 'Seu cadastro está sendo analisado',
      pendingDesc: 'Por favor, aguarde enquanto nossa equipe analisa suas informações. Você será notificado assim que sua conta for aprovada.',
      approved: 'Conta Aprovada!',
      approvedDesc: 'Sua conta foi aprovada com sucesso. Redirecionando...',
      rejected: 'Cadastro Rejeitado',
      rejectedDesc: 'Infelizmente seu cadastro foi rejeitado. Entre em contato com o suporte para mais informações.',
      logout: 'Sair'
    },
    zh: {
      title: '等待审核',
      pending: '您的注册正在审核中',
      pendingDesc: '请耐心等待，我们的团队正在审核您的信息。账户获批后您将收到通知。',
      approved: '账户已批准！',
      approvedDesc: '您的账户已成功获批。正在跳转...',
      rejected: '注册被拒绝',
      rejectedDesc: '很遗憾，您的注册被拒绝。请联系客服了解更多信息。',
      logout: '退出'
    }
  };

  const currentLang = t[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'pt' ? 'zh' : 'pt')}
            >
              {language === 'pt' ? '中文' : 'PT'}
            </Button>
          </div>
          <CardTitle className="flex items-center gap-2">
            {status === 'pending' && <Clock className="h-6 w-6 text-yellow-500" />}
            {status === 'approved' && <CheckCircle className="h-6 w-6 text-green-500" />}
            {status === 'rejected' && <XCircle className="h-6 w-6 text-red-500" />}
            {currentLang.title}
          </CardTitle>
          <CardDescription>
            {status === 'pending' && currentLang.pending}
            {status === 'approved' && currentLang.approved}
            {status === 'rejected' && currentLang.rejected}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {status === 'pending' && currentLang.pendingDesc}
            {status === 'approved' && currentLang.approvedDesc}
            {status === 'rejected' && currentLang.rejectedDesc}
          </p>
          <Button onClick={signOut} variant="outline" className="w-full">
            {currentLang.logout}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}