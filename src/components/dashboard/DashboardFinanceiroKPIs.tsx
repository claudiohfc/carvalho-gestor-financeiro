import { TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Calculator } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface DashboardFinanceiroKPIsProps {
  metrics: {
    totalEntradas: number;
    totalSaidas: number;
    resultado: number;
    gastoMedioDiario: number;
    gastoMedioMensal: number;
    gastoMedioAnual: number;
  };
  formatCurrency: (value: number) => string;
}

export function DashboardFinanceiroKPIs({ metrics, formatCurrency }: DashboardFinanceiroKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <KPICard
        title="Total de Entradas"
        value={formatCurrency(metrics.totalEntradas)}
        icon={<TrendingUp className="h-4 w-4 text-success" />}
        variant="positive"
        trend="up"
        trendValue="+12.5% vs anterior"
        explanation="Soma de todas as receitas recebidas no período selecionado, incluindo vendas de serviços e outras entradas."
      />
      <KPICard
        title="Total de Saídas"
        value={formatCurrency(metrics.totalSaidas)}
        icon={<TrendingDown className="h-4 w-4 text-destructive" />}
        variant="negative"
        trend="down"
        trendValue="-3.2% vs anterior"
        explanation="Soma de todas as despesas e custos pagos no período, incluindo fornecedores, pessoal e operacional."
      />
      <KPICard
        title="Resultado"
        value={formatCurrency(metrics.resultado)}
        subtitle={`${metrics.resultado >= 0 ? '+' : ''}${metrics.totalEntradas > 0 ? ((metrics.resultado / metrics.totalEntradas) * 100).toFixed(1) : 0}% de margem`}
        icon={<DollarSign className="h-4 w-4 text-primary" />}
        variant={metrics.resultado >= 0 ? 'positive' : 'negative'}
        trend={metrics.resultado >= 0 ? 'up' : 'down'}
        explanation="Diferença entre entradas e saídas no período. Indica o lucro ou prejuízo operacional."
      />
      <KPICard
        title="Gasto Médio Diário"
        value={formatCurrency(metrics.gastoMedioDiario)}
        icon={<Calendar className="h-4 w-4 text-primary" />}
        explanation="Média de gastos por dia no período selecionado. Útil para planejamento de fluxo de caixa diário."
      />
      <KPICard
        title="Gasto Médio Mensal"
        value={formatCurrency(metrics.gastoMedioMensal)}
        icon={<CreditCard className="h-4 w-4 text-primary" />}
        explanation="Média de gastos mensais projetada com base no período selecionado."
      />
      <KPICard
        title="Gasto Médio Anual"
        value={formatCurrency(metrics.gastoMedioAnual)}
        icon={<Calculator className="h-4 w-4 text-primary" />}
        explanation="Projeção anual de gastos baseada na média do período selecionado."
      />
    </div>
  );
}
