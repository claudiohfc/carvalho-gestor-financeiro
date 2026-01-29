import { addDays, format, isAfter, isBefore, startOfDay, subDays } from 'date-fns';

// Interfaces
export interface Receivable {
  id: string;
  clientName: string;
  value: number;
  dueDate: string;
  status: 'em_aberto' | 'proximo_vencer' | 'vencido';
}

export interface Payable {
  id: string;
  supplierName: string;
  value: number;
  dueDate: string;
  status: 'em_aberto' | 'proximo_vencer' | 'vencido';
}

export interface AccountBalance {
  bankName: string;
  balance: number;
  lastUpdate: string;
}

export interface ProjectionData {
  day: number;
  date: string;
  receivables: number;
  payables: number;
  balance: number;
}

// Helper para gerar data formatada
const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

// Data atual
const today = startOfDay(new Date());

// Gerar contas a receber mockadas
export const receivables: Receivable[] = [
  { id: 'rec-1', clientName: 'Tech Solutions Ltda', value: 15000, dueDate: formatDate(subDays(today, 15)), status: 'vencido' },
  { id: 'rec-2', clientName: 'Empresa ABC', value: 8500, dueDate: formatDate(subDays(today, 10)), status: 'vencido' },
  { id: 'rec-3', clientName: 'Grupo Inovação', value: 12300, dueDate: formatDate(subDays(today, 5)), status: 'vencido' },
  { id: 'rec-4', clientName: 'Digital Corp', value: 4200, dueDate: formatDate(addDays(today, 2)), status: 'proximo_vencer' },
  { id: 'rec-5', clientName: 'StartUp X', value: 6800, dueDate: formatDate(addDays(today, 5)), status: 'proximo_vencer' },
  { id: 'rec-6', clientName: 'Consultoria Plus', value: 9100, dueDate: formatDate(addDays(today, 7)), status: 'proximo_vencer' },
  { id: 'rec-7', clientName: 'Serviços Gerais', value: 3500, dueDate: formatDate(addDays(today, 10)), status: 'em_aberto' },
  { id: 'rec-8', clientName: 'Indústria Beta', value: 22000, dueDate: formatDate(addDays(today, 15)), status: 'em_aberto' },
  { id: 'rec-9', clientName: 'Comércio Delta', value: 7600, dueDate: formatDate(addDays(today, 20)), status: 'em_aberto' },
  { id: 'rec-10', clientName: 'Atacado Omega', value: 18500, dueDate: formatDate(addDays(today, 25)), status: 'em_aberto' },
  { id: 'rec-11', clientName: 'Logística Express', value: 11200, dueDate: formatDate(addDays(today, 30)), status: 'em_aberto' },
  { id: 'rec-12', clientName: 'Farmácia Central', value: 5400, dueDate: formatDate(addDays(today, 35)), status: 'em_aberto' },
  { id: 'rec-13', clientName: 'Auto Peças Jr', value: 8900, dueDate: formatDate(addDays(today, 40)), status: 'em_aberto' },
  { id: 'rec-14', clientName: 'Padaria Estrela', value: 2800, dueDate: formatDate(addDays(today, 45)), status: 'em_aberto' },
  { id: 'rec-15', clientName: 'Restaurante Sabor', value: 4300, dueDate: formatDate(subDays(today, 3)), status: 'vencido' },
];

