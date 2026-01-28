import { useState, useMemo } from 'react';
import { Receipt, Percent, AlertTriangle, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { transactions, taxRecords, taxTypes, calculateMetrics, calculateTaxMetrics } from '@/data/mockData';
import { cn } from '@/lib/utils';

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(270, 70%, 60%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 50%)',
];

type FiscalPeriod = 'dia' | 'mes' | 'ano';

export default function DashboardFiscal() {
  const [period, setPeriod] = useState('30');
  const [fiscalPeriod, setFiscalPeriod] = useState<FiscalPeriod>('mes');

  const metrics = useMemo(() => calculateMetrics(transactions, parseInt(period)), [period]);

  // Filtra impostos por período fiscal
  const filteredTaxRecords = useMemo(() => {
    const now = new Date();
    
    return taxRecords.filter(record => {
      const recordDate = new Date(record.dueDate);
      
      switch (fiscalPeriod) {
        case 'dia':
          return recordDate.toDateString() === now.toDateString();
        case 'mes':
          return recordDate.getMonth() === now.getMonth() && 
                 recordDate.getFullYear() === now.getFullYear();
        case 'ano':
          return recordDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [fiscalPeriod]);

  const taxMetrics = useMemo(
    () => calculateTaxMetrics(filteredTaxRecords, metrics.totalEntradas),
    [filteredTaxRecords, metrics.totalEntradas]
  );

  // Calcula valores por tipo de imposto
  const taxByType = useMemo(() => {
    const result: Record<string, number> = {};
    taxTypes.forEach(type => {
      result[type] = filteredTaxRecords
        .filter(r => r.type === type)
        .reduce((sum, r) => sum + r.value, 0);
    });
    return result;
  }, [filteredTaxRecords]);

  // Evolução tributária
  const taxEvolution = useMemo(() => {
    const months: { month: string; value: number }[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      const monthRecords = taxRecords.filter(r => {
        const recordDate = new Date(r.dueDate);
        return recordDate.getMonth() === date.getMonth() && 
               recordDate.getFullYear() === date.getFullYear();
      });
      const total = monthRecords.reduce((sum, r) => sum + r.value, 0);
      months.push({ month: monthName.charAt(0).toUpperCase() + monthName.slice(1), value: total });
    }
    
    return months;
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatCompact = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
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

  const periodButtons = [
    { value: 'dia' as FiscalPeriod, label: 'Dia', icon: Calendar },
    { value: 'mes' as FiscalPeriod, label: 'Mês', icon: CalendarDays },
    { value: 'ano' as FiscalPeriod, label: 'Ano', icon: CalendarRange },
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
        {/* Filtro de Período Fiscal */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Período Fiscal:</span>
          {periodButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={fiscalPeriod === btn.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiscalPeriod(btn.value)}
              className={cn(
                'gap-2',
                fiscalPeriod === btn.value && 'bg-primary text-primary-foreground'
              )}
            >
              <btn.icon className="h-4 w-4" />
              {btn.label}
            </Button>
          ))}
        </div>

        {/* KPIs por Tipo de Imposto */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {taxTypes.map((type, index) => (
            <KPICard
              key={type}
              title={type}
              value={formatCompact(taxByType[type])}
              subtitle={taxByType[type] > 0 ? 'No período' : 'Sem valores'}
              variant={taxByType[type] > 0 ? 'default' : 'default'}
            />
          ))}
        </div>

        {/* KPIs Gerais */}
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} minPointSize={2}>
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
