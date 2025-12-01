import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/dashboard/ClientSidebar';
import { ClientHome } from '@/components/dashboard/client/ClientHome';
import { ClientOrders } from '@/components/dashboard/client/ClientOrders';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type View = 'home' | 'orders';

export default function ClientDashboard() {
  const { user, userRole, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || userRole !== 'client')) {
      navigate('/auth');
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Dashboard do Cliente</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </header>

          <main className="flex-1 p-6 bg-muted/30">
            {currentView === 'home' && <ClientHome />}
            {currentView === 'orders' && <ClientOrders />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}