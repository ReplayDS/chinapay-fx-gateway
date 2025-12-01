import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { AdminHome } from '@/components/dashboard/admin/AdminHome';
import { AdminSuppliers } from '@/components/dashboard/admin/AdminSuppliers';
import { AdminFinance } from '@/components/dashboard/admin/AdminFinance';
import { AdminClients } from '@/components/dashboard/admin/AdminClients';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type View = 'home' | 'suppliers' | 'finance' | 'clients';

export default function AdminDashboard() {
  const { user, userRole, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
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
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Painel Admin</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </header>

          <main className="flex-1 p-6 bg-muted/30">
            {currentView === 'home' && <AdminHome />}
            {currentView === 'suppliers' && <AdminSuppliers />}
            {currentView === 'finance' && <AdminFinance />}
            {currentView === 'clients' && <AdminClients />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}