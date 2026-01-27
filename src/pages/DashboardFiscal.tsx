import { useState, useMemo } from 'react';
import { Receipt, Percent, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transactions, taxRecords, calculateMetrics, calculateTaxMetrics } from '@/data/mockData';

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(270, 70%, 60%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 50%)',
];

export default function DashboardFiscal() {
  const [period, setPeriod] = useState('30');

  const metrics = useMemo(() => calculateMetrics(transactions, parseInt(period)), [period]);
  const taxMetrics = useMemo(
    () => calculateTaxMetrics(taxRecords, metrics.totalEntradas),
    [metrics.totalEntradas]
  );

  // Tax evolution data (mock)
  const taxEvolution = [
    { month: 'Ago', value: 32000 },
    { month: 'Set', value: 35000 },
    { month: 'Out', value: 28000 },
    { month: 'Nov', value: 42000 },
    { month: 'Dez', value: 38000 },
    { month: 'Jan', value: 45000 },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const fiscalInsights = [
    {
      type: 'info' as const,
      title: 'IRPJ a Vencer',
      description: 'Próximo recolhimento de IRPJ trimestral previsto para março/2025.',
    },
    {
      type: 'warning' as const,
      title: 'PIS/COFINS Pendente',
      description: `R$ ${(taxMetrics.totalPending).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em tributos aguardando pagamento.`,
    },
    {
      type: 'positive' as const,
      title: 'Regularidade Fiscal',
      description: 'Todos os tributos vencidos estão quitados. Situação regular.',
    },
  ];

  return (
    <MainLayout>
      <Header
        title="Dashboard Fiscal e Tributário"
        subtitle="Acompanhamento de impostos e obrigações fiscais"
        showFilters
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="p-8 space-y-8">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            title="Total de Impostos Pagos"
            value={formatCurrency(taxMetrics.totalPaid)}
            icon={<Receipt className="h-5 w-5 text-primary" />}
            subtitle="No período selecionado"
          />
          <KPICard
            title="% sobre Faturamento"
            value={`${taxMetrics.percentOfRevenue.toFixed(1)}%`}
            icon={<Percent className="h-5 w-5 text-warning" />}
            subtitle="Carga tributária efetiva"
          />
          <KPICard
            title="Maior Impacto"
            value={taxMetrics.topTax ? taxMetrics.topTax.type : '-'}
            subtitle={taxMetrics.topTax ? formatCurrency(taxMetrics.topTax.value) : ''}
            icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax by Type */}
          <Card className="glass-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-foreground">
                Impostos por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taxMetrics.byType}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                    <XAxis
                      dataKey="type"
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Valor']}
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 9%)',
                        border: '1px solid hsl(217, 33%, 17%)',
                        borderRadius: '8px',
                        color: 'hsl(210, 40%, 98%)',
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {taxMetrics.byType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tax Evolution */}
          <Card className="glass-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-foreground">
                Evolução da Carga Tributária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taxEvolution} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Impostos']}
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 9%)',
                        border: '1px solid hsl(217, 33%, 17%)',
                        borderRadius: '8px',
                        color: 'hsl(210, 40%, 98%)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(38, 92%, 50%)', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: 'hsl(38, 92%, 50%)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Row */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-foreground">Alertas e Observações</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fiscalInsights.map((insight, index) => (
              <InsightCard
                key={index}
                type={insight.type}
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
