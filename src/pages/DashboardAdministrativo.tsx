import { useState } from 'react';
import { Building, Gauge, DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  operationalCosts,
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

  return (
    <MainLayout>
      <Header
        title="Dashboard Administrativo"
        subtitle="Custos operacionais e eficiência"
        showFilters
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="p-6 space-y-6">
        {/* KPIs Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Custo Operacional Total</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{formatCurrency(totalOperationalCost)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{budgetUtilization.toFixed(1)}% do orçamento</p>
                  <Progress value={budgetUtilization} className="mt-1.5 h-1" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Building className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-warning/30 transition-all">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Taxa de Utilização</p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {efficiencyMetrics.find(m => m.metric === 'Taxa de Utilização')?.value}%
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">meta: 85%</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                  <Gauge className="h-4 w-4 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-success/30 transition-all">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Orçamento Disponível</p>
                  <p className="mt-1 text-xl font-bold text-success">{formatCurrency(totalBudget - totalOperationalCost)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">restante no período</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                  <DollarSign className="h-4 w-4 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Custos Operacionais */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Custos Operacionais por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => formatCompact(v)}
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Métricas de Eficiência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {efficiencyMetrics.map((metric) => {
                  const progress = (metric.value / metric.target) * 100;
                  const isInverse = metric.metric === 'Tempo Médio de Entrega' || metric.metric === 'Retrabalho';
                  const isGood = isInverse ? metric.value <= metric.target : metric.value >= metric.target;
                  
                  return (
                    <div key={metric.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn('font-medium', isGood ? 'text-success' : 'text-warning')}>
                            {metric.value}{metric.unit === '%' || metric.unit === '/5' ? metric.unit : ` ${metric.unit}`}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            / {metric.target}{metric.unit === '%' || metric.unit === '/5' ? metric.unit : ` ${metric.unit}`}
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className={cn('h-1.5', isGood ? '[&>div]:bg-success' : '[&>div]:bg-warning')}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhamento de Custos */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detalhamento de Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Categoria</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Valor Atual</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Mês Anterior</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Orçamento</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Variação</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">% Orçamento</th>
                  </tr>
                </thead>
                <tbody>
                  {operationalCosts.map((cost) => {
                    const variation = ((cost.value - cost.previousValue) / cost.previousValue) * 100;
                    const budgetPercent = (cost.value / cost.budget) * 100;
                    
                    return (
                      <tr key={cost.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-3 font-medium text-foreground">{cost.category}</td>
                        <td className="py-2 px-3 text-right text-foreground">{formatCurrency(cost.value)}</td>
                        <td className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(cost.previousValue)}</td>
                        <td className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(cost.budget)}</td>
                        <td className="py-2 px-3 text-right">
                          <Badge variant={variation > 0 ? 'destructive' : variation < 0 ? 'default' : 'secondary'} className="text-[10px]">
                            {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-right">
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
                    <td className="py-2 px-3 font-bold text-foreground">Total</td>
                    <td className="py-2 px-3 text-right font-bold text-foreground">{formatCurrency(totalOperationalCost)}</td>
                    <td className="py-2 px-3 text-right font-medium text-muted-foreground">
                      {formatCurrency(operationalCosts.reduce((sum, c) => sum + c.previousValue, 0))}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-muted-foreground">{formatCurrency(totalBudget)}</td>
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
