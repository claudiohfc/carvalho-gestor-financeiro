import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DbPayrollRecord {
  id: number;
  user_id: string;
  person_id: number;
  reference_month: string;
  pro_labore: number;
  salary: number;
  commissions: number;
  reimbursements: number;
  vale_transporte: number;
  vale_alimentacao: number;
  benefits: number;
  decimo_terceiro_1: number;
  decimo_terceiro_2: number;
  ferias: number;
  fgts: number;
  inss: number;
  ir: number;
  total_cost: number;
  created_at: string | null;
}

export function usePayroll() {
  const { user } = useAuth();
  const [records, setRecords] = useState<DbPayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('payroll_records')
      .select('*')
      .order('reference_month', { ascending: false });
    if (!error && data) setRecords(data as unknown as DbPayrollRecord[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = useCallback(async (record: Omit<DbPayrollRecord, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('payroll_records')
      .insert({ ...record, user_id: user.id } as any)
      .select()
      .single();
    if (!error) await fetchRecords();
    return { data, error };
  }, [user, fetchRecords]);

  const updateRecord = useCallback(async (id: number, updates: Partial<DbPayrollRecord>) => {
    const { data, error } = await supabase
      .from('payroll_records')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    if (!error) await fetchRecords();
    return { data, error };
  }, [fetchRecords]);

  const deleteRecord = useCallback(async (id: number) => {
    const { error } = await supabase
      .from('payroll_records')
      .delete()
      .eq('id', id);
    if (!error) await fetchRecords();
    return { error };
  }, [fetchRecords]);

  return { records, loading, addRecord, updateRecord, deleteRecord, refetch: fetchRecords };
}
