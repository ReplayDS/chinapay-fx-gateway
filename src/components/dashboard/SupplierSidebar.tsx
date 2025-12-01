import { Home, ShoppingBag, DollarSign } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

interface SupplierSidebarProps {
  currentView: string;
  onViewChange: (view: 'home' | 'orders' | 'finance') => void;
  language: 'pt' | 'zh';
}

export function SupplierSidebar({ currentView, onViewChange, language }: SupplierSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const t = {
    pt: {
      menu: 'Menu',
      home: 'Início',
      orders: 'Pedidos',
      finance: 'Financeiro'
    },
    zh: {
      menu: '菜单',
      home: '首页',
      orders: '订单',
      finance: '财务'
    }
  };

  const items = [
    { id: 'home', title: t[language].home, icon: Home },
    { id: 'orders', title: t[language].orders, icon: ShoppingBag },
    { id: 'finance', title: t[language].finance, icon: DollarSign }
  ];

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t[language].menu}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id as any)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}