import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  PlusCircle,
  Users,
  Upload,
  User,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard Financeiro' },
  { to: '/fiscal', icon: Receipt, label: 'Dashboard Fiscal' },
  { to: '/registros', icon: FileText, label: 'Meus Registros' },
  { to: '/lancamentos', icon: PlusCircle, label: 'Lançamentos' },
  { to: '/cadastros', icon: Users, label: 'Clientes e Fornecedores' },
  { to: '/importacao', icon: Upload, label: 'Importação de Dados' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[280px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="fade-in">
              <h1 className="text-sm font-semibold text-foreground">Carvalho</h1>
              <p className="text-xs text-muted-foreground">Consultores</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-sidebar-border p-3">
        <NavLink
          to="/perfil"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
            location.pathname === '/perfil'
              ? 'bg-sidebar-accent text-primary font-medium'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">Carlos Carvalho</p>
              <p className="truncate text-xs text-muted-foreground">Gestor</p>
            </div>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
