import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<DbTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) setTransactions(data as unknown as DbTransaction[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (tx: Omit<DbTransaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...tx, user_id: user.id } as any)
      .select()
      .single();
    if (!error) await fetchTransactions();
    return { data, error };
  }, [user, fetchTransactions]);

  const updateTransaction = useCallback(async (id: number, updates: Partial<DbTransaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    if (!error) await fetchTransactions();
    return { data, error };
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id: number) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (!error) await fetchTransactions();
    return { error };
  }, [fetchTransactions]);

  return { transactions, loading, addTransaction, updateTransaction, deleteTransaction, refetch: fetchTransactions };
}
