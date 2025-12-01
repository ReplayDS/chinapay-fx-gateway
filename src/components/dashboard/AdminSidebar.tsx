import { Home, Users, DollarSign, UserCheck } from 'lucide-react';
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

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: 'home' | 'suppliers' | 'finance' | 'clients') => void;
}

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const items = [
    { id: 'home', title: 'Início', icon: Home },
    { id: 'suppliers', title: 'Fornecedores', icon: UserCheck },
    { id: 'finance', title: 'Financeiro', icon: DollarSign },
    { id: 'clients', title: 'Clientes', icon: Users }
  ];

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
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