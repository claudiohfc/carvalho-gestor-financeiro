import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [statements, setStatements] = useState<BankStatement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('bank_accounts').select('*').order('created_at', { ascending: false });
    if (data) setAccounts(data as unknown as BankAccount[]);
  }, [user]);

  const fetchStatements = useCallback(async (accountId?: number) => {
    if (!user) return;
    setLoading(true);
    let query = supabase.from('bank_statements').select('*').order('date', { ascending: false });
    if (accountId) query = query.eq('bank_account_id', accountId);
    const { data } = await query;
    if (data) setStatements(data as unknown as BankStatement[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAccounts(); fetchStatements(); }, [fetchAccounts, fetchStatements]);

  const addAccount = useCallback(async (account: { bank_name: string; account_name: string }) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('bank_accounts')
      .insert({ ...account, user_id: user.id } as any)
      .select()
      .single();
    if (!error) await fetchAccounts();
    return { data: data as unknown as BankAccount, error };
  }, [user, fetchAccounts]);

  const importStatements = useCallback(async (accountId: number, items: Array<{ date: string; description: string; amount: number; type: 'credito' | 'debito' }>) => {
    if (!user) return { error: new Error('Not authenticated') };
    const rows = items.map(item => ({ ...item, user_id: user.id, bank_account_id: accountId }));
    const { error } = await supabase.from('bank_statements').insert(rows as any);
    if (!error) await fetchStatements(accountId);
    return { error };
  }, [user, fetchStatements]);

  const reconcileStatement = useCallback(async (id: number, matchedTransactionId?: number) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('bank_statements')
      .update({ reconciled: true, matched_transaction_id: matchedTransactionId ?? null, divergence_reason: null } as any)
      .eq('id', id);
    if (!error) await fetchStatements();
    return { error };
  }, [user, fetchStatements]);

  const deleteStatement = useCallback(async (id: number) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase.from('bank_statements').delete().eq('id', id);
    if (!error) await fetchStatements();
    return { error };
  }, [user, fetchStatements]);

  const autoReconcile = useCallback(async (accountId: number) => {
    if (!user) return;
    // Fetch unreconciled statements for this account
    const { data: unreconciledStmts } = await supabase
      .from('bank_statements')
      .select('*')
      .eq('bank_account_id', accountId)
      .eq('reconciled', false);

    if (!unreconciledStmts || unreconciledStmts.length === 0) return;

    // Fetch transactions to match against
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*');

    if (!transactions) return;

    for (const stmt of unreconciledStmts as unknown as BankStatement[]) {
      const stmtType = stmt.type === 'credito' ? 'entrada' : 'saida';
      // Exact match by value and date
      const exactMatch = transactions.find(t =>
        t.type === stmtType &&
        Math.abs(Number(t.amount) - Math.abs(stmt.amount)) < 0.01 &&
        t.date === stmt.date
      );
      if (exactMatch) {
        await supabase
          .from('bank_statements')
          .update({ reconciled: true, matched_transaction_id: exactMatch.id, divergence_reason: null } as any)
          .eq('id', stmt.id);
        continue;
      }
      // Close match (within 2 days, within 20% value)
      const closeMatch = transactions.find(t => {
        if (t.type !== stmtType) return false;
        const daysDiff = Math.abs(new Date(t.date).getTime() - new Date(stmt.date).getTime()) / (1000 * 60 * 60 * 24);
        const valueDiff = Math.abs(Number(t.amount) - Math.abs(stmt.amount)) / Number(t.amount);
        return daysDiff <= 2 && valueDiff < 0.2 && valueDiff > 0.001;
      });
      if (closeMatch) {
        await supabase
          .from('bank_statements')
          .update({
            divergence_reason: `Valor diferente: Sistema R$ ${Number(closeMatch.amount).toFixed(2)} / Extrato R$ ${Math.abs(stmt.amount).toFixed(2)}`,
            matched_transaction_id: closeMatch.id,
          } as any)
          .eq('id', stmt.id);
      }
    }
    await fetchStatements(accountId);
  }, [user, fetchStatements]);

  return { accounts, statements, loading, fetchAccounts, fetchStatements, addAccount, importStatements, reconcileStatement, deleteStatement, autoReconcile };
}
