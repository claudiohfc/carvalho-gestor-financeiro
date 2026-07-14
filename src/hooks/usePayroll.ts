// Stub: tabela payroll_records foi removida. Aguardando refatoração.
import { useState, useCallback } from 'react';

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
  const [records] = useState<DbPayrollRecord[]>([]);
  const [loading] = useState(false);
  const err = useCallback(async () => ({ error: new Error('Aguardando migração para o novo schema') as any, data: undefined as any }), []);
  const noop = useCallback(async () => {}, []);
  return { records, loading, addRecord: err, updateRecord: err, deleteRecord: err, refetch: noop };
}
