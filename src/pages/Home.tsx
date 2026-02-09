import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { SummaryCard } from '@/components/home/SummaryCard';
import { BalanceCard } from '@/components/home/BalanceCard';
import { ProjectionChart } from '@/components/home/ProjectionChart';
import { DelinquencyTable } from '@/components/home/DelinquencyTable';
import { ExecutivePanel } from '@/components/home/ExecutivePanel';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowDownCircle,
  AlertCircle,
  ArrowUpCircle,
  AlertTriangle,
  Wallet,
  CreditCard,
} from 'lucide-react';
import {
  getTotalReceivables,
  getTotalReceivablesOverdue,
  getMonthlyPayables,
  getTotalPayablesOverdue,
  getOverdueReceivablesCount,
  getOverduePayablesCount,
  getMonthlyPayablesCount,
  accountBalance,
  receivables,
} from '@/data/mockHomeData';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <Header title="Home" subtitle="Bem-vindo ao seu sistema financeiro" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[350px] rounded-xl" />
            <div className="grid gap-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header title="Home" subtitle="Bem-vindo ao seu sistema financeiro" />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Cards de Resumo Financeiro */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-foreground">Resumo Financeiro</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Contas a Receber"
                value={getTotalReceivables()}
                icon={ArrowDownCircle}
                variant="success"
                count={receivables.length}
                explanation="Total de valores a serem recebidos de clientes no período selecionado. Inclui todas as faturas emitidas ainda não liquidadas."
              />
              <SummaryCard
                title="Contas a Receber em Atraso"
                value={getTotalReceivablesOverdue()}
                icon={AlertCircle}
                variant="danger"
                count={getOverdueReceivablesCount()}
                explanation="Valores que já ultrapassaram a data de vencimento e ainda não foram recebidos. Requer ação imediata de cobrança."
              />
              <SummaryCard
                title="Contas a Pagar no Mês"
                value={getMonthlyPayables()}
                icon={ArrowUpCircle}
                variant="warning"
                count={getMonthlyPayablesCount()}
                explanation="Soma de todos os compromissos financeiros com vencimento no mês vigente. Essencial para planejamento de fluxo de caixa."
              />
              <SummaryCard
                title="Contas a Pagar em Atraso"
                value={getTotalPayablesOverdue()}
                icon={AlertTriangle}
                variant="danger"
                count={getOverduePayablesCount()}
                explanation="Compromissos financeiros que já venceram e ainda não foram pagos. Podem gerar multas e juros."
              />
            </div>
          </section>

          {/* Cards de Caixa */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-foreground">Caixa e Compromissos</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <BalanceCard
                title="Saldo em Conta Atual"
                value={accountBalance.balance}
                icon={Wallet}
                subtitle={accountBalance.bankName}
                isNegative={accountBalance.balance < 0}
                explanation="Saldo disponível na conta bancária principal da empresa. Atualizado diariamente com base nas movimentações registradas."
              />
              <BalanceCard
                title="Despesas a Pagar no Mês"
                value={getMonthlyPayables()}
                icon={CreditCard}
                count={getMonthlyPayablesCount()}
                explanation="Total de despesas com vencimento previsto para o mês corrente. Inclui fornecedores, contas e impostos."
              />
            </div>
          </section>

          {/* Gráfico de Projeção */}
          <section>
            <ProjectionChart />
          </section>

          {/* Painel Executivo */}
          <ExecutivePanel />

          {/* Tabelas de Inadimplência */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-foreground">Gestão de Inadimplência</h2>
            <div className="grid gap-3 lg:grid-cols-2">
              <DelinquencyTable type="cliente" />
              <DelinquencyTable type="fornecedor" />
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
