import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  Target,
  AlertTriangle,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  formatCurrency,
  accountBalance,
  getProjectedCash,
  getMonthProfit,
  getOperationalMargin,
  getCriticalAlerts,
  getAutomaticInsights,
} from '@/data/mockHomeData';

type ProjectionPeriod = 30 | 60 | 90;

export function ExecutivePanel() {
  const [projectionPeriod, setProjectionPeriod] = useState<ProjectionPeriod>(30);

  const projectedCash = getProjectedCash(projectionPeriod);
  const monthProfit = getMonthProfit();
  const operationalMargin = getOperationalMargin();
  const criticalAlerts = getCriticalAlerts();
  const insights = getAutomaticInsights();

  return (
    <section className="animate-fade-in">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Painel Executivo de Decisão
      </h2>
      
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Caixa Atual */}
        <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Caixa Atual
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className={cn(
              'text-2xl font-bold tracking-tight',
              accountBalance.balance < 0 ? 'text-destructive' : 'text-foreground'
            )}>
              {formatCurrency(accountBalance.balance)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {accountBalance.bankName}
            </p>
          </CardContent>
        </Card>

        {/* Caixa Projetado */}
        <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Caixa Projetado
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className={cn(
              'text-2xl font-bold tracking-tight',
              projectedCash < 0 ? 'text-destructive' : 'text-success'
            )}>
              {formatCurrency(projectedCash)}
            </p>
            <div className="mt-2 flex gap-1">
              {([30, 60, 90] as ProjectionPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={projectionPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setProjectionPeriod(period)}
                >
                  {period}d
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lucro do Mês */}
        <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro do Mês
              </CardTitle>
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                monthProfit.value >= 0 ? 'bg-success/10' : 'bg-destructive/10'
              )}>
                {monthProfit.value >= 0 ? (
                  <ArrowUp className="h-4 w-4 text-success" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className={cn(
              'text-2xl font-bold tracking-tight',
              monthProfit.value >= 0 ? 'text-success' : 'text-destructive'
            )}>
              {formatCurrency(monthProfit.value)}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <Badge
                variant={monthProfit.trend === 'up' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {monthProfit.trend === 'up' ? '+' : ''}{monthProfit.percentage}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* Margem Operacional */}
        <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Margem Operacional
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className={cn(
              'text-2xl font-bold tracking-tight',
              operationalMargin.value >= 15 ? 'text-success' : 
              operationalMargin.value >= 10 ? 'text-warning' : 'text-destructive'
            )}>
              {operationalMargin.value.toFixed(1)}%
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  operationalMargin.value >= 15 ? 'bg-success' : 
                  operationalMargin.value >= 10 ? 'bg-warning' : 'bg-destructive'
                )}
                style={{ width: `${Math.min(operationalMargin.value, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Insights */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Alertas Críticos */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-sm font-semibold text-foreground">
                Alertas Críticos
              </CardTitle>
              {criticalAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {criticalAlerts.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum alerta crítico no momento.
              </p>
            ) : (
              criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg bg-card/50 p-3 transition-colors hover:bg-card"
                >
                  <div className={cn(
                    'mt-0.5 h-2 w-2 rounded-full flex-shrink-0',
                    alert.severity === 'high' ? 'bg-destructive' :
                    alert.severity === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {alert.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Insights Automáticos */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-semibold text-foreground">
                Insights Automáticos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum insight disponível no momento.
              </p>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 rounded-lg bg-card/50 p-3 transition-colors hover:bg-card"
                >
                  <div className={cn(
                    'mt-0.5 flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0',
                    insight.type === 'positive' ? 'bg-success/10 text-success' :
                    insight.type === 'negative' ? 'bg-destructive/10 text-destructive' :
                    'bg-primary/10 text-primary'
                  )}>
                    {insight.type === 'positive' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : insight.type === 'negative' ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <Lightbulb className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {insight.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
