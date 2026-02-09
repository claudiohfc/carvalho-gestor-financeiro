import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Receipt,
  FileText,
  PlusCircle,
  Users,
  Upload,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Scale,
  BarChart3,
  Calculator,
  Settings,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const dashboardItems = [
  { to: '/financeiro', icon: LayoutDashboard, label: 'Financeiro' },
  { to: '/fiscal', icon: Receipt, label: 'Fiscal' },
  { to: '/administrativo', icon: Settings, label: 'Administrativo' },
  { to: '/analitico', icon: BarChart3, label: 'Analítico' },
];

const mainNavItems = [
  { to: '/', icon: Home, label: 'Home' },
];

const afterDashboardItems = [
  { to: '/departamento-pessoal', icon: Briefcase, label: 'Departamento Pessoal' },
  { to: '/dre', icon: FileText, label: 'DRE Gerencial' },
  { to: '/simulador', icon: Calculator, label: 'Simulador de Cenários' },
  { to: '/conciliacao', icon: Scale, label: 'Conciliação Bancária' },
  { to: '/registros', icon: FileText, label: 'Meus Registros' },
  { to: '/lancamentos', icon: PlusCircle, label: 'Lançamentos' },
  { to: '/cadastros', icon: Users, label: 'Clientes e Fornecedores' },
  { to: '/importacao', icon: Upload, label: 'Importação de Dados' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isDashboardActive = dashboardItems.some(item => location.pathname === item.to);
  const [dashboardsOpen, setDashboardsOpen] = useState(isDashboardActive);

  const renderNavItem = (item: { to: string; icon: any; label: string }, indent = false) => {
    const isActive = location.pathname === item.to;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
          indent && !collapsed && 'pl-9',
          isActive
            ? 'bg-sidebar-accent text-primary font-medium'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )}
      >
        <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="fade-in">
              <h1 className="text-sm font-semibold text-foreground">Carvalho</h1>
              <p className="text-[10px] text-muted-foreground">Consultores</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {/* Home */}
        {mainNavItems.map((item) => renderNavItem(item))}

        {/* Dashboards Group */}
        <Collapsible open={dashboardsOpen} onOpenChange={setDashboardsOpen}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                isDashboardActive
                  ? 'text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <LayoutDashboard className={cn('h-4 w-4 flex-shrink-0', isDashboardActive && 'text-primary')} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Dashboards</span>
                  <ChevronDown className={cn(
                    'h-3 w-3 transition-transform duration-200',
                    dashboardsOpen && 'rotate-180'
                  )} />
                </>
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-0.5">
            {dashboardItems.map((item) => renderNavItem(item, true))}
          </CollapsibleContent>
        </Collapsible>

        {/* After Dashboards */}
        {afterDashboardItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-sidebar-border p-2">
        <NavLink
          to="/perfil"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
            location.pathname === '/perfil'
              ? 'bg-sidebar-accent text-primary font-medium'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">Carlos Carvalho</p>
              <p className="truncate text-[10px] text-muted-foreground">Gestor</p>
            </div>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
