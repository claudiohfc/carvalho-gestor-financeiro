// Stub: tabela people foi removida. Aguardando refatoração.
import { useState, useCallback } from 'react';

export interface DbPerson {
  id: number;
  user_id: string;
  type: 'socio' | 'funcionario' | 'colaborador' | 'terceiro';
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean | null;
  created_at: string | null;
}

export function usePeople() {
  const [people] = useState<DbPerson[]>([]);
  const [loading] = useState(false);
  const err = useCallback(async (..._args: any[]) => ({ error: new Error('Aguardando migração para o novo schema') as any, data: undefined as any }), []);
  const noop = useCallback(async (..._args: any[]) => {}, []);
  return { people, loading, addPerson: err, updatePerson: err, deletePerson: err, refetch: noop };
}
