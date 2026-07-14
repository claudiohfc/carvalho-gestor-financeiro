// Stub: tabela transactions foi removida (substituída por lancamentos). Aguardando refatoração.
import { useState, useCallback } from 'react';

export interface DbTransaction {
  id: number;
  user_id: string;
  type: 'entrada' | 'saida';
  date: string;
  description: string;
  category: string;
  subcategory: string | null;
  amount: number;
  cost_center: string | null;
  client_or_supplier: string | null;
  payment_method: string | null;
  tags: string[] | null;
  recurring: boolean | null;
  notes: string | null;
  created_at: string | null;
}

export function useTransactions() {
  const [transactions] = useState<DbTransaction[]>([]);
  const [loading] = useState(false);
  const err = useCallback(async () => ({ error: new Error('Aguardando migração para o novo schema') as any, data: undefined as any }), []);
  const noop = useCallback(async () => {}, []);
  return { transactions, loading, addTransaction: err, updateTransaction: err, deleteTransaction: err, refetch: noop };
}
