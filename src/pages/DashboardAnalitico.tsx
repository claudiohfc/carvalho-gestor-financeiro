import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Users, 
  Clock,
  Briefcase,
  PieChart,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  analyticsKPIs,
  serviceLines,
  productRevenues,
  clientRevenues,
  formatCurrency,
  formatCompact,
} from '@/data/mockAnalyticsData';
import { cn } from '@/lib/utils';

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(270, 70%, 60%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 50%)',
  'hsl(320, 70%, 50%)',
  'hsl(45, 80%, 50%)',
];

export default function DashboardAnalitico() {
  const [period, setPeriod] = useState('30');
  const [expandedKPI, setExpandedKPI] = useState<string | null>(null);

  const serviceChartData = serviceLines.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
    receita: s.revenue,
    custo: s.cost,
  }));

  const servicePieData = serviceLines.map((s, i) => ({
    name: s.name,
    value: s.revenue,
    color: COLORS[i % COLORS.length],
  }));

  const renderKPIValue = (kpi: typeof analyticsKPIs[0]) => {
    switch (kpi.unit) {
      case 'currency': return formatCompact(kpi.value);
      case 'percentage': return `${kpi.value.toFixed(1)}%`;
      case 'days': return `${kpi.value} dias`;
      default: return kpi.value.toLocaleString('pt-BR');
    }
  };

  const getKPITrend = (kpi: typeof analyticsKPIs[0]) => {
    const change = ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100;
    const isPositive = kpi.id === 'ccc' || kpi.id === 'cac' || kpi.id === 'cps' ? change < 0 : change > 0;
    return { change, isPositive };
  };

  const getKPIIcon = (kpiId: string) => {
    const icons: Record<string, typeof TrendingUp> = {
      'ebitda': DollarSign, 'margem-liquida': Target, 'crescimento-yoy': TrendingUp,
      'ccc': Clock, 'cac': Users, 'cps': Briefcase, 'receita-funcionario': Users,
      'receita-cliente': Users, 'real-vs-orcado': BarChart3,
    };
    return icons[kpiId] || PieChart;
  };

  return (
    <MainLayout>
      <Header
        title="Dashboard Analítico"
        subtitle="KPIs avançados para decisão estratégica"
        showFilters
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="p-6 space-y-6">
        {/* Todos os KPIs padronizados */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">KPIs Estratégicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {analyticsKPIs.map((kpi) => {
              const Icon = getKPIIcon(kpi.id);
              const { change, isPositive } = getKPITrend(kpi);
              const isExpanded = expandedKPI === kpi.id;
              const targetProgress = kpi.target ? (kpi.value / kpi.target) * 100 : 0;

              return (
                <Collapsible
                  key={kpi.id}
                  open={isExpanded}
                  onOpenChange={() => setExpandedKPI(isExpanded ? null : kpi.id)}
                >
                  <Card className={cn(
                    'border transition-all hover:shadow-md',
                    (kpi.id === 'cps' || kpi.id === 'real-vs-orcado') && 'border-primary/50 bg-primary/5'
                  )}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg',
                            isPositive ? 'bg-success/10' : 'bg-destructive/10'
                          )}>
                            <Icon className={cn('h-4 w-4', isPositive ? 'text-success' : 'text-destructive')} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">{kpi.name}</p>
                            {kpi.priority === 'high' && (
                              <Badge variant="outline" className="mt-0.5 text-[10px] h-4">Prioritário</Badge>
                            )}
                          </div>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <p className={cn(
                        'mt-2 text-xl font-bold tracking-tight',
                        isPositive ? 'text-success' : 'text-destructive'
                      )}>
                        {renderKPIValue(kpi)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        )}
                        <span className={cn('text-[11px]', isPositive ? 'text-success' : 'text-destructive')}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-muted-foreground">vs anterior</span>
                      </div>
                      {kpi.target && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-muted-foreground">Meta</span>
                            <span className="text-muted-foreground">
                              {kpi.unit === 'currency' ? formatCompact(kpi.target) : 
                               kpi.unit === 'percentage' ? `${kpi.target}%` :
                               kpi.unit === 'days' ? `${kpi.target} dias` : kpi.target}
                            </span>
                          </div>
                          <Progress value={Math.min(targetProgress, 100)} className="h-1" />
                        </div>
                      )}
                      <CollapsibleContent className="mt-3 pt-3 border-t border-border">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{kpi.description}</p>
                        {kpi.formula && (
                          <div className="mt-2 p-1.5 rounded bg-muted/50">
                            <p className="text-[10px] text-muted-foreground">Fórmula:</p>
                            <p className="text-[10px] font-mono text-foreground">{kpi.formula}</p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </section>

        {/* Receita por Linha de Serviço */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Receita por Linha de Serviço
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium">Receita vs Custo por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={70} />
                      <YAxis tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name === 'receita' ? 'Receita' : 'Custo']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="receita" name="Receita" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="custo" name="Custo" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium">Distribuição de Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={servicePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {servicePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                      <Legend layout="vertical" align="right" verticalAlign="middle"
                        formatter={(value) => <span className="text-[10px] text-muted-foreground">{value}</span>} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Receita por Produto e Cliente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                Receita por Produto
              </CardTitle>
              <CardDescription className="text-[10px]">Todos os produtos do período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {productRevenues.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{product.unitsSold} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">{formatCurrency(product.revenue)}</p>
                      <Badge variant={product.margin >= 60 ? 'default' : 'secondary'} className="text-[10px] h-4">
                        {product.margin.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-success" />
                Receita por Cliente
              </CardTitle>
              <CardDescription className="text-[10px]">Todos os clientes do período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clientRevenues.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                        <Briefcase className="h-3 w-3 text-success" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{client.name}</p>
                        <p className="text-[10px] text-muted-foreground">{client.lifetime} meses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">{formatCurrency(client.revenue)}</p>
                      <Badge variant={client.margin >= 60 ? 'default' : 'secondary'} className="text-[10px] h-4">
                        {client.margin.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
