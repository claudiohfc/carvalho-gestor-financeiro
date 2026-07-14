// Stub: tabela scenario_simulations foi removida (substituída por simulacoes). Aguardando refatoração.
import { useState, useCallback } from 'react';

export interface Simulation {
  id: number;
  user_id: string;
  type: string;
  description: string | null;
  input_data: any;
  result_data: any;
  created_at: string | null;
}

export function useSimulations() {
  const [simulations] = useState<Simulation[]>([]);
  const [loading] = useState(false);
  const err = useCallback(async () => ({ error: new Error('Aguardando migração para o novo schema') as any, data: undefined as any }), []);
  const noop = useCallback(async () => {}, []);
  return { simulations, loading, fetchSimulations: noop, saveSimulation: err, deleteSimulation: err };
}
