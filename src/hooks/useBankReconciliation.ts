// Stub: tabelas antigas (bank_accounts, bank_statements, transactions) foram removidas.
// Aguardando refatoração para as novas tabelas (extratos, extrato_linhas, conciliacoes, lancamentos).
import { useState, useCallback } from 'react';

export interface BankAccount {
  id: number;
  user_id: string;
  bank_name: string;
  account_name: string;
  created_at: string | null;
}

export interface BankStatement {
  id: number;
  user_id: string;
  bank_account_id: number;
  date: string;
  description: string | null;
  amount: number;
  type: 'credito' | 'debito';
  reconciled: boolean;
  matched_transaction_id: number | null;
  divergence_reason: string | null;
  created_at: string | null;
}

export function useBankReconciliation() {
  const [accounts] = useState<BankAccount[]>([]);
  const [statements] = useState<BankStatement[]>([]);
  const [loading] = useState(false);

  const noop = useCallback(async (..._args: any[]) => {}, []);
  const noopWithArg = useCallback(async (..._args: any[]) => {}, []);
  const returnError = useCallback(async (..._args: any[]) => ({ error: new Error('Aguardando migração para o novo schema') as any, data: undefined as any }), []);

  return {
    accounts,
    statements,
    loading,
    fetchAccounts: noop,
    fetchStatements: noopWithArg,
    addAccount: returnError,
    importStatements: returnError,
    reconcileStatement: returnError,
    deleteStatement: returnError,
    autoReconcile: noopWithArg,
  };
}
