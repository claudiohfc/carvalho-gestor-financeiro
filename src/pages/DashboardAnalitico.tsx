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
  Info,
  ChevronDown,
  ChevronUp,
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
  employeeRevenues,
  clientRevenues,
  formatCurrency,
  formatCompact,
  formatPercentage,
} from '@/data/mockAnalyticsData';
import { cn } from '@/lib/utils';

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(270, 70%, 60%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 50%)',
];

export default function DashboardAnalitico() {
  const [period, setPeriod] = useState('30');
  const [expandedKPI, setExpandedKPI] = useState<string | null>(null);

  const priorityKPIs = analyticsKPIs.filter(k => k.priority === 'high');
  const otherKPIs = analyticsKPIs.filter(k => k.priority !== 'high');

  const serviceChartData = serviceLines.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
    receita: s.revenue,
    custo: s.cost,
    margem: s.margin,
  }));

  const servicePieData = serviceLines.map((s, i) => ({
    name: s.name,
    value: s.revenue,
    color: COLORS[i % COLORS.length],
  }));

  const renderKPIValue = (kpi: typeof analyticsKPIs[0]) => {
    switch (kpi.unit) {
      case 'currency':
        return formatCompact(kpi.value);
      case 'percentage':
        return `${kpi.value.toFixed(1)}%`;
      case 'days':
        return `${kpi.value} dias`;
      default:
        return kpi.value.toLocaleString('pt-BR');
    }
  };

  const getKPITrend = (kpi: typeof analyticsKPIs[0]) => {
    const change = ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100;
    const isPositive = kpi.id === 'ccc' || kpi.id === 'cac' || kpi.id === 'cps' 
      ? change < 0 
      : change > 0;
    return { change, isPositive };
  };

  const getKPIIcon = (kpiId: string) => {
    const icons: Record<string, typeof TrendingUp> = {
      'ebitda': DollarSign,
      'margem-liquida': Target,
      'crescimento-yoy': TrendingUp,
      'ccc': Clock,
      'cac': Users,
      'cps': Briefcase,
      'receita-funcionario': Users,
      'receita-cliente': Users,
      'real-vs-orcado': BarChart3,
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

      <div className="p-8 space-y-8">
        {/* KPIs Prioritários */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            KPIs Prioritários
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityKPIs.map((kpi) => {
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
                    'border-2 transition-all hover:shadow-lg',
                    kpi.id === 'cps' || kpi.id === 'real-vs-orcado' 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border'
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            isPositive ? 'bg-success/10' : 'bg-destructive/10'
                          )}>
                            <Icon className={cn(
                              'h-5 w-5',
                              isPositive ? 'text-success' : 'text-destructive'
                            )} />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
                              Prioritário
                            </Badge>
                          </div>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={cn(
                        'text-3xl font-bold tracking-tight',
                        isPositive ? 'text-success' : 'text-destructive'
                      )}>
                        {renderKPIValue(kpi)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={cn(
                          'text-sm',
                          isPositive ? 'text-success' : 'text-destructive'
                        )}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">vs anterior</span>
                      </div>
                      
                      {kpi.target && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Meta</span>
                            <span className="text-muted-foreground">
                              {kpi.unit === 'currency' ? formatCompact(kpi.target) : 
                               kpi.unit === 'percentage' ? `${kpi.target}%` :
                               kpi.unit === 'days' ? `${kpi.target} dias` : kpi.target}
                            </span>
                          </div>
                          <Progress value={Math.min(targetProgress, 100)} className="h-1.5" />
                        </div>
                      )}

                      <CollapsibleContent className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">{kpi.description}</p>
                        {kpi.formula && (
                          <div className="mt-3 p-2 rounded bg-muted/50">
                            <p className="text-xs text-muted-foreground">Fórmula:</p>
                            <p className="text-xs font-mono text-foreground">{kpi.formula}</p>
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

        {/* KPIs Secundários */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Outros KPIs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherKPIs.map((kpi) => {
              const { change, isPositive } = getKPITrend(kpi);
              
              return (
                <Card key={kpi.id} className="border-border hover:border-primary/30 transition-all">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground truncate">{kpi.name}</p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {renderKPIValue(kpi)}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={cn(
                        'text-xs',
                        isPositive ? 'text-success' : 'text-destructive'
                      )}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Receita por Linha de Serviço */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Receita por Linha de Serviço
            <Badge variant="outline" className="ml-2">Prioritário</Badge>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Receita vs Custo por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        tickFormatter={(v) => formatCompact(v)}
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value),
                          name === 'receita' ? 'Receita' : 'Custo'
                        ]}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="receita" name="Receita" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="custo" name="Custo" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Distribuição de Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={servicePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {servicePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabelas de Detalhamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receita por Funcionário */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Receita por Funcionário</CardTitle>
              <CardDescription>Performance individual de geração de receita</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employeeRevenues.map((emp) => (
                  <div 
                    key={emp.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatCurrency(emp.revenue)}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-xs text-muted-foreground">Produtividade:</span>
                        <Badge variant={emp.productivity >= 100 ? 'default' : 'secondary'} className="text-xs">
                          {emp.productivity}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Receita por Cliente */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Receita por Cliente</CardTitle>
              <CardDescription>Top clientes por faturamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientRevenues.map((client) => (
                  <div 
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.lifetime} meses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatCurrency(client.revenue)}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-xs text-muted-foreground">Margem:</span>
                        <Badge variant={client.margin >= 60 ? 'default' : 'secondary'} className="text-xs">
                          {client.margin.toFixed(1)}%
                        </Badge>
                      </div>
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
