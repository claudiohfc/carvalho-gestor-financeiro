// Dados mockados para Conciliação Bancária

export type ReconciliationStatus = 'conciliado' | 'pendente' | 'divergente';

export interface BankStatement {
  id: string;
  date: string;
  description: string;
  value: number;
  type: 'credito' | 'debito';
  status: ReconciliationStatus;
  matchedTransactionId?: string;
  divergenceReason?: string;
}

export interface SystemPayment {
  id: string;
  date: string;
  description: string;
  value: number;
  type: 'entrada' | 'saida';
  status: 'pendente' | 'pago';
}

// Pagamentos em aberto no sistema
export const systemPayments: SystemPayment[] = [
  { id: 'sp1', date: '2025-01-15', description: 'Pagamento Fornecedor ABC', value: 850, type: 'saida', status: 'pendente' },
  { id: 'sp2', date: '2025-01-16', description: 'Transferência PIX - Serviços', value: 500, type: 'saida', status: 'pendente' },
  { id: 'sp3', date: '2025-01-18', description: 'Débito Energia Elétrica', value: 420, type: 'saida', status: 'pendente' },
  { id: 'sp4', date: '2025-01-20', description: 'Aluguel Escritório', value: 8500, type: 'saida', status: 'pendente' },
  { id: 'sp5', date: '2025-01-22', description: 'Internet e Telefonia', value: 650, type: 'saida', status: 'pendente' },
  { id: 'sp6', date: '2025-01-10', description: 'Recebimento Cliente Premium', value: 18500, type: 'entrada', status: 'pendente' },
  { id: 'sp7', date: '2025-01-12', description: 'Recebimento Consultoria', value: 45000, type: 'entrada', status: 'pendente' },
];

// Extrato bancário mockado
export const generateBankStatement = (): BankStatement[] => {
  return [
    { id: 'bs1', date: '2025-01-10', description: 'TED RECEBIDA - PREMIUM CORP', value: 18500, type: 'credito', status: 'conciliado', matchedTransactionId: 'sp6' },
    { id: 'bs2', date: '2025-01-12', description: 'TED RECEBIDA - EMPRESA ABC SA', value: 45000, type: 'credito', status: 'conciliado', matchedTransactionId: 'sp7' },
    { id: 'bs3', date: '2025-01-15', description: 'PGTO BOLETO - FORNEC ABC', value: 850, type: 'debito', status: 'conciliado', matchedTransactionId: 'sp1' },
    { id: 'bs4', date: '2025-01-16', description: 'PIX ENVIADO', value: 500, type: 'debito', status: 'pendente' },
    { id: 'bs5', date: '2025-01-18', description: 'DEBITO AUTOMATICO - ENERGIA', value: 485, type: 'debito', status: 'divergente', matchedTransactionId: 'sp3', divergenceReason: 'Valor diferente: Sistema R$ 420,00 / Extrato R$ 485,00' },
    { id: 'bs6', date: '2025-01-19', description: 'TARIFA BANCARIA', value: 45, type: 'debito', status: 'pendente' },
    { id: 'bs7', date: '2025-01-20', description: 'PGTO ALUGUEL', value: 8500, type: 'debito', status: 'conciliado', matchedTransactionId: 'sp4' },
    { id: 'bs8', date: '2025-01-21', description: 'PIX RECEBIDO - GRUPO XYZ', value: 28000, type: 'credito', status: 'pendente' },
    { id: 'bs9', date: '2025-01-22', description: 'DEBITO AUTOMATICO - TELECOM', value: 650, type: 'debito', status: 'conciliado', matchedTransactionId: 'sp5' },
    { id: 'bs10', date: '2025-01-23', description: 'IOF S/ OPERACOES', value: 12.50, type: 'debito', status: 'pendente' },
    { id: 'bs11', date: '2025-01-25', description: 'TED ENVIADA - FORNECEDOR', value: 3200, type: 'debito', status: 'pendente' },
    { id: 'bs12', date: '2025-01-26', description: 'PIX RECEBIDO - STARTUP TECH', value: 22000, type: 'credito', status: 'pendente' },
  ];
};

// Função para simular cruzamento automático
export const autoReconcile = (statements: BankStatement[], payments: SystemPayment[]): BankStatement[] => {
  return statements.map(stmt => {
    // Se já está conciliado, mantém
    if (stmt.status === 'conciliado') return stmt;
    
    // Procura pagamento correspondente
    const matchedPayment = payments.find(p => {
      const stmtType = stmt.type === 'credito' ? 'entrada' : 'saida';
      const dateMatch = p.date === stmt.date;
      const valueMatch = Math.abs(p.value - stmt.value) < 0.01;
      const typeMatch = p.type === stmtType;
      
      return dateMatch && valueMatch && typeMatch && p.status === 'pendente';
    });
    
    if (matchedPayment) {
      return { ...stmt, status: 'conciliado' as ReconciliationStatus, matchedTransactionId: matchedPayment.id };
    }
    
    // Verifica divergência de valor
    const potentialMatch = payments.find(p => {
      const stmtType = stmt.type === 'credito' ? 'entrada' : 'saida';
      const dateMatch = Math.abs(new Date(p.date).getTime() - new Date(stmt.date).getTime()) <= 2 * 24 * 60 * 60 * 1000;
      const valueClose = Math.abs(p.value - stmt.value) / p.value < 0.2; // 20% de diferença
      const typeMatch = p.type === stmtType;
      
      return dateMatch && valueClose && typeMatch && !potentialMatch && p.status === 'pendente';
    });
    
    if (potentialMatch && Math.abs(potentialMatch.value - stmt.value) > 0.01) {
      return {
        ...stmt,
        status: 'divergente' as ReconciliationStatus,
        matchedTransactionId: potentialMatch.id,
        divergenceReason: `Valor diferente: Sistema R$ ${potentialMatch.value.toFixed(2)} / Extrato R$ ${stmt.value.toFixed(2)}`
      };
    }
    
    return stmt;
  });
};