// Gerar contas a pagar mockadas
export const payables: Payable[] = [
  { id: 'pay-1', supplierName: 'Fornecedor Alpha', value: 12000, dueDate: formatDate(subDays(today, 12)), status: 'vencido' },
  { id: 'pay-2', supplierName: 'Materiais Pro', value: 5600, dueDate: formatDate(subDays(today, 8)), status: 'vencido' },
  { id: 'pay-3', supplierName: 'Energia Elétrica', value: 3200, dueDate: formatDate(addDays(today, 3)), status: 'proximo_vencer' },
  { id: 'pay-4', supplierName: 'Internet & Telecom', value: 890, dueDate: formatDate(addDays(today, 5)), status: 'proximo_vencer' },
  { id: 'pay-5', supplierName: 'Aluguel Comercial', value: 8500, dueDate: formatDate(addDays(today, 10)), status: 'em_aberto' },
  { id: 'pay-6', supplierName: 'Seguros Gerais', value: 2100, dueDate: formatDate(addDays(today, 12)), status: 'em_aberto' },
  { id: 'pay-7', supplierName: 'Combustíveis SA', value: 4500, dueDate: formatDate(addDays(today, 15)), status: 'em_aberto' },
  { id: 'pay-8', supplierName: 'Manutenção Pred.', value: 1800, dueDate: formatDate(addDays(today, 18)), status: 'em_aberto' },
  { id: 'pay-9', supplierName: 'Limpeza Corp', value: 950, dueDate: formatDate(addDays(today, 20)), status: 'em_aberto' },
  { id: 'pay-10', supplierName: 'Contabilidade', value: 2500, dueDate: formatDate(addDays(today, 25)), status: 'em_aberto' },
  { id: 'pay-11', supplierName: 'Software License', value: 3800, dueDate: formatDate(addDays(today, 28)), status: 'em_aberto' },
  { id: 'pay-12', supplierName: 'Marketing Digital', value: 6200, dueDate: formatDate(addDays(today, 30)), status: 'em_aberto' },
  { id: 'pay-13', supplierName: 'Transporte Frete', value: 2900, dueDate: formatDate(addDays(today, 35)), status: 'em_aberto' },
  { id: 'pay-14', supplierName: 'Água e Saneamento', value: 480, dueDate: formatDate(addDays(today, 40)), status: 'em_aberto' },
  { id: 'pay-15', supplierName: 'Serviços Cloud', value: 1500, dueDate: formatDate(subDays(today, 2)), status: 'vencido' },
];

// Saldo em conta
export const accountBalance: AccountBalance = {
  bankName: 'Banco do Brasil',
  balance: 45230.50,
  lastUpdate: formatDate(today),
};

// Funções auxiliares
export const getReceivablesByStatus = (status: 'em_aberto' | 'proximo_vencer' | 'vencido'): Receivable[] => {
  return receivables.filter(r => r.status === status).sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
};

export const getPayablesByStatus = (status: 'em_aberto' | 'proximo_vencer' | 'vencido'): Payable[] => {
  return payables.filter(p => p.status === status).sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
};

export const getTotalReceivables = (): number => {
  return receivables.reduce((sum, r) => sum + r.value, 0);
};

export const getTotalReceivablesOverdue = (): number => {
  return receivables.filter(r => r.status === 'vencido').reduce((sum, r) => sum + r.value, 0);
};

export const getTotalPayables = (): number => {
  return payables.reduce((sum, p) => sum + p.value, 0);
};

export const getTotalPayablesOverdue = (): number => {
  return payables.filter(p => p.status === 'vencido').reduce((sum, p) => sum + p.value, 0);
};

export const getMonthlyPayables = (): number => {
  const thirtyDaysFromNow = addDays(today, 30);
  return payables
    .filter(p => {
      const dueDate = new Date(p.dueDate);
      return isAfter(dueDate, today) && isBefore(dueDate, thirtyDaysFromNow);
    })
    .reduce((sum, p) => sum + p.value, 0);
};

export const getMonthlyPayablesCount = (): number => {
  const thirtyDaysFromNow = addDays(today, 30);
  return payables.filter(p => {
    const dueDate = new Date(p.dueDate);
    return isAfter(dueDate, today) && isBefore(dueDate, thirtyDaysFromNow);
  }).length;
};

export const calculateProjection = (days: 15 | 30 | 45): ProjectionData[] => {
  const projectionData: ProjectionData[] = [];
  let runningBalance = accountBalance.balance;

  for (let i = 1; i <= days; i++) {
    const targetDate = addDays(today, i);
    const dateStr = formatDate(targetDate);

    // Soma recebimentos do dia
    const dayReceivables = receivables
      .filter(r => r.dueDate === dateStr)
      .reduce((sum, r) => sum + r.value, 0);

    // Soma pagamentos do dia
    const dayPayables = payables
      .filter(p => p.dueDate === dateStr)
      .reduce((sum, p) => sum + p.value, 0);

    // Atualiza saldo
    runningBalance = runningBalance + dayReceivables - dayPayables;

    projectionData.push({
      day: i,
      date: format(targetDate, 'dd/MM'),
      receivables: dayReceivables,
      payables: dayPayables,
      balance: runningBalance,
    });
  }

  return projectionData;
};

// Formatação de moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Contadores
export const getOverdueReceivablesCount = (): number => {
  return receivables.filter(r => r.status === 'vencido').length;
};

export const getOverduePayablesCount = (): number => {
  return payables.filter(p => p.status === 'vencido').length;
};
