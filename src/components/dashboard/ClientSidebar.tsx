import { Home, ShoppingBag } from 'lucide-react';
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

interface ClientSidebarProps {
  currentView: string;
  onViewChange: (view: 'home' | 'orders') => void;
}

export function ClientSidebar({ currentView, onViewChange }: ClientSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const items = [
    { id: 'home', title: 'Início', icon: Home },
    { id: 'orders', title: 'Pedidos', icon: ShoppingBag }
  ];

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id as 'home' | 'orders')}
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