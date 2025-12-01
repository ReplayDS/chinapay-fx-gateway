import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SupplierSidebar } from '@/components/dashboard/SupplierSidebar';
import { SupplierHome } from '@/components/dashboard/supplier/SupplierHome';
import { SupplierOrders } from '@/components/dashboard/supplier/SupplierOrders';
import { SupplierFinance } from '@/components/dashboard/supplier/SupplierFinance';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type View = 'home' | 'orders' | 'finance';

export default function SupplierDashboard() {
  const { user, userRole, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [language, setLanguage] = useState<'pt' | 'zh'>('zh');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || userRole !== 'supplier')) {
      navigate('/auth');
    }

    // Auto-detect Chinese
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('zh')) {
      setLanguage('zh');
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!user) return null;

  const t = {
    pt: { dashboard: 'Dashboard do Fornecedor', logout: 'Sair' },
    zh: { dashboard: '供应商仪表板', logout: '退出' }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SupplierSidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          language={language}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">{t[language].dashboard}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'pt' ? 'zh' : 'pt')}
              >
                {language === 'pt' ? '中文' : 'PT'}
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {t[language].logout}
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/30">
            {currentView === 'home' && <SupplierHome language={language} />}
            {currentView === 'orders' && <SupplierOrders language={language} />}
            {currentView === 'finance' && <SupplierFinance language={language} />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}