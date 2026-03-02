import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSimulations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('scenario_simulations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSimulations(data as unknown as Simulation[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSimulations(); }, [fetchSimulations]);

  const saveSimulation = useCallback(async (sim: { type: string; description: string; input_data: any; result_data: any }) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('scenario_simulations')
      .insert({ ...sim, user_id: user.id } as any)
      .select()
      .single();
    if (!error) await fetchSimulations();
    return { data, error };
  }, [user, fetchSimulations]);

  const deleteSimulation = useCallback(async (id: number) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('scenario_simulations')
      .delete()
      .eq('id', id);
    if (!error) await fetchSimulations();
    return { error };
  }, [user, fetchSimulations]);

  return { simulations, loading, fetchSimulations, saveSimulation, deleteSimulation };
}
