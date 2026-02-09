import { useState } from 'react';
import { DashboardFinanceiroKPIs } from '@/components/dashboard/DashboardFinanceiroKPIs';
import { DashboardFinanceiroPessoal } from '@/components/dashboard/DashboardFinanceiroPessoal';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { InsightCard } from '@/components/dashboard/InsightCard';
import {
  transactions,
  calculateMetrics,
  getSpendingByCategory,
  getDailyTrend,
  generateInsights,
} from '@/data/mockData';
import { getPayrollSummary } from '@/data/mockAnalyticsData';
import { useMemo } from 'react';

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
  const payrollSummary = useMemo(() => getPayrollSummary(), []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

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
      <div className="p-6 space-y-6">
        <DashboardFinanceiroKPIs metrics={metrics} formatCurrency={formatCurrency} />
        <DashboardFinanceiroPessoal payrollSummary={payrollSummary} formatCurrency={formatCurrency} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendChart data={dailyTrend} />
          <SpendingChart data={spendingByCategory} />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">Insights Automáticos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
