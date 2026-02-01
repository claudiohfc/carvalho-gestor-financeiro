import { useState } from 'react';
import { Users, Building, Gauge, TrendingUp, TrendingDown, Minus, DollarSign, Clock, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  operationalCosts,
  peopleMetrics,
  efficiencyMetrics,
  formatCurrency,
  formatCompact,
} from '@/data/mockAnalyticsData';
import { cn } from '@/lib/utils';

export default function DashboardAdministrativo() {
  const [period, setPeriod] = useState('30');

  const totalOperationalCost = operationalCosts.reduce((sum, c) => sum + c.value, 0);
  const totalBudget = operationalCosts.reduce((sum, c) => sum + c.budget, 0);
  const budgetUtilization = (totalOperationalCost / totalBudget) * 100;

  const costChartData = operationalCosts.map(c => ({
    name: c.category,
    atual: c.value,
    anterior: c.previousValue,
    orcamento: c.budget,
  }));

  const efficiencyChartData = efficiencyMetrics.map((m, index) => ({
    name: m.metric,
    value: m.value,
    target: m.target,
    fill: `hsl(${217 + index * 30}, 70%, ${50 + index * 5}%)`,
  }));

  return (
    <MainLayout>
      <Header
        title="Dashboard Administrativo"
        subtitle="Custos operacionais, pessoas e eficiência"
        showFilters
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="p-8 space-y-8">
        {/* KPIs Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Custo Operacional Total
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Building className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalOperationalCost)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {budgetUtilization.toFixed(1)}% do orçamento
              </p>
              <Progress value={budgetUtilization} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Colaboradores
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <Users className="h-4 w-4 text-success" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {peopleMetrics.find(m => m.metric === 'Total de Colaboradores')?.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                pessoas ativas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taxa de Utilização
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <Gauge className="h-4 w-4 text-warning" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {efficiencyMetrics.find(m => m.metric === 'Taxa de Utilização')?.value}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                meta: 85%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Custo por Colaborador
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(peopleMetrics.find(m => m.metric === 'Custo Médio por Colaborador')?.value || 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                média mensal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custos Operacionais */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Custos Operacionais por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => formatCompact(v)}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="atual" name="Atual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="anterior" name="Anterior" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="orcamento" name="Orçamento" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Métricas de Eficiência */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Métricas de Eficiência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {efficiencyMetrics.map((metric) => {
                  const progress = (metric.value / metric.target) * 100;
                  const isAboveTarget = metric.value >= metric.target;
                  const isInverse = metric.metric === 'Tempo Médio de Entrega' || metric.metric === 'Retrabalho';
                  const isGood = isInverse ? metric.value <= metric.target : isAboveTarget;
                  
                  return (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'font-medium',
                            isGood ? 'text-success' : 'text-warning'
                          )}>
                            {metric.value}{metric.unit === '%' || metric.unit === '/5' ? metric.unit : ` ${metric.unit}`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / {metric.target}{metric.unit === '%' || metric.unit === '/5' ? metric.unit : ` ${metric.unit}`}
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className={cn('h-2', isGood ? '[&>div]:bg-success' : '[&>div]:bg-warning')}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Pessoas */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Indicadores de Pessoas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {peopleMetrics.map((metric) => {
                const TrendIcon = metric.trend === 'up' ? TrendingUp : 
                                  metric.trend === 'down' ? TrendingDown : Minus;
                const trendColor = metric.trend === 'up' ? 'text-success' :
                                   metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
                
                // Inverter a cor para métricas onde "down" é bom
                const isInverseMetric = ['Turnover Mensal', 'Absenteísmo', 'Horas Extras Médias'].includes(metric.metric);
                const displayColor = isInverseMetric ? 
                  (metric.trend === 'down' ? 'text-success' : metric.trend === 'up' ? 'text-destructive' : 'text-muted-foreground') :
                  trendColor;

                return (
                  <div 
                    key={metric.id}
                    className="rounded-lg border border-border bg-card/50 p-4 hover:border-primary/30 transition-all"
                  >
                    <p className="text-xs text-muted-foreground truncate">{metric.metric}</p>
                    <div className="mt-2 flex items-end gap-1">
                      <span className="text-xl font-bold text-foreground">
                        {metric.unit === 'R$' ? formatCurrency(metric.value) : metric.value}
                      </span>
                      {metric.unit !== 'R$' && (
                        <span className="text-xs text-muted-foreground mb-0.5">{metric.unit}</span>
                      )}
                    </div>
                    <div className={cn('mt-2 flex items-center gap-1 text-xs', displayColor)}>
                      <TrendIcon className="h-3 w-3" />
                      <span>{metric.trend === 'up' ? 'Subindo' : metric.trend === 'down' ? 'Caindo' : 'Estável'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detalhamento de Custos */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Detalhamento de Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Categoria</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Valor Atual</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Mês Anterior</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Orçamento</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Variação</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">% Orçamento</th>
                  </tr>
                </thead>
                <tbody>
                  {operationalCosts.map((cost) => {
                    const variation = ((cost.value - cost.previousValue) / cost.previousValue) * 100;
                    const budgetPercent = (cost.value / cost.budget) * 100;
                    
                    return (
                      <tr key={cost.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{cost.category}</td>
                        <td className="py-3 px-4 text-sm text-right text-foreground">{formatCurrency(cost.value)}</td>
                        <td className="py-3 px-4 text-sm text-right text-muted-foreground">{formatCurrency(cost.previousValue)}</td>
                        <td className="py-3 px-4 text-sm text-right text-muted-foreground">{formatCurrency(cost.budget)}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <Badge variant={variation > 0 ? 'destructive' : variation < 0 ? 'default' : 'secondary'}>
                            {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className={cn(
                            budgetPercent > 100 ? 'text-destructive' : budgetPercent > 90 ? 'text-warning' : 'text-success'
                          )}>
                            {budgetPercent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="py-3 px-4 text-sm font-bold text-foreground">Total</td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-foreground">
                      {formatCurrency(totalOperationalCost)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-muted-foreground">
                      {formatCurrency(operationalCosts.reduce((sum, c) => sum + c.previousValue, 0))}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-muted-foreground">
                      {formatCurrency(totalBudget)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
