import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { SummaryCard } from '@/components/home/SummaryCard';
import { BalanceCard } from '@/components/home/BalanceCard';
import { ProjectionChart } from '@/components/home/ProjectionChart';
import { DelinquencyTable } from '@/components/home/DelinquencyTable';
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

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <Header
          title="Home"
          subtitle="Bem-vindo ao seu sistema financeiro"
        />
        <main className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Loading Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[380px] rounded-xl" />
            <div className="grid gap-4 lg:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Home"
        subtitle="Bem-vindo ao seu sistema financeiro"
      />
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Cards de Resumo Financeiro */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Resumo Financeiro
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Contas a Receber"
                value={getTotalReceivables()}
                icon={ArrowDownCircle}
                variant="success"
                count={receivables.length}
              />
              <SummaryCard
                title="Contas a Receber em Atraso"
                value={getTotalReceivablesOverdue()}
                icon={AlertCircle}
                variant="danger"
                count={getOverdueReceivablesCount()}
              />
              <SummaryCard
                title="Contas a Pagar no Mês"
                value={getMonthlyPayables()}
                icon={ArrowUpCircle}
                variant="warning"
                count={getMonthlyPayablesCount()}
              />
              <SummaryCard
                title="Contas a Pagar em Atraso"
                value={getTotalPayablesOverdue()}
                icon={AlertTriangle}
                variant="danger"
                count={getOverduePayablesCount()}
              />
            </div>
          </section>

          {/* Cards de Caixa e Compromissos */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Caixa e Compromissos
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <BalanceCard
                title="Saldo em Conta Atual"
                value={accountBalance.balance}
                icon={Wallet}
                subtitle={accountBalance.bankName}
                isNegative={accountBalance.balance < 0}
              />
              <BalanceCard
                title="Despesas a Pagar no Mês"
                value={getMonthlyPayables()}
                icon={CreditCard}
                count={getMonthlyPayablesCount()}
              />
            </div>
          </section>

          {/* Gráfico de Projeção */}
          <section>
            <ProjectionChart />
          </section>

          {/* Tabelas de Inadimplência */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Gestão de Inadimplência
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <DelinquencyTable type="cliente" />
              <DelinquencyTable type="fornecedor" />
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
