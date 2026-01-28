import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Calculator, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import {
  transactions,
  calculateMetrics,
  getSpendingByCategory,
  getDailyTrend,
  generateInsights,
} from '@/data/mockData';

export default function DashboardFinanceiro() {
  const [period, setPeriod] = useState('30');
  const [category, setCategory] = useState('all');

  const filteredTransactions = useMemo(() => {
    let data = transactions;
    
    if (period !== 'all') {
      const days = parseInt(period);
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      data = data.filter((t) => new Date(t.date) >= startDate);
    }
    
    if (category !== 'all') {
      data = data.filter((t) => t.category === category);
    }
    
    return data;
  }, [period, category]);

  const metrics = useMemo(() => {
    const days = period === 'all' ? 365 : parseInt(period);
    return calculateMetrics(filteredTransactions, days);
  }, [filteredTransactions, period]);

  const spendingByCategory = useMemo(
    () => getSpendingByCategory(filteredTransactions, true),
    [filteredTransactions]
  );

  const dailyTrend = useMemo(() => {
    const days = period === 'all' ? 30 : Math.min(parseInt(period), 30);
    return getDailyTrend(filteredTransactions, days);
  }, [filteredTransactions, period]);

  const insights = useMemo(() => generateInsights(transactions), []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  return (
    <MainLayout>
      <Header
        title="Dashboard Financeiro"
        subtitle="Visão geral das finanças da empresa"
        showFilters
        period={period}
        onPeriodChange={setPeriod}
        category={category}
        onCategoryChange={setCategory}
      />

      <div className="p-8 space-y-8">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Total de Entradas"
            value={formatCurrency(metrics.totalEntradas)}
            icon={<TrendingUp className="h-5 w-5 text-success" />}
            variant="positive"
            trend="up"
            trendValue="+12.5% vs anterior"
          />
          <KPICard
            title="Total de Saídas"
            value={formatCurrency(metrics.totalSaidas)}
            icon={<TrendingDown className="h-5 w-5 text-destructive" />}
            variant="negative"
            trend="down"
            trendValue="-3.2% vs anterior"
          />
          <KPICard
            title="Resultado"
            value={formatCurrency(metrics.resultado)}
            subtitle={`${metrics.resultado >= 0 ? '+' : ''}${metrics.totalEntradas > 0 ? ((metrics.resultado / metrics.totalEntradas) * 100).toFixed(1) : 0}% de margem`}
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            variant={metrics.resultado >= 0 ? 'positive' : 'negative'}
            trend={metrics.resultado >= 0 ? 'up' : 'down'}
          />
          <KPICard
            title="Gasto Médio Diário"
            value={formatCurrency(metrics.gastoMedioDiario)}
            icon={<Calendar className="h-5 w-5 text-primary" />}
          />
          <KPICard
            title="Gasto Médio Mensal"
            value={formatCurrency(metrics.gastoMedioMensal)}
            icon={<CreditCard className="h-5 w-5 text-primary" />}
          />
          <KPICard
            title="Gasto Médio Anual"
            value={formatCurrency(metrics.gastoMedioAnual)}
            icon={<Calculator className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart data={dailyTrend} />
          <SpendingChart data={spendingByCategory} />
        </div>

        {/* Insights Row */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-foreground">Insights Automáticos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <InsightCard
                key={index}
                type={insight.type as 'positive' | 'negative' | 'warning' | 'info'}
                title={insight.title}
                description={insight.description}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
